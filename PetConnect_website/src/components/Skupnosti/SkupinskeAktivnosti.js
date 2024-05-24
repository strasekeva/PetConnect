import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, Card, CardBody, CardTitle, CardText, CardSubtitle, Input, FormGroup, Label } from 'reactstrap';
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
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [filterLocation, setFilterLocation] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [sortByDate, setSortByDate] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [activityToEdit, setActivityToEdit] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const firestore = getFirestore();

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
    }, [firestore]);

    useEffect(() => {
        const fetchActivities = async () => {
            const querySnapshot = await getDocs(collection(firestore, 'activities'));
            const activitiesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setActivities(activitiesList);
            setFilteredActivities(activitiesList);
        };

        fetchActivities();
    }, [firestore]);

    const toggleModal = () => setModalOpen(!modalOpen);

    const toggleEditModal = () => setEditModalOpen(!editModalOpen);

    const deleteActivity = async (id) => {
        try {
            await deleteDoc(doc(firestore, 'activities', id));
            setActivities(activities.filter(activity => activity.id !== id));
            setFilteredActivities(filteredActivities.filter(activity => activity.id !== id));
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
            const updatedActivities = activities.map(activity => (activity.id === updatedActivity.id ? updatedActivity : activity));
            setActivities(updatedActivities);
            setFilteredActivities(updatedActivities);
            toggleEditModal();
        } catch (error) {
            console.error("Error updating activity: ", error);
        }
    };

    const handleCardClick = (activity) => {
        setSelectedActivity(activity);
    };

    const handleFilterLocation = (e) => {
        const location = e.target.value;
        setFilterLocation(location);
        filterActivities(location, filterMonth, sortByDate);
    };

    const handleFilterMonth = (e) => {
        const month = e.target.value;
        setFilterMonth(month);
        filterActivities(filterLocation, month, sortByDate);
    };

    const handleSortByDate = (e) => {
        const sort = e.target.checked;
        setSortByDate(sort);
        filterActivities(filterLocation, filterMonth, sort);
    };

    const filterActivities = (location, month, sort) => {
        let filtered = activities;

        if (location) {
            filtered = filtered.filter(activity => activity.location.toLowerCase().includes(location.toLowerCase()));
        }

        if (month) {
            filtered = filtered.filter(activity => new Date(activity.date.seconds * 1000).getMonth() + 1 === parseInt(month));
        }

        if (sort) {
            filtered = filtered.sort((a, b) => new Date(a.date.seconds * 1000) - new Date(b.date.seconds * 1000));
        }

        setFilteredActivities(filtered);
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
                    <Container>
                        <h2 className="text-center display-2 mb-0">Skupinske aktivnosti</h2>
                        <Row>
                            <Col md="3">
                                <h3 className="text-center">Filter</h3>
                                <FormGroup>
                                    <Label for="locationFilter">Lokacija</Label>
                                    <Input type="text" id="locationFilter" value={filterLocation} onChange={handleFilterLocation} placeholder="Enter location" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="monthFilter">Mesec</Label>
                                    <Input type="select" id="monthFilter" value={filterMonth} onChange={handleFilterMonth}>
                                        <option value="">All</option>
                                        <option value="1">Januar</option>
                                        <option value="2">Februar</option>
                                        <option value="3">Marec</option>
                                        <option value="4">April</option>
                                        <option value="5">Maj</option>
                                        <option value="6">Junij</option>
                                        <option value="7">Julij</option>
                                        <option value="8">Avgust</option>
                                        <option value="9">September</option>
                                        <option value="10">Oktober</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox" checked={sortByDate} onChange={handleSortByDate} /> Sort by Date
                                    </Label>
                                </FormGroup>
                            </Col>
                            <Col md="9">
                                <div style={{ marginTop: '3%' }}>
                                    {filteredActivities.map((activity, index) => (
                                        <Card key={index} className="activity-card" style={{ marginBottom: '3%', border: '1px solid #ddd', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} onClick={() => handleCardClick(activity)}>
                                            {currentUser && activity.user && currentUser.uid === activity.user.uid && (
                                                <>
                                                    <Button color="danger" className="delete-button" onClick={(e) => { e.stopPropagation(); deleteActivity(activity.id); }}>Izbriši</Button>
                                                    <Button color="warning" className="edit-button" onClick={(e) => { e.stopPropagation(); startEditing(activity); }}>Uredi</Button>
                                                </>
                                            )}
                                            <CardBody>
                                                <CardTitle tag="h3" style={{ color: '#007bff' }}>{activity.name}</CardTitle>
                                                <CardSubtitle tag="h6" className="mb-2 text-muted">{new Date(activity.date.seconds * 1000).toLocaleDateString()}</CardSubtitle>
                                                <CardText>{activity.description}</CardText>
                                                <CardText><strong>Lokacija:</strong> {activity.location}</CardText>
                                                {activity.user && (
                                                    <CardText><strong>Posted by:</strong> {activity.user.email}</CardText>
                                                )}
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            </Col>
                        </Row>
                        {currentUser && (
                            <Row className="justify-content-center" style={{ marginTop: '20px' }}>
                                <Col className="text-center" xs="auto">
                                    <Button color="info" onClick={toggleModal}>Dodaj aktivnost</Button>
                                </Col>
                            </Row>
                        )}
                        <Row style={{ marginTop: '3%' }}>
                            <Col>
                                <div style={{ height: '500px', width: '100%' }}>
                                    <MapContainer center={[46.5547, 15.6459]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        {filteredActivities.map((activity, index) => (
                                            <Marker key={index} position={[activity.latitude, activity.longitude]} icon={defaultIcon}>
                                                <Popup>
                                                    <h3>{activity.name}</h3>
                                                    <p>{activity.description}</p>
                                                    <p>Datum: {new Date(activity.date.seconds * 1000).toLocaleDateString()}</p>
                                                    {activity.user && (
                                                        <p><strong>Posted by:</strong> {activity.user.email}</p>
                                                    )}
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
                                                    <p>Datum: {new Date(selectedActivity.date.seconds * 1000).toLocaleDateString()}</p>
                                                    {selectedActivity.user && (
                                                        <p><strong>Posted by:</strong> {selectedActivity.user.email}</p>
                                                    )}
                                                </Popup>
                                            </Marker>
                                        )}
                                    </MapContainer>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                    <Modal isOpen={modalOpen} toggle={toggleModal}>
                        <ModalHeader toggle={toggleModal}>Dodaj aktivnost</ModalHeader>
                        <ModalBody>
                            <DodajanjeAktivnosti onClose={toggleModal} />
                        </ModalBody>
                    </Modal>
                    <Modal isOpen={editModalOpen} toggle={toggleEditModal}>
                        <ModalHeader toggle={toggleEditModal}>Uredi aktivnost</ModalHeader>
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
