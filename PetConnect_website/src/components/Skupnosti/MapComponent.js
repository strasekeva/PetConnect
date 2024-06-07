import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapCategoryIcons } from './Constants'; 

const getCategoryMarkerIcon = (category, isSelected, categoryIcons) => {
    const categoryIcon = categoryIcons[category];
    if (!categoryIcon || !categoryIcon.icon) {
        console.error(`Icon for category ${category} is not defined`);
        return L.divIcon({
            html: '<i class="fa fa-question-circle" style="color: white; background: gray; border-radius: 50%; padding: 5px;"></i>',
            className: 'custom-icon',
            iconSize: [30, 30]
        });
    }
    const { icon } = categoryIcon;
    return L.divIcon({
        html: icon.options.html,
        className: isSelected ? `${icon.options.className} selected-icon` : icon.options.className,
        iconSize: icon.options.iconSize,
    });
};

const MapComponent = ({ filteredActivities, selectedActivity, setSelectedActivity }) => {
    return (
        <div style={{ height: '500px', width: '100%' }}>
            <MapContainer center={[46.5547, 15.6459]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredActivities.map((activity, index) => (
                    <Marker
                        key={index}
                        position={[activity.latitude, activity.longitude]}
                        icon={getCategoryMarkerIcon(activity.category, selectedActivity && selectedActivity.id === activity.id, MapCategoryIcons)}
                        eventHandlers={{
                            click: () => {
                                setSelectedActivity(activity);
                            },
                        }}
                    >
                        <Popup>
                            <h3>{activity.name}</h3>
                            <p>{activity.description}</p>
                            <p>Datum: {new Date(activity.date.seconds * 1000).toLocaleDateString()} {new Date(activity.date.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            {activity.user && (
                                <p><strong>Objavil:</strong> {activity.user.email}</p>
                            )}
                        </Popup>
                    </Marker>
                ))}
                {selectedActivity && (
                    <Marker
                        position={[selectedActivity.latitude, selectedActivity.longitude]}
                        icon={getCategoryMarkerIcon(selectedActivity.category, true, MapCategoryIcons)}
                    >
                        <Popup>
                            <h3>{selectedActivity.name}</h3>
                            <p>{selectedActivity.description}</p>
                            <p>Datum: {new Date(selectedActivity.date.seconds * 1000).toLocaleDateString()} {new Date(selectedActivity.date.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            {selectedActivity.user && (
                                <p><strong>Objavil:</strong> {selectedActivity.user.email}</p>
                            )}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
