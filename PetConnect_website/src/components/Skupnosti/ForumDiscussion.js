import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import Navbar from 'components/Navbars/Navbar.js';
import SimpleFooter from 'components/Footers/SimpleFooter.js';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Form, FormGroup, Label, Input } from 'reactstrap';

const ForumDiscussion = () => {
    const { topicId } = useParams();
    const [topic, setTopic] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const firestore = getFirestore();

    useEffect(() => {
        const fetchTopic = async () => {
            const topicDoc = doc(firestore, 'topics', topicId);
            const docSnap = await getDoc(topicDoc);
            if (docSnap.exists()) {
                setTopic(docSnap.data());
            }
        };

        const fetchComments = async () => {
            const commentsCollection = collection(firestore, 'topics', topicId, 'comments');
            const commentsSnapshot = await getDocs(commentsCollection);
            const commentsList = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            commentsList.sort((a, b) => a.date.seconds - b.date.seconds);
            setComments(commentsList);
        };

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

        fetchTopic();
        fetchComments();
        fetchCurrentUser();
    }, [firestore, topicId]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleAddComment = async () => {
        if (currentUser) {
            const comment = {
                content: newComment,
                date: serverTimestamp(),
                user: {
                    uid: currentUser.uid,
                    email: currentUser.email,
                }
            };
            await addDoc(collection(firestore, 'topics', topicId, 'comments'), comment);
            setNewComment('');
            const fetchComments = async () => {
                const commentsCollection = collection(firestore, 'topics', topicId, 'comments');
                const commentsSnapshot = await getDocs(commentsCollection);
                const commentsList = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                commentsList.sort((a, b) => a.date.seconds - b.date.seconds);
                setComments(commentsList);
            };
            fetchComments();
        }
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
                    {topic ? (
                        <Row>
                            <Col md="12">
                                <Card className="activity-card" style={{ marginBottom: '3%', border: '1px solid #ddd', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                    <CardBody>
                                        <CardTitle tag="h3" style={{ color: '#007bff' }}>{topic.title}</CardTitle>
                                        <CardText>{topic.content}</CardText>
                                        <CardText>
                                            <small className="text-muted">
                                                Objavil/a {topic.user.email} on {new Date(topic.date.seconds * 1000).toLocaleString()}
                                            </small>
                                        </CardText>
                                    </CardBody>
                                </Card>
                                <h4>Diskusija</h4>
                                {comments.length > 0 ? (
                                    comments.map((comment, index) => (
                                        <Card key={index} className="mb-2" style={{ border: '1px solid #ddd', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                            <CardBody>
                                                <CardText>{comment.content}</CardText>
                                                <CardText>
                                                    <small className="text-muted">
                                                        Commented by {comment.user.email} on {new Date(comment.date.seconds * 1000).toLocaleString()}
                                                    </small>
                                                </CardText>
                                            </CardBody>
                                        </Card>
                                    ))
                                ) : (
                                    <p>Tema še nima komentarjev. Bodi prvi!</p>
                                )}
                                {currentUser && (
                                    <Card className="mt-3">
                                        <CardBody>
                                            <Form>
                                                <FormGroup>
                                                    <Label for="comment">Dodaj komentar</Label>
                                                    <Input 
                                                        type="textarea" 
                                                        name="comment" 
                                                        id="comment" 
                                                        value={newComment} 
                                                        onChange={handleCommentChange} 
                                                    />
                                                </FormGroup>
                                                <Button color="primary" onClick={handleAddComment}>Objavi komentar</Button>
                                            </Form>
                                        </CardBody>
                                    </Card>
                                )}
                            </Col>
                        </Row>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Container>
            </main>
            <SimpleFooter />
        </div>
    );
};

export default ForumDiscussion;
