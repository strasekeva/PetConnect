import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, Card, CardBody, CardTitle, CardText, CardSubtitle } from 'reactstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';
import 'leaflet-extra-markers/dist/js/leaflet.extra-markers.min.js';
import Navbar from "components/Navbars/Navbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import DodajanjeAktivnosti from './DodajanjeAktivnosti';
import 'assets/css/styles.css';

// Ustvarjanje rdeče ikone za izbran marker
const redIcon = L.ExtraMarkers.icon({
    icon: 'fa-number',
    number: '',
    markerColor: 'red',
    shape: 'circle',
    prefix: 'fa'
});

const defaultIcon = L.ExtraMarkers.icon({
    icon: 'fa-number',
    number: '',
    markerColor: 'blue',
    shape: 'circle',
    prefix: 'fa'
});

const SkupinskeAktivnosti = () => {
    const [activities, setActivities] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [activityToEdit, setActivityToEdit] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const firestore = getFirestore();

    useEffect(() => {
        const fetchActivities = async () => {
            const querySnapshot = await getDocs(collection(firestore, 'activities'));
            const activitiesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setActivities(activitiesList);
        };

        fetchActivities();
    }, [firestore]);

    const toggleModal = () => setModalOpen(!modalOpen);

    const toggleEditModal = () => setEditModalOpen(!editModalOpen);

    const deleteActivity = async (id) => {
        try {
            await deleteDoc(doc(firestore, 'activities', id));
            setActivities(activities.filter(activity => activity.id !== id));
        } catch (error) {
            console.error("Error deleting activity: ", error);
        }
    };

    const startEditing = (activity) => {
        setActivityToEdit(activity);
        toggleEditModal();
    };

    const updateActivity = async (updatedActivity) => {
        try {
            await updateDoc(doc(firestore, 'activities', updatedActivity.id), updatedActivity);
            setActivities(activities.map(activity => (activity.id === updatedActivity.id ? updatedActivity : activity)));
            toggleEditModal();
        } catch (error) {
            console.error("Error updating activity: ", error);
        }
    };

    const handleCardClick = (activity) => {
        setSelectedActivity(activity);
    };

    return (
        <>
            <Navbar />
            <main>
                <section className="section section-shaped section-lg">
                    <div className="shape shape-style-1 shape-default alpha-4">
                        <span />
                    </div>
                </section>
                <section style={{ marginBottom: "3%" }}>
                    <Container style={{ marginTop: '3%' }}>
                        <Row>
                            <Col>
                                <h2 className="text-center display-2 mb-0">Group Activities</h2>
                                <div style={{ marginTop: '3%' }}>
                                    {activities.map((activity, index) => (
                                        <Card key={index} className="activity-card" style={{ marginBottom: '3%', border: '1px solid #ddd', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} onClick={() => handleCardClick(activity)}>
                                            <Button color="danger" className="delete-button" onClick={() => deleteActivity(activity.id)}>Delete</Button>
                                            <Button color="warning" className="edit-button" onClick={() => startEditing(activity)}>Edit</Button>
                                            <CardBody>
                                                <CardTitle tag="h3" style={{ color: '#007bff' }}>{activity.name}</CardTitle>
                                                <CardSubtitle tag="h6" className="mb-2 text-muted">{new Date(activity.date.seconds * 1000).toLocaleDateString()}</CardSubtitle>
                                                <CardText>{activity.description}</CardText>
                                                <CardText><strong>Location:</strong> {activity.location}</CardText>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            </Col>
                        </Row>
                        <Row className="justify-content-center" style={{ marginTop: '20px' }}>
                            <Col className="text-center" xs="auto">
                                <Button color="info" onClick={toggleModal}>Add Activity</Button>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '3%' }}>
                            <Col>
                                <div style={{ height: '500px', width: '100%' }}>
                                    <MapContainer center={[46.5547, 15.6459]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        {activities.map((activity, index) => (
                                            <Marker key={index} position={[activity.latitude, activity.longitude]} icon={defaultIcon}>
                                                <Popup>
                                                    <h3>{activity.name}</h3>
                                                    <p>{activity.description}</p>
                                                    <p>Date: {new Date(activity.date.seconds * 1000).toLocaleDateString()}</p>
                                                </Popup>
                                            </Marker>
                                        ))}
                                        {selectedActivity && (
                                            <Marker
                                                position={[selectedActivity.latitude, selectedActivity.longitude]}
                                                icon={redIcon}
                                            >
                                                <Popup>
                                                    <h3>{selectedActivity.name}</h3>
                                                    <p>{selectedActivity.description}</p>
                                                    <p>Date: {new Date(selectedActivity.date.seconds * 1000).toLocaleDateString()}</p>
                                                </Popup>
                                            </Marker>
                                        )}
                                    </MapContainer>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                    <Modal isOpen={modalOpen} toggle={toggleModal}>
                        <ModalHeader toggle={toggleModal}>Add Activity</ModalHeader>
                        <ModalBody>
                            <DodajanjeAktivnosti onClose={toggleModal} />
                        </ModalBody>
                    </Modal>
                    <Modal isOpen={editModalOpen} toggle={toggleEditModal}>
                        <ModalHeader toggle={toggleEditModal}>Edit Activity</ModalHeader>
                        <ModalBody>
                            {activityToEdit && <DodajanjeAktivnosti activity={activityToEdit} onClose={toggleEditModal} onSave={updateActivity} />}
                        </ModalBody>
                    </Modal>
                </section>
            </main>
            <SimpleFooter />
        </>
    );
};

export default SkupinskeAktivnosti;
