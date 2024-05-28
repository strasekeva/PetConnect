import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import Navbar from 'components/Navbars/Navbar.js';
import SimpleFooter from 'components/Footers/SimpleFooter.js';
import CardsFooter from 'components/Footers/CardsFooter.js';
import { InlineWidget } from 'react-calendly';

const Koledar = () => {
    const [expandedCategory, setExpandedCategory] = useState(null);

    const toggleCategory = (category) => {
        setExpandedCategory(expandedCategory === category ? null : category);
    };

    const categories = [
        { name: 'Sprehodi', url: 'https://calendly.com/zupanclara03' },
        { name: 'Frizerstvo', url: 'https://calendly.com/lara-fjri' },
        { name: 'Hoteli', url: 'https://calendly.com/lara-fjri' },
        { name: 'Svetovanje', url: 'https://calendly.com/lara-fjri' }
    ];

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
                                Rezervacije                                </h1>
                                <p className="lead text-white">
                                Ali potrebujete rezervacijo za sprehajalca psov, frizerja ali kaj drugega? To lahko enostavno storite preko naše spletne strani.                           </p>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>
            <main>
                <Container>
                <br/>

                    <Row>
                        {categories.map((category, index) => (
                            <Col md="12" key={index}>
                                <Card className="mb-4" style={styles.categoryBox} onClick={() => toggleCategory(category.name)}>
                                    <CardBody>
                                        <h3 style={styles.categoryHeader}>
                                            {category.name}
                                            <span style={styles.triangle}>&#9662;</span>
                                        </h3>
                                        {expandedCategory === category.name && (
                                            <div style={styles.widgetContainer}>
                                                <InlineWidget url={category.url} styles={{ height: '700px' }} />
                                            </div>
                                        )}
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </main>
            <SimpleFooter />
        </div>
    );
};

const styles = {
    categoryBox: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    categoryHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 0,
        fontSize: '1.5rem'
    },
    triangle: {
        marginLeft: '10px',
        fontSize: '1.5rem',
        color: '#007bff'
    },
    widgetContainer: {
        marginTop: '10px'
    }
};

export default Koledar;
