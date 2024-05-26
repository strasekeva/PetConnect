import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, updateDoc, doc, Timestamp, getDoc } from 'firebase/firestore';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import PrijavaNaAktivnost from './PrijavaNaAktivnost';

const categories = [
    { value: 'walks', label: 'Sprehodi' },
    { value: 'training', label: 'Šolanje' },
    { value: 'games', label: 'Igre' },
    { value: 'health', label: 'Zdravje' },
    { value: 'competitions', label: 'Tekmovanja' },
    { value: 'education', label: 'Izobraževanje' },
    { value: 'adoption', label: 'Adopcija' },
    { value: 'family', label: 'Družinski dnevi' },
    { value: 'sports', label: 'Šport' },
    { value: 'photography', label: 'Fotografija' },
];

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
    const [time, setTime] = useState('');
    const [category, setCategory] = useState('');
    const [registrationRequired, setRegistrationRequired] = useState('no');
    const [availableSeats, setAvailableSeats] = useState('');
    const [free, setFree] = useState('yes');
    const [price, setPrice] = useState('');
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (activity) {
            setName(activity.name);
            setDescription(activity.description);
            setLocation(activity.location);
            setLatitude(activity.latitude);
            setLongitude(activity.longitude);
            setDate(new Date(activity.date.seconds * 1000).toISOString().substr(0, 10));
            setTime(new Date(activity.date.seconds * 1000).toISOString().substr(11, 5));
            setCategory(activity.category || '');
            setRegistrationRequired(activity.registrationRequired || 'no');
            setAvailableSeats(activity.availableSeats || '');
            setFree(activity.free || 'yes');
            setPrice(activity.price || '');
        }
    }, [activity]);

    useEffect(() => {
        const fetchUserData = async () => {
            const userUid = localStorage.getItem('userUid'); // Get user UID from localStorage
            if (userUid) {
                const userDoc = doc(getFirestore(), 'users', userUid);
                const docSnap = await getDoc(userDoc);

                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            }
        };
        fetchUserData();
    }, []);

    const firestore = getFirestore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const activityDate = new Date(`${date}T${time}`);
        const activityData = {
            name,
            description,
            location,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            date: Timestamp.fromDate(activityDate), // Pretvori datum in čas v Firestore Timestamp
            category,
            registrationRequired,
            availableSeats: registrationRequired === 'yes' ? parseInt(availableSeats, 10) : '',
            free,
            price: free === 'no' ? parseFloat(price) : '',
            user: userData ? { uid: localStorage.getItem('userUid'), email: userData.email } : null // Add user information
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
                <Label for="name">Ime aktivnosti</Label>
                <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </FormGroup>
            <FormGroup>
                <Label for="description">Opis</Label>
                <Input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </FormGroup>
            <FormGroup>
                <Label for="location">Lokacija</Label>
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
                <Label for="date">Datum</Label>
                <Input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </FormGroup>
            <FormGroup>
                <Label for="time">Čas</Label>
                <Input
                    type="time"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                />
            </FormGroup>
            <FormGroup>
                <Label for="category">Kategorija</Label>
                <Input
                    type="select"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="">Izberite kategorijo</option>
                    {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </Input>
            </FormGroup>
            <PrijavaNaAktivnost
                registrationRequired={registrationRequired}
                setRegistrationRequired={setRegistrationRequired}
                availableSeats={availableSeats}
                setAvailableSeats={setAvailableSeats}
                free={free}
                setFree={setFree}
                price={price}
                setPrice={setPrice}
            />
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
