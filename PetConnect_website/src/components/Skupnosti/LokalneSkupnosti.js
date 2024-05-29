import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faComment } from '@fortawesome/free-solid-svg-icons';
import Navbar from 'components/Navbars/Navbar.js';
import SimpleFooter from 'components/Footers/SimpleFooter.js';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

const LokalneSkupnosti = () => {
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', description: '' });
    const [currentUser, setCurrentUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const firestore = getFirestore();
    const navigate = useNavigate();

    const toggleModal = () => setModalOpen(!modalOpen);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGroup({ ...newGroup, [name]: value });
    };

    const handleAddGroup = async () => {
        if (currentUser) {
            const group = {
                ...newGroup,
                date: serverTimestamp(),
                user: {
                    uid: currentUser.uid,
                    email: currentUser.email,
                }
            };
            await addDoc(collection(firestore, 'groups'), group);
            fetchGroups();
            setNewGroup({ name: '', description: '' });
            toggleModal();
        }
    };

    const fetchGroups = async () => {
        const querySnapshot = await getDocs(collection(firestore, 'groups'));
        const groupsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGroups(groupsList);
        setFilteredGroups(groupsList);
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const userUid = localStorage.getItem('userUid');
            if (userUid) {
                const userDoc = doc(firestore, 'users', userUid);
                const docSnap = await getDoc(userDoc);
                if (docSnap.exists()) {
                    setCurrentUser({ uid: userUid, ...docSnap.data() });
                }
            }
        };

        fetchCurrentUser();
        fetchGroups();
    }, [firestore]);

    const handleOpenGroup = (groupId) => {
        navigate(`/pogovor-skupine/${groupId}`);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        applyFilters(query);
    };

    const applyFilters = (query) => {
        let filtered = groups;
        if (query) {
            filtered = filtered.filter(group => group.name.toLowerCase().includes(query.toLowerCase()));
        }
        setFilteredGroups(filtered);
    };

    const renderList = () => {
        return (
            <Row>
                <Col md="3">
                    <Card>
                        <CardBody>
                            <p className="mb-3">Išči skupine:</p>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input 
                                    type="text" 
                                    placeholder="Vtipkaj iskalni niz" 
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </InputGroup>
                        </CardBody>
                        {currentUser && (
                            <Col className="text-center" xs="auto">
                                <Button color="info" onClick={toggleModal}>Ustvari Novo Skupino</Button>
                            </Col>
                        )}
                    </Card>
                </Col>
                <Col md="9">
                    <div style={{ marginTop: '3%' }}>
                        {filteredGroups.map((group, index) => (
                            <Card key={index} className="activity-card" style={{ marginBottom: '3%', border: '1px solid #ddd', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                <CardBody>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <CardTitle tag="h3" style={{ color: '#007bff' }}>{group.name}</CardTitle>
                                    </div>
                                    <CardText>{group.description}</CardText>
                                    <CardText>
                                        <small className="text-muted">
                                            Ustvaril {group.user.email} dne {new Date(group.date.seconds * 1000).toLocaleString()}
                                        </small>
                                    </CardText>
                                    <Button color="secondary" onClick={() => handleOpenGroup(group.id)}>Odpri Skupino</Button>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </Col>
            </Row>
        );
    };

    return (
        <div>
            <Navbar />
            <section className="section section-shaped section-lg">
                <div className="shape shape-style-1 shape-default alpha-4">
                    <span />
                </div>
                <Container className="py-lg-md d-flex">
                    <div className="col px-0">
                        <Row>
                            <Col lg="9">
                                <h1 className="display-2 text-white">
                                    Moje skupine
                                </h1>
                                <p className="lead text-white">
                                    Pridruži se skupini in izmenjuj mnenja ter izkušnje o različnih problemih.
                                </p>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>
            <main>
                <Container className="mt-5">
                    {renderList()}
                </Container>
                <Modal isOpen={modalOpen} toggle={toggleModal}>
                    <ModalHeader toggle={toggleModal}>Ustvari Novo Skupino</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="name">Ime Skupine</Label>
                                <Input type="text" name="name" id="name" value={newGroup.name} onChange={handleInputChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Opis</Label>
                                <Input type="textarea" name="description" id="description" value={newGroup.description} onChange={handleInputChange} />
                            </FormGroup>
                            <Button color="primary" onClick={handleAddGroup}>Dodaj Skupino</Button>
                        </Form>
                    </ModalBody>
                </Modal>
            </main>
            <SimpleFooter />
        </div>
    );
};

export default LokalneSkupnosti;
