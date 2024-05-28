import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faComment } from '@fortawesome/free-solid-svg-icons'; // Uvožena ikona za komentarje
import Navbar from 'components/Navbars/Navbar.js';
import SimpleFooter from 'components/Footers/SimpleFooter.js';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

const Forum = () => {
    const [topics, setTopics] = useState([]);
    const [filteredTopics, setFilteredTopics] = useState([]);
    const [commentsCounts, setCommentsCounts] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [newTopic, setNewTopic] = useState({ title: '', content: '' });
    const [currentUser, setCurrentUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewOnly, setShowNewOnly] = useState(false);
    const firestore = getFirestore();
    const navigate = useNavigate();

    const toggleModal = () => setModalOpen(!modalOpen);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTopic({ ...newTopic, [name]: value });
    };

    const handleAddTopic = async () => {
        if (currentUser) {
            const topic = {
                ...newTopic,
                date: serverTimestamp(),
                user: {
                    uid: currentUser.uid,
                    email: currentUser.email,
                }
            };
            await addDoc(collection(firestore, 'topics'), topic);
            fetchTopics();
            setNewTopic({ title: '', content: '' });
            toggleModal();
        }
    };

    const fetchTopics = async () => {
        const querySnapshot = await getDocs(collection(firestore, 'topics'));
        const topicsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTopics(topicsList);
        setFilteredTopics(topicsList);
        fetchCommentsCounts(topicsList);
    };

    const fetchCommentsCounts = async (topicsList) => {
        const counts = {};
        for (const topic of topicsList) {
            const commentsSnapshot = await getDocs(collection(firestore, 'topics', topic.id, 'comments'));
            counts[topic.id] = commentsSnapshot.size;
        }
        setCommentsCounts(counts);
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
        fetchTopics();
    }, [firestore]);

    const handleOpenForum = (topicId) => {
        navigate(`/forum/${topicId}`);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        applyFilters(query, showNewOnly);
    };

    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setShowNewOnly(isChecked);
        applyFilters(searchQuery, isChecked);
    };

    const applyFilters = (query, newOnly) => {
        let filtered = topics;
        if (query) {
            filtered = filtered.filter(topic => topic.title.toLowerCase().includes(query.toLowerCase()));
        }
        if (newOnly) {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            filtered = filtered.filter(topic => new Date(topic.date.seconds * 1000) > oneWeekAgo);
        }
        setFilteredTopics(filtered);
    };

    const renderList = () => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        return (
            <Row>
                <Col md="3">
                    <Card>
                        <CardBody>
                            <p className="mb-3">Išči forum:</p>
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
                            <FormGroup check className="mt-3">
                                <Label check>
                                    <Input type="checkbox" checked={showNewOnly} onChange={handleCheckboxChange} />
                                    Pokaži samo nove
                                </Label>
                            </FormGroup>
                        </CardBody>
                        <Col className="text-center" xs="auto">
                            <Button color="info" onClick={toggleModal}>Odpri novo temo</Button>
                        </Col>
                        <p></p>
                    </Card>
                </Col>
                <Col md="9">
                    <div style={{ marginTop: '3%' }}>
                        {filteredTopics.map((topic, index) => {
                            const isNew = new Date(topic.date.seconds * 1000) > oneWeekAgo;
                            return (
                                <Card key={index} className="activity-card" style={{ marginBottom: '3%', border: '1px solid #ddd', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                    <CardBody>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <CardTitle tag="h3" style={{ color: '#007bff' }}>{topic.title}</CardTitle>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <FontAwesomeIcon icon={faComment} style={{ marginRight: '5px' }} />
                                                {commentsCounts[topic.id] || 0}
                                                {isNew && <div style={{ background: 'red', color: 'white', padding: '5px', borderRadius: '5px', marginLeft: '10px' }}>NOVO</div>}
                                            </div>
                                        </div>
                                        <CardText>{topic.content}</CardText>
                                        <CardText>
                                            <small className="text-muted">
                                                Objavil/a {topic.user.email} on {new Date(topic.date.seconds * 1000).toLocaleString()}
                                            </small>
                                        </CardText>
                                        <Button color="secondary" onClick={() => handleOpenForum(topic.id)}>Diskusija</Button>
                                    </CardBody>
                                </Card>
                            );
                        })}
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
                                Forumi                                </h1>
                                <p className="lead text-white">
                                Ali vas zanima, kakšne izkušnje imajo drugi lastniki domačih živali? Mogoče bi želeli slišati mnenje veterinarja ali nasvet izkušenih članov naših forumov. Preprosto začnite novo temo, in kmalu boste dobili odgovore.                                </p>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>
            <main>
                <Container className="mt-5">
                    {renderList()}
                    {currentUser && (
                        <Row className="justify-content-center" style={{ marginTop: '20px' }}> 
                        </Row>
                    )}
                </Container>
                <Modal isOpen={modalOpen} toggle={toggleModal}>
                    <ModalHeader toggle={toggleModal}>Odpri novo temo</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="title">Tema</Label>
                                <Input type="text" name="title" id="title" value={newTopic.title} onChange={handleInputChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="content">Vsebina</Label>
                                <Input type="textarea" name="content" id="content" value={newTopic.content} onChange={handleInputChange} />
                            </FormGroup>
                            <Button color="primary" onClick={handleAddTopic}>Dodaj novo temo</Button>
                        </Form>
                    </ModalBody>
                </Modal>
            </main>
            <SimpleFooter />
        </div>
    );
};

export default Forum;
