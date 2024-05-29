import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { FormGroup, Label, Input, Button, Form } from 'reactstrap';

// Opisi aktivnosti
const activityDescriptions = {
  'Agility': 'To je disciplina, kjer vodnik usmerja psa preko zaporedno postavljenih ovir z uporabo vidnih in slišnih ukazov, da bi ta kar najhitreje in najbolj natančno premagal ovire. Te ovire so: višinski skoki, daljinski skok, guma, stena, ohlapni in togi tunel, slalom, palisada, most, gugalnica in miza. Postavitvi teh ovir v določenem zaporedju pravimo parkur.',
  'Rally obedience': 'Sodnik za tekmovanje izbere 15-19 vaj (izmed 72. - odvisno od težavnosti), ki jih morata pes in vodnik opraviti v treh minutah. Pri tem lahko vodnik uporablja besedna in znakovna povelja ali telesno govorico, prepovedana pa je uporaba hrane, igrač ali dotikov. V začetnem razredu je dovoljena uporaba povodca, ni pa obvezna.',
  'Dog Frisbee': 'Nastopa en ali dva vodnika s psom, z vnaprej sestavljeno koreografijo na glasbo po svoji želji. Uporabita lahko 5 do 10 frizbijev, v koreografijo pa lahko vključita tudi poljubne trike. Na voljo imata minuto in pol do dve minuti. Pes mora biti za tekmovanje star najmanj 18 mesecev, vodnik pa vsaj 8 let.',
  'Klasika': 'Sestavljena je iz treh disciplin (sled, poslušnost in obramba) in treh težavnostnih stopenj.'
};

const PrijavaForm = ({ activity, onClose }) => {
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
        }
    });
    const [selectedActivity, setSelectedActivity] = useState(null);

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

    const handleActivityClick = (activityName) => {
        setSelectedActivity(activityName);
        setFormData((prevFormData) => {
            const podrocja = prevFormData.tekmovanje.podrocja.includes(activityName)
                ? prevFormData.tekmovanje.podrocja.filter(item => item !== activityName)
                : [...prevFormData.tekmovanje.podrocja, activityName];

            return {
                ...prevFormData,
                tekmovanje: {
                    ...prevFormData.tekmovanje,
                    podrocja
                }
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(getFirestore(), 'activities', activity.id, 'registrations'), {
                ...formData,
            });
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
                        <div>
                            {Object.keys(activityDescriptions).map((activityName) => (
                                <Button
                                    key={activityName}
                                    color={formData.tekmovanje.podrocja.includes(activityName) ? "success" : "secondary"}
                                    onClick={() => handleActivityClick(activityName)}
                                    style={{ margin: '5px' }}
                                >
                                    {activityName}
                                </Button>
                            ))}
                        </div>
                        {selectedActivity && (
                            <p>{activityDescriptions[selectedActivity]}</p>
                        )}
                    </FormGroup>
                </>
            )}

            <Button type="submit" color="primary">Prijava</Button>
        </Form>
    );
};

export default PrijavaForm;
