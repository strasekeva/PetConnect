import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Navbar from 'components/Navbars/Navbar.js';
import SimpleFooter from 'components/Footers/SimpleFooter.js';
import { Container, Card, CardBody, CardTitle, CardText } from 'reactstrap';

const ForumDiscussion = () => {
    const { topicId } = useParams();
    const [topic, setTopic] = useState(null);
    const firestore = getFirestore();

    useEffect(() => {
        const fetchTopic = async () => {
            const topicDoc = doc(firestore, 'topics', topicId);
            const docSnap = await getDoc(topicDoc);
            if (docSnap.exists()) {
                setTopic(docSnap.data());
            }
        };

        fetchTopic();
    }, [firestore, topicId]);

    return (
        <div>
            <Navbar />
            <main>
                <Container className="mt-5">
                    {topic ? (
                        <Card>
                            <CardBody>
                                <CardTitle tag="h3">{topic.title}</CardTitle>
                                <CardText>{topic.content}</CardText>
                                <CardText>
                                    <small className="text-muted">
                                        Posted by {topic.user.email} on {new Date(topic.date.seconds * 1000).toLocaleString()}
                                    </small>
                                </CardText>
                                {/* Add discussion content here */}
                            </CardBody>
                        </Card>
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
