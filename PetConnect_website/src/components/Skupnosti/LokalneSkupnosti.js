import React from 'react';
import Navbar from 'components/Navbars/Navbar.js';
import SimpleFooter from 'components/Footers/SimpleFooter.js';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';

const LokalneSkupnosti = () => {
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
                            <Col lg="6">
                                <h1 className="display-2 text-white">
                                    Lokalna Skupnost
                                </h1>
                                <p className="lead text-white">
                                    Dobrodošli na strani lokalne skupnosti. Tukaj lahko najdete informacije o dogodkih, novicah in aktivnostih v vaši skupnosti.
                                </p>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>
            <main>
                <Container className="mt-5">
                    <Row>
                        <Col md="4">
                            <Card className="mb-4">
                                <CardBody>
                                    <CardTitle tag="h5">Dogodek 1</CardTitle>
                                    <CardText>
                                        Opis dogodka 1. Ta dogodek bo potekal dne 1. junija 2024.
                                    </CardText>
                                    <Button color="primary">Več informacij</Button>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="4">
                            <Card className="mb-4">
                                <CardBody>
                                    <CardTitle tag="h5">Dogodek 2</CardTitle>
                                    <CardText>
                                        Opis dogodka 2. Ta dogodek bo potekal dne 15. junija 2024.
                                    </CardText>
                                    <Button color="primary">Več informacij</Button>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="4">
                            <Card className="mb-4">
                                <CardBody>
                                    <CardTitle tag="h5">Dogodek 3</CardTitle>
                                    <CardText>
                                        Opis dogodka 3. Ta dogodek bo potekal dne 30. junija 2024.
                                    </CardText>
                                    <Button color="primary">Več informacij</Button>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </main>
            <SimpleFooter />
        </div>
    );
};

export default LokalneSkupnosti;
