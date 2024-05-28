import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Navbar from 'components/Navbars/Navbar.js';
import SimpleFooter from 'components/Footers/SimpleFooter.js';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

const Forum = () => {
    const [topics, setTopics] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newTopic, setNewTopic] = useState({ title: '', content: '' });
    const [currentUser, setCurrentUser] = useState(null);
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
                    <h2 className="text-center display-2 mb-5">Forum</h2>
                    <Row className="justify-content-end mb-3">
                        {currentUser && (
                            <Button color="primary" onClick={toggleModal}>Add New Topic</Button>
                        )}
                    </Row>
                    <Row className="justify-content-center mb-4">
                        <Col md="8">
                            <Card>
                                <CardBody>
                                    <p className="mb-2">Išči forum:</p>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <span className="input-group-text">
                                                <FontAwesomeIcon icon={faSearch} />
                                            </span>
                                        </InputGroupAddon>
                                        <Input 
                                            type="text" 
                                            placeholder="Začni tipkati ključno besedo" 
                                        />
                                    </InputGroup>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        {topics.map((topic, index) => (
                            <Col md="12" key={index} className="mb-3">
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5">{topic.title}</CardTitle>
                                        <CardText>{topic.content}</CardText>
                                        <CardText>
                                            <small className="text-muted">
                                                Posted by {topic.user.email} on {new Date(topic.date.seconds * 1000).toLocaleString()}
                                            </small>
                                        </CardText>
                                        <Button color="secondary" onClick={() => handleOpenForum(topic.id)}>Open Forum</Button>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </main>
            <SimpleFooter />
            
            <Modal isOpen={modalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Add New Topic</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="title">Title</Label>
                            <Input type="text" name="title" id="title" value={newTopic.title} onChange={handleInputChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="content">Content</Label>
                            <Input type="textarea" name="content" id="content" value={newTopic.content} onChange={handleInputChange} />
                        </FormGroup>
                        <Button color="primary" onClick={handleAddTopic}>Add Topic</Button>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default Forum;
