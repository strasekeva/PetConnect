import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Card, CardBody, CardTitle, CardSubtitle, CardText, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { categoryIcons, categories } from './Constants';

const KoledarAktivnosti = ({ activities, onDateSelect }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const isSoon = (date) => {
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
        return date.seconds * 1000 <= oneWeekFromNow.getTime();
    };

    const isNew = (date) => {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        return date.seconds * 1000 >= oneDayAgo.getTime();
    };

    const handleDateClick = (value) => {
        setSelectedDate(value);
        onDateSelect(value);
    };

    return (
        <div>
            <Row>
                <Col md="6">
                    <Calendar
                        tileContent={({ date, view }) => {
                            const dayActivities = activities.filter(
                                activity => new Date(activity.date.seconds * 1000).toDateString() === date.toDateString()
                            );
                            return (
                                <div>
                                    {dayActivities.map(activity => (
                                        <span key={activity.id} style={{ backgroundColor: categoryIcons[activity.category]?.color || 'black', display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', margin: '2px' }} />
                                    ))}
                                </div>
                            );
                        }}
                        onClickDay={handleDateClick}
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col md="6">
                    <div className="legend">
                        <h5>Legenda</h5>
                        {categories.map(cat => (
                            <div key={cat.value} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                <span style={{ backgroundColor: categoryIcons[cat.value].color, display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', marginRight: '5px' }}></span>
                                {cat.label}
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
            {selectedDate && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Aktivnosti na {selectedDate.toLocaleDateString()}:</h4>
                    {activities.filter(
                        activity => new Date(activity.date.seconds * 1000).toDateString() === selectedDate.toDateString()
                    ).map((activity, index) => (
                        <Card key={index} className="activity-card" style={{ marginBottom: '3%', border: '1px solid #ddd', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', color: categoryIcons[activity.category]?.color || 'black' }}>
                                <FontAwesomeIcon icon={categoryIcons[activity.category]?.icon} />
                            </div>
                            <CardBody>
                                {isNew(activity.date) && <span className="badge badge-success">Novo</span>}
                                {isSoon(activity.date) && <span className="badge badge-warning">Kmalu</span>}
                                <CardTitle tag="h3" style={{ color: '#007bff' }}>{activity.name}</CardTitle>
                                <CardSubtitle tag="h6" className="mb-2 text-muted">{new Date(activity.date.seconds * 1000).toLocaleDateString()} {new Date(activity.date.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</CardSubtitle>
                                <CardText>{activity.description}</CardText>
                                <CardText><strong>Lokacija:</strong> {activity.location}</CardText>
                                {activity.user && (
                                    <CardText><strong>Posted by:</strong> {activity.user.email}</CardText>
                                )}
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KoledarAktivnosti;
