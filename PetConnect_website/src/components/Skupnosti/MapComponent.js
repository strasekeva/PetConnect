import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const getCategoryMarkerIcon = (category, isSelected, categoryIcons) => {
    const { icon, color } = categoryIcons[category] || { icon: 'faPaw', color: 'blue' };
    return L.ExtraMarkers.icon({
        icon: 'fa',
        markerColor: isSelected ? 'turquoise' : color,
        shape: 'circle',
        prefix: 'fas', // Ensure correct prefix for solid icons
        iconColor: 'white',
        svg: true,
        icon: icon.iconName,
    });
};

const MapComponent = ({ filteredActivities, selectedActivity, setSelectedActivity, categoryIcons }) => {
    return (
        <div style={{ height: '500px', width: '100%' }}>
            <MapContainer center={[46.5547, 15.6459]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredActivities.map((activity, index) => (
                    <Marker key={index} position={[activity.latitude, activity.longitude]} icon={getCategoryMarkerIcon(activity.category, selectedActivity && selectedActivity.id === activity.id, categoryIcons)}>
                        <Popup>
                            <h3>{activity.name}</h3>
                            <p>{activity.description}</p>
                            <p>Datum: {new Date(activity.date.seconds * 1000).toLocaleDateString()} {new Date(activity.date.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            {activity.user && (
                                <p><strong>Posted by:</strong> {activity.user.email}</p>
                            )}
                        </Popup>
                    </Marker>
                ))}
                {selectedActivity && (
                    <Marker
                        position={[selectedActivity.latitude, selectedActivity.longitude]}
                        icon={getCategoryMarkerIcon(selectedActivity.category, true, categoryIcons)}
                    >
                        <Popup>
                            <h3>{selectedActivity.name}</h3>
                            <p>{selectedActivity.description}</p>
                            <p>Datum: {new Date(selectedActivity.date.seconds * 1000).toLocaleDateString()} {new Date(selectedActivity.date.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            {selectedActivity.user && (
                                <p><strong>Posted by:</strong> {selectedActivity.user.email}</p>
                            )}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
