import React, { useState, useEffect } from 'react';
import { firestore } from "components/Firebase/Firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { Container, Row, Col, Card, CardBody, CardTitle, Spinner, Alert, Collapse } from 'reactstrap';
import Navbar from "components/Navbars/Navbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";

const PogostaVprasanja = () => {
    const [topQuestions, setTopQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        const fetchTopQuestions = async () => {
            setLoading(true);
            setError('');
            try {
                const querySnapshot = await getDocs(collection(firestore, "users"));
                let allQuestions = [];

                // Iterate through each user document
                for (let userDoc of querySnapshot.docs) {
                    const userHistoryRef = collection(firestore, "users", userDoc.id, "history");
                    const historySnapshot = await getDocs(userHistoryRef);
                    const userQuestions = historySnapshot.docs.map(doc => doc.data());
                    allQuestions = allQuestions.concat(userQuestions);
                }

                // Count the frequency of each question
                const questionFrequency = allQuestions.reduce((acc, { question, answer }) => {
                    if (acc[question]) {
                        acc[question].count += 1;
                    } else {
                        acc[question] = { question, answer, count: 1 };
                    }
                    return acc;
                }, {});

                // Sort questions by frequency and take top 10
                const sortedQuestions = Object.values(questionFrequency)
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10);

                setTopQuestions(sortedQuestions);
            } catch (error) {
                console.error("Error fetching top questions:", error);
                setError('Could not fetch top questions.');
            } finally {
                setLoading(false);
            }
        };

        fetchTopQuestions();
    }, []);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            <Navbar />
            <main>
                <section className="section section-shaped section-lg">
                    <div className="shape shape-style-1 shape-default alpha-4">
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                    </div>
                </section>
                <section>
                    <Container className="mt-4">
                        <Row className="justify-content-center">
                            <Col md="8">
                                <h1 className="text-center display-3">Najbolj Pogosto Postavljena Vprašanja</h1>
                                {loading ? (
                                    <div className="text-center">
                                        <Spinner style={{ width: '3rem', height: '3rem' }} />
                                    </div>
                                ) : error ? (
                                    <Alert color="danger">
                                        <h4 className="alert-heading">Napaka</h4>
                                        <p>{error}</p>
                                    </Alert>
                                ) : (
                                    topQuestions.map((questionData, index) => (
                                        <Card key={index} className="mb-3" onClick={() => toggle(index)} style={{ cursor: 'pointer' }}>
                                            <CardBody>
                                                <CardTitle tag="h5">{questionData.question}</CardTitle>
                                                <Collapse isOpen={openIndex === index}>
                                                    <p>{questionData.answer}</p>
                                                </Collapse>
                                            </CardBody>
                                        </Card>
                                    ))
                                )}
                            </Col>
                        </Row>
                    </Container>
                </section>
            </main>
            <SimpleFooter />
        </>
    );
};

export default PogostaVprasanja;
