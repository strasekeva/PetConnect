import React, { useState } from 'react';
import { firestore } from "components/Firebase/Firebase.js"; // Uvozi Firebase konfiguracijo
import { collection, addDoc } from 'firebase/firestore'; // Uvozimo potrebne funkcije iz Firestore
import { FormGroup, Label, Input, Button, Form } from 'reactstrap';

const PrijavaForm = ({ activity, onClose  }) => {
    const [formData, setFormData] = useState({
        ime: '',
        priimek: '',
        email: '',
        steviloLjudji: 1,
        tekmovanje: {
            imePsa: '',
            pasma: '',
            starost: '',
            podrocja: []
        },
        placilo: 'karta', // 'karta' ali 'naMestu'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleTekmovanjeChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            tekmovanje: {
                ...formData.tekmovanje,
                [name]: value,
            },
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(firestore, 'activities', activity.id, 'registrations'), formData);
            alert('Prijava uspešna!');
            onClose(); 
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Prišlo je do napake pri prijavi.');
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label for="ime">Ime</Label>
                <Input type="text" name="ime" id="ime" value={formData.ime} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
                <Label for="priimek">Priimek</Label>
                <Input type="text" name="priimek" id="priimek" value={formData.priimek} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
                <Label for="email">Email</Label>
                <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
                <Label for="steviloLjudji">Število ljudi</Label>
                <Input type="number" name="steviloLjudji" id="steviloLjudji" value={formData.steviloLjudji} onChange={handleChange} min="1" required />
            </FormGroup>

            {activity.category === 'competitions' && (
                <>
                    <FormGroup>
                        <Label for="imePsa">Ime psa</Label>
                        <Input type="text" name="imePsa" id="imePsa" value={formData.tekmovanje.imePsa} onChange={handleTekmovanjeChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="pasma">Pasma</Label>
                        <Input type="text" name="pasma" id="pasma" value={formData.tekmovanje.pasma} onChange={handleTekmovanjeChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="starost">Starost</Label>
                        <Input type="number" name="starost" id="starost" value={formData.tekmovanje.starost} onChange={handleTekmovanjeChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="podrocja">Področja</Label>
                        <Input type="select" name="podrocja" id="podrocja" value={formData.tekmovanje.podrocja} onChange={handleTekmovanjeChange} multiple>
                            <option value="Agility">Agility</option>
                            <option value="Rally obedience">Rally obedience</option>
                            <option value="Dog Frisbee">Dog Frisbee</option>
                            <option value="Minidistance">Minidistance (Toss & Fetch)</option>
                            <option value="Time trial">Time trial</option>
                            <option value="Dogdartbee">Dogdartbee</option>
                            <option value="Klasika">Klasika oz. IPO</option>
                        </Input>
                    </FormGroup>
                    <p>Opis tekmovanja...</p>
                </>
            )}

            {activity.isPaid && (
                <FormGroup>
                    <Label for="placilo">Plačilo</Label>
                    <Input type="select" name="placilo" id="placilo" value={formData.placilo} onChange={handleChange}>
                        <option value="karta">S kartico</option>
                        <option value="naMestu">Na mestu</option>
                    </Input>
                </FormGroup>
            )}

            <Button type="submit" color="primary">Prijava</Button>
        </Form>
    );
};

export default PrijavaForm;