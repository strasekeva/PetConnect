// KoledarAktivnosti.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Row, Col } from 'reactstrap';
import ActivityCard from './ActivityCard';
import { categoryIcons, categories } from './Constants';

const KoledarAktivnosti = ({ activities, onDateSelect, currentUser, handleButtonClick, handleViewRegistrationDetails, handleViewRegisteredUsers, startEditing, deleteActivity }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredActivities, setFilteredActivities] = useState([]);

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

    const handleDateClick = (date) => {
        setSelectedDate(date);
        const filteredByDate = activities.filter(
            activity => new Date(activity.date.seconds * 1000).toDateString() === date.toDateString()
        );
        setFilteredActivities(filteredByDate);
    };

    return (
        <div>
            <Row>
                <Col md="6">
                    <Calendar
                        tileContent={({ date, view }) => {
                            if (view === 'month') {
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
                            }
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
            )}
        </div>
    );
};

export default KoledarAktivnosti;
