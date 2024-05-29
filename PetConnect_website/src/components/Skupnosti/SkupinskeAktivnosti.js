import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import Navbar from "components/Navbars/Navbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import DodajanjeAktivnosti from './DodajanjeAktivnosti';
import KoledarAktivnosti from './KoledarAktivnosti';
import PrijavaForm from './PrijavaForm';
import PregledPrijave from './PregledPrijave';
import SeznamPrijavljenih from './SeznamPrijavljenih';
import FilterComponent from './FilterComponent';
import MapComponent from './MapComponent';
import ActivityCard from './ActivityCard';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { categoryIcons, categories, isNew, isSoon } from './Constants';
import 'assets/css/styles.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';
import 'leaflet-extra-markers/dist/js/leaflet.extra-markers.min.js';
import Pagination from 'react-js-pagination';

library.add(fas);

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
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 6;
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
            const activitiesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt ? new Date(doc.data().createdAt.seconds * 1000) : new Date() // Safe fallback
            }));

            activitiesList.sort((a, b) => {
                if (!a.createdAt || !b.createdAt) return 0; // Handle missing dates gracefully
                return b.createdAt.getTime() - a.createdAt.getTime(); // Use getTime() for actual Date objects
            });

            setActivities(activitiesList);
            setFilteredActivities(activitiesList);
        };

        fetchActivities();
    }, [firestore]);

    const toggleModal = useCallback(() => setModalOpen(!modalOpen), [modalOpen]);

    const toggleEditModal = useCallback(() => setEditModalOpen(!editModalOpen), [editModalOpen]);

    const toggleRegisterModal = useCallback(() => setRegisterModalOpen(!registerModalOpen), [registerModalOpen]);

    const toggleRegistrationDetails = useCallback(() => setShowRegistrationDetails(!showRegistrationDetails), [showRegistrationDetails]);

    const toggleRegisteredUsers = useCallback(() => setShowRegisteredUsers(!showRegisteredUsers), [showRegisteredUsers]);

    const deleteActivity = useCallback(async (id) => {
        try {
            await deleteDoc(doc(firestore, 'activities', id));
            setActivities(activities.filter(activity => activity.id !== id));
            setFilteredActivities(filteredActivities.filter(activity => activity.id !== id));
        } catch (error) {
            console.error("Error deleting activity: ", error);
        }
    }, [activities, filteredActivities, firestore]);

    const startEditing = useCallback((activity) => {
        setActivityToEdit(activity);
        toggleEditModal();
    }, [toggleEditModal]);

    const updateActivity = useCallback(async (updatedActivity) => {
        try {
            await updateDoc(doc(firestore, 'activities', updatedActivity.id), updatedActivity);
            const updatedActivities = activities.map(activity => (activity.id === updatedActivity.id ? updatedActivity : activity));
            setActivities(updatedActivities);
            setFilteredActivities(updatedActivities);
            toggleEditModal();
        } catch (error) {
            console.error("Error updating activity: ", error);
        }
    }, [activities, toggleEditModal, firestore]);

    const filterActivities = useCallback((location, month, category, sort) => {
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
    }, [activities]);

    const handleFilterLocation = useCallback((e) => {
        const location = e.target.value;
        setFilterLocation(location);
        filterActivities(location, filterMonth, filterCategory, sortByDate);
    }, [filterMonth, filterCategory, sortByDate, filterActivities]);

    const handleFilterMonth = useCallback((e) => {
        const month = e.target.value;
        setFilterMonth(month);
        filterActivities(filterLocation, month, filterCategory, sortByDate);
    }, [filterLocation, filterCategory, sortByDate, filterActivities]);

    const handleFilterCategory = useCallback((e) => {
        const category = e.target.value;
        setFilterCategory(category);
        filterActivities(filterLocation, filterMonth, category, sortByDate);
    }, [filterLocation, filterMonth, sortByDate, filterActivities]);

    const handleSortByDate = useCallback((e) => {
        const sort = e.target.checked;
        setSortByDate(sort);
        filterActivities(filterLocation, filterMonth, filterCategory, sort);
    }, [filterLocation, filterMonth, filterCategory, filterActivities]);

    const handleDateSelect = useCallback((date) => {
        setSelectedDate(date);
        const filteredByDate = activities.filter(
            activity => new Date(activity.date.seconds * 1000).toDateString() === date.toDateString()
        );
        setFilteredActivities(filteredByDate);
    }, [activities]);

    const handleViewModeChange = useCallback((mode) => {
        console.log("Changing view mode from", viewMode, "to", mode);
        setViewMode(mode);
    }, [viewMode]);
    
    const handleBackgroundClick = useCallback(() => {
        setSelectedActivity(null);
    }, []);

    const handleButtonClick = useCallback((activity) => (e) => {
        e.stopPropagation();
        if (currentUser) {
            setSelectedActivity(activity);
            toggleRegisterModal();
        } else {
            navigate('/login-page');
        }
    }, [currentUser, toggleRegisterModal, navigate]);

    const handleViewRegistrationDetails = useCallback((activity) => (e) => {
        e.stopPropagation();
        setSelectedActivity(activity);
        toggleRegistrationDetails();
    }, [toggleRegistrationDetails]);

    const handleViewRegisteredUsers = useCallback((activity) => (e) => {
        e.stopPropagation();
        setSelectedActivity(activity);
        toggleRegisteredUsers();
    }, [toggleRegisteredUsers]);

    const handlePageChange = (pageNumber) => {
        console.log("Current page before change:", activePage);
        setActivePage(pageNumber);
        console.log("New active page:", pageNumber);
    };

    

    const renderList = useCallback(() => {
        const indexOfLastActivity = activePage * itemsPerPage;
        const indexOfFirstActivity = indexOfLastActivity - itemsPerPage;
        const currentActivities = filteredActivities.slice(indexOfFirstActivity, indexOfLastActivity);

        return (
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
                        {currentActivities.map((activity, index) => (
                            <ActivityCard
                                key={index}
                                activity={activity}
                                currentUser={currentUser}
                                handleButtonClick={handleButtonClick}
                                handleViewRegistrationDetails={handleViewRegistrationDetails}
                                handleViewRegisteredUsers={handleViewRegisteredUsers}
                                startEditing={startEditing}
                                deleteActivity={deleteActivity}
                                categoryIcons={categoryIcons}
                                isNew={isNew}
                                isSoon={isSoon}
                            />
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Pagination
                            activePage={activePage}
                            itemsCountPerPage={itemsPerPage}
                            totalItemsCount={filteredActivities.length}
                            pageRangeDisplayed={5}
                            onChange={handlePageChange}
                            itemClass="page-item"
                            linkClass="page-link"
                        />
                    </div>
                </Col>
            </Row>
        );
    }, [activePage, filteredActivities, currentUser, handleFilterLocation, handleFilterMonth, handleFilterCategory, handleSortByDate, handleButtonClick, handleViewRegistrationDetails, handleViewRegisteredUsers, startEditing, deleteActivity]);

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
                            <Button color="secondary" onClick={() => handleViewModeChange('calendar')}>Kolendar</Button>
                        </Row>
                        {viewMode === 'list' ? renderList() : (
                            <Row>
                                <Col>
                                    <KoledarAktivnosti
                                        activities={activities}
                                        onDateSelect={handleDateSelect}
                                        currentUser={currentUser}
                                        handleButtonClick={handleButtonClick}
                                        handleViewRegistrationDetails={handleViewRegistrationDetails}
                                        handleViewRegisteredUsers={handleViewRegisteredUsers}
                                        startEditing={startEditing}
                                        deleteActivity={deleteActivity}
                                        isNew={isNew}
                                        isSoon={isSoon}
                                    />
                                </Col>
                            </Row>
                        )}
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
                            <DodajanjeAktivnosti onClose={toggleModal} onSave={activity => {
                                const newActivities = [activity, ...activities];
                                setActivities(newActivities);
                                setFilteredActivities(newActivities);
                            }} />
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
