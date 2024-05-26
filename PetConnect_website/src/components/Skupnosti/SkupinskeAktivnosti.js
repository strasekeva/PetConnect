import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, Card, CardBody, CardTitle, CardSubtitle, CardText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faPaw, faDumbbell, faDice, faHeartbeat, faTrophy, faBook, faHome, faUsers, faFutbol, faCamera } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';
import 'leaflet-extra-markers/dist/js/leaflet.extra-markers.min.js';
import Navbar from "components/Navbars/Navbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import DodajanjeAktivnosti from './DodajanjeAktivnosti';
import KoledarAktivnosti from './KoledarAktivnosti';
import PrijavaForm from './PrijavaForm';
import PregledPrijave from './PregledPrijave';
import SeznamPrijavljenih from './SeznamPrijavljenih';
import FilterComponent from './FilterComponent';
import MapComponent from './MapComponent';
import 'assets/css/styles.css';

// Add FontAwesome icons to library
library.add(fas);

const categoryIcons = {
    walks: { icon: faPaw, color: 'blue' },
    training: { icon: faDumbbell, color: 'orange' },
    games: { icon: faDice, color: 'purple' },
    health: { icon: faHeartbeat, color: 'red' },
    competitions: { icon: faTrophy, color: 'yellow' },
    education: { icon: faBook, color: 'green' },
    adoption: { icon: faHome, color: 'cyan' },
    family: { icon: faUsers, color: 'pink' },
    sports: { icon: faFutbol, color: 'black' },
    photography: { icon: faCamera, color: 'gray' },
};

const categories = [
    { value: 'walks', label: 'Sprehodi', icon: faPaw },
    { value: 'training', label: 'Šolanje', icon: faDumbbell },
    { value: 'games', label: 'Igre', icon: faDice },
    { value: 'health', label: 'Zdravje', icon: faHeartbeat },
    { value: 'competitions', label: 'Tekmovanja', icon: faTrophy },
    { value: 'education', label: 'Izobraževanje', icon: faBook },
    { value: 'adoption', label: 'Adopcija', icon: faHome },
    { value: 'family', label: 'Družinski dnevi', icon: faUsers },
    { value: 'sports', label: 'Šport', icon: faFutbol },
    { value: 'photography', label: 'Fotografija', icon: faCamera },
];

const isNew = (date) => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return date.seconds * 1000 >= oneDayAgo.getTime();
};

const isSoon = (date) => {
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    return date.seconds * 1000 <= oneWeekFromNow.getTime();
};

const SkupinskeAktivnosti = () => {
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [filterLocation, setFilterLocation] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [sortByDate, setSortByDate] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [activityToEdit, setActivityToEdit] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [showRegistrations, setShowRegistrations] = useState(false);
    const [showRegistrationDetails, setShowRegistrationDetails] = useState(false);
    const [showRegisteredUsers, setShowRegisteredUsers] = useState(false);
    const firestore = getFirestore();
    const navigate = useNavigate();

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

    const toggleRegisterModal = () => setRegisterModalOpen(!registerModalOpen);

    const toggleRegistrationDetails = () => setShowRegistrationDetails(!showRegistrationDetails);

    const toggleRegisteredUsers = () => setShowRegisteredUsers(!showRegisteredUsers);

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
        filterActivities(location, filterMonth, filterCategory, sortByDate);
    };

    const handleFilterMonth = (e) => {
        const month = e.target.value;
        setFilterMonth(month);
        filterActivities(filterLocation, month, filterCategory, sortByDate);
    };

    const handleFilterCategory = (e) => {
        const category = e.target.value;
        setFilterCategory(category);
        filterActivities(filterLocation, filterMonth, category, sortByDate);
    };

    const handleSortByDate = (e) => {
        const sort = e.target.checked;
        setSortByDate(sort);
        filterActivities(filterLocation, filterMonth, filterCategory, sort);
    };

    const filterActivities = (location, month, category, sort) => {
        let filtered = activities;

        if (location) {
            filtered = filtered.filter(activity => activity.location.toLowerCase().includes(location.toLowerCase()));
        }

        if (month) {
            filtered = filtered.filter(activity => new Date(activity.date.seconds * 1000).getMonth() + 1 === parseInt(month));
        }

        if (category) {
            filtered = filtered.filter(activity => activity.category === category);
        }

        if (sort) {
            filtered = filtered.sort((a, b) => new Date(a.date.seconds * 1000) - new Date(b.date.seconds * 1000));
        }

        setFilteredActivities(filtered);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        const filteredByDate = activities.filter(
            activity => new Date(activity.date.seconds * 1000).toDateString() === date.toDateString()
        );
        setFilteredActivities(filteredByDate);
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        if (mode === 'list') {
            setFilteredActivities(activities);
        }
    };

    const handleBackgroundClick = () => {
        setSelectedActivity(null);
    };

    const handleButtonClick = (activity) => (e) => {
        e.stopPropagation();
        if (currentUser) {
            setSelectedActivity(activity);
            toggleRegisterModal();
        } else {
            navigate('/login');
        }
    };

    const handleViewRegistrationDetails = (activity) => (e) => {
        e.stopPropagation();
        setSelectedActivity(activity);
        toggleRegistrationDetails();
    };

    const handleViewRegisteredUsers = (activity) => (e) => {
        e.stopPropagation();
        setSelectedActivity(activity);
        toggleRegisteredUsers();
    };

    const renderList = () => (
        <Row>
            <Col md="3">
                <FilterComponent
                    filterLocation={filterLocation}
                    filterMonth={filterMonth}
                    filterCategory={filterCategory}
                    sortByDate={sortByDate}
                    handleFilterLocation={handleFilterLocation}
                    handleFilterMonth={handleFilterMonth}
                    handleFilterCategory={handleFilterCategory}
                    handleSortByDate={handleSortByDate}
                    categories={categories}
                />
            </Col>
            <Col md="9">
                <div style={{ marginTop: '3%' }}>
                    {filteredActivities.map((activity, index) => {
                        const totalRegistered = activity.registrations ? activity.registrations.reduce((total, reg) => total + (reg.steviloLjudji || 0), 0) : 0;
                        const availableSpots = activity.availableSeats ? Math.max(activity.availableSeats - totalRegistered, 0) : 0;
                        return (
                            <Card key={index} className="activity-card" style={{ marginBottom: '3%', border: '1px solid #ddd', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} onClick={() => handleCardClick(activity)}>
                                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', color: categoryIcons[activity.category]?.color || 'black' }}>
                                    <FontAwesomeIcon icon={categoryIcons[activity.category]?.icon} />
                                </div>
                                <CardBody>
                                    {isNew(activity.date) && <span className="badge badge-success">Novo</span>}
                                    {isSoon(activity.date) && <span className="badge badge-warning">Kmalu</span>}
                                    {activity.free === 'yes' && (
                                        <span className="badge badge-primary">Brezplačno</span>
                                    )}
                                    {availableSpots === 0 && activity.registrationRequired === 'yes' && (
                                        <span className="badge badge-danger">Razprodano</span>
                                    )}
                                    <CardTitle tag="h3" style={{ color: '#007bff' }}>{activity.name}</CardTitle>
                                    <CardSubtitle tag="h6" className="mb-2 text-muted">{new Date(activity.date.seconds * 1000).toLocaleDateString()} {new Date(activity.date.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</CardSubtitle>
                                    <CardText>{activity.description}</CardText>
                                    <CardText><strong>Lokacija:</strong> {activity.location}</CardText>
                                    {activity.user && (
                                        <CardText><strong>Posted by:</strong> {activity.user.email}</CardText>
                                    )}
                                    <div>
                                        {activity.registrationRequired === 'yes' && (!currentUser || currentUser.uid !== activity.user.uid) && (
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
                    })}
                </div>
            </Col>
        </Row>
    );

    const renderCalendar = () => (
        <Row>
            <Col>
                <KoledarAktivnosti activities={filteredActivities} onDateSelect={handleDateSelect} />
            </Col>
        </Row>
    );

    return (
        <div onClick={handleBackgroundClick}>
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
                        <Row className="justify-content-center" style={{ marginBottom: '20px' }}>
                            <Button color="primary" onClick={() => handleViewModeChange('list')}>Seznam</Button>
                            <Button color="secondary" onClick={() => handleViewModeChange('calendar')}>Koledar</Button>
                        </Row>
                        {viewMode === 'list' ? renderList() : renderCalendar()}
                        {currentUser && (
                            <Row className="justify-content-center" style={{ marginTop: '20px' }}>
                                <Col className="text-center" xs="auto">
                                    <Button color="info" onClick={toggleModal}>Dodaj aktivnost</Button>
                                </Col>
                            </Row>
                        )}
                        <Row style={{ marginTop: '3%' }}>
                            <Col>
                                <MapComponent
                                    filteredActivities={filteredActivities}
                                    selectedActivity={selectedActivity}
                                    setSelectedActivity={setSelectedActivity}
                                    categoryIcons={categoryIcons}
                                />
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
                    <Modal isOpen={registerModalOpen} toggle={toggleRegisterModal}>
                        <ModalHeader toggle={toggleRegisterModal}>Prijava na aktivnost</ModalHeader>
                        <ModalBody>
                            {selectedActivity && <PrijavaForm activity={selectedActivity} onClose={toggleRegisterModal} />}
                        </ModalBody>
                    </Modal>
                    {selectedActivity && (
                        <PregledPrijave
                            activity={selectedActivity}
                            currentUser={currentUser}
                            isOpen={showRegistrationDetails}
                            toggle={toggleRegistrationDetails}
                        />
                    )}
                    {selectedActivity && (
                        <SeznamPrijavljenih
                            activity={selectedActivity}
                            isOpen={showRegisteredUsers}
                            toggle={toggleRegisteredUsers}
                        />
                    )}
                </section>
            </main>
            <SimpleFooter />
        </div>
    );
};

export default SkupinskeAktivnosti;
