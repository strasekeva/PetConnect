import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

const LocationSelector = ({ setLatitude, setLongitude }) => {
    useMapEvents({
        click(e) {
            setLatitude(e.latlng.lat);
            setLongitude(e.latlng.lng);
        }
    });

    return null;
};

const DodajanjeAktivnosti = ({ onClose, activity, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [latitude, setLatitude] = useState(46.5547); // Privzeto na Maribor
    const [longitude, setLongitude] = useState(15.6459); // Privzeto na Maribor
    const [date, setDate] = useState('');

    useEffect(() => {
        if (activity) {
            setName(activity.name);
            setDescription(activity.description);
            setLocation(activity.location);
            setLatitude(activity.latitude);
            setLongitude(activity.longitude);
            setDate(new Date(activity.date.seconds * 1000).toISOString().substr(0, 10));
        }
    }, [activity]);

    const firestore = getFirestore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const activityData = {
            name,
            description,
            location,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            date: Timestamp.fromDate(new Date(date)), // Pretvori datum v Firestore Timestamp
        };
        try {
            if (activity) {
                activityData.id = activity.id;
                await updateDoc(doc(firestore, 'activities', activity.id), activityData);
                onSave(activityData);
            } else {
                await addDoc(collection(firestore, 'activities'), activityData);
                onClose();
            }
        } catch (error) {
            console.error("Error saving activity: ", error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label for="name">Name</Label>
                <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </FormGroup>
            <FormGroup>
                <Label for="description">Description</Label>
                <Input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </FormGroup>
            <FormGroup>
                <Label for="location">Location</Label>
                <Input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
            </FormGroup>
            <FormGroup>
                <Label for="latitude">Latitude</Label>
                <Input
                    type="text"
                    id="latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    required
                    readOnly
                />
            </FormGroup>
            <FormGroup>
                <Label for="longitude">Longitude</Label>
                <Input
                    type="text"
                    id="longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    required
                    readOnly
                />
            </FormGroup>
            <FormGroup>
                <Label for="date">Date</Label>
                <Input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </FormGroup>
            <div style={{ height: '300px', marginBottom: '20px' }}>
                <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[latitude, longitude]} />
                    <LocationSelector setLatitude={setLatitude} setLongitude={setLongitude} />
                </MapContainer>
            </div>
            <Button type="submit" color="primary">{activity ? 'Update Activity' : 'Add Activity'}</Button>
            <Button type="button" color="secondary" onClick={onClose} style={{ marginLeft: '10px' }}>Cancel</Button>
        </Form>
    );
};

export default DodajanjeAktivnosti;
