import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import Navbar from 'components/Navbars/Navbar.js';
import SimpleFooter from 'components/Footers/SimpleFooter.js';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';

const LokalneSkupnosti = () => {
    const [groups, setGroups] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', description: '' });
    const [currentUser, setCurrentUser] = useState(null);
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

    return (
        <div>
            <Navbar />
            <section className="section section-shaped section-lg">
                <div className="shape shape-style-1 shape-default alpha-4">
                    <span />
                </div>
            </section>
            <main>
                <Container className="mt-5">
                    <h2 className="text-center display-2 mb-5">Lokalne Skupnosti</h2>
                    <Row className="justify-content-end mb-3">
                        {currentUser && (
                            <Button color="primary" onClick={toggleModal}>Ustvari Novo Skupino</Button>
                        )}
                    </Row>
                    <Row>
                        {groups.map((group, index) => (
                            <Col md="12" key={index} className="mb-3">
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5">{group.name}</CardTitle>
                                        <CardText>{group.description}</CardText>
                                        <CardText>
                                            <small className="text-muted">
                                                Ustvaril {group.user.email} dne {new Date(group.date.seconds * 1000).toLocaleString()}
                                            </small>
                                        </CardText>
                                        <Button color="secondary" onClick={() => handleOpenGroup(group.id)}>Odpri Skupino</Button>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </main>
            <SimpleFooter />
            
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
        </div>
    );
};

export default LokalneSkupnosti;
