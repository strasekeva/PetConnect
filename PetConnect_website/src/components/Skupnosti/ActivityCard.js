import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, CardText, Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc } from 'firebase/firestore';
import { firestore } from 'components/Firebase/Firebase.js';

const ActivityCard = ({
    activity,
    currentUser,
    handleButtonClick,
    handleViewRegistrationDetails,
    handleViewRegisteredUsers,
    startEditing,
    deleteActivity,
    categoryIcons,
    isNew,
    isSoon
}) => {
    const [totalRegistered, setTotalRegistered] = useState(0);

    useEffect(() => {
        const fetchRegistrations = async () => {
            if (activity.id) {
                const registrationsRef = collection(firestore, `activities/${activity.id}/registrations`);
                const registrationsSnapshot = await getDocs(registrationsRef);
                const registrationsData = registrationsSnapshot.docs.map(doc => doc.data());
                const total = registrationsData.reduce((total, reg) => total + parseInt(reg.steviloLjudji || 0), 0);
                setTotalRegistered(total);
            }
        };

        fetchRegistrations();
    }, [activity.id]);

    const isFullyBooked = totalRegistered === activity.availableSeats && activity.registrationRequired === 'yes';

    return (
        <Card className="activity-card" style={{ marginBottom: '3%', border: '1px solid #ddd', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: isFullyBooked ? '#f0f0f0' : '#fff' }}>
            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', color: categoryIcons[activity.category]?.color || 'black' }}>
                <FontAwesomeIcon icon={categoryIcons[activity.category]?.icon} />
            </div>
            <CardBody>
                {isNew(activity.createdAt) && <span className="badge badge-success">Novo</span>}
                {isSoon(activity.date) && <span className="badge badge-warning">Kmalu</span>}
                {isFullyBooked && (
                    <span className="badge badge-danger">Razprodano</span>
                )}
                <CardTitle tag="h3" style={{ color: '#007bff' }}>{activity.name}</CardTitle>
                <CardSubtitle tag="h6" className="mb-2 text-muted">{new Date(activity.date.seconds * 1000).toLocaleDateString()} {new Date(activity.date.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</CardSubtitle>
                <CardText>{activity.description}</CardText>
                <CardText><strong>Lokacija:</strong> {activity.location}</CardText>
                <CardText><strong>Naslov:</strong> {activity.naslov}</CardText>
                {activity.user && (
                    <CardText><strong>Objavil:</strong> <Link to={`/profile-page/${activity.user.uid}`}>{activity.user.email}</Link></CardText>
                )}
                <div>
                    {!isFullyBooked && activity.registrationRequired === 'yes' && (!currentUser || currentUser.uid !== activity.user.uid) && (
                        <Button color="primary" onClick={handleButtonClick(activity)}>
                            Prijava na aktivnost
                        </Button>
                    )}
                    {activity.registrationRequired === 'yes' && currentUser && currentUser.uid !== activity.user.uid && (
                        <Button color="info" onClick={handleViewRegistrationDetails(activity)}>
                            Preglej svojo prijavo
                        </Button>
                    )}
                </div>
                <Row>
                    <Col md="3"></Col>
                    <Col md="3">
                        {currentUser && activity.user && currentUser.uid === activity.user.uid && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <Button color="warning" className="edit-button" onClick={(e) => { e.stopPropagation(); startEditing(activity); }} style={{ marginRight: '10px' }}>UREDI</Button>
                                <Button color="danger" className="delete-button" onClick={(e) => { e.stopPropagation(); deleteActivity(activity.id); }}>IZBRIŠI</Button>
                            </div>
                        )}
                    </Col>
                    <Col md="4">
                        {activity.registrationRequired === 'yes' && currentUser && activity.user && currentUser.uid === activity.user.uid && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <Button color="info" onClick={handleViewRegisteredUsers(activity)}>Pregled prijav</Button>
                            </div>
                        )}
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

export default ActivityCard;
