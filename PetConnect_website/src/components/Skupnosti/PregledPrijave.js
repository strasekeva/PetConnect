import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';

const PregledPrijave = ({ activity, currentUser, isOpen, toggle }) => {
    const [registration, setRegistration] = useState(null);
    const [totalRegistered, setTotalRegistered] = useState(0);
    const firestore = getFirestore();

    useEffect(() => {
        const fetchRegistration = async () => {
            if (isOpen && currentUser) {
                const q = query(
                    collection(firestore, 'activities', activity.id, 'registrations'),
                    where('email', '==', currentUser.email)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    setRegistration(querySnapshot.docs[0].data());
                } else {
                    setRegistration(null);
                }
            }
        };

        const fetchTotalRegistered = async () => {
            const q = query(collection(firestore, 'activities', activity.id, 'registrations'));
            const querySnapshot = await getDocs(q);
            const registrationsList = querySnapshot.docs.map(doc => doc.data());
            const total = registrationsList.reduce((total, reg) => total + (reg.steviloLjudji || 0), 0);
            setTotalRegistered(total);
        };

        fetchRegistration();
        fetchTotalRegistered();
    }, [activity.id, currentUser, firestore, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setRegistration(null);
            setTotalRegistered(0);
        }
    }, [isOpen]);


    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Podrobnosti prijave</ModalHeader>
            <ModalBody>
                {registration ? (
                    <div>
                        <p><strong>Ime:</strong> {registration.ime}</p>
                        <p><strong>Priimek:</strong> {registration.priimek}</p>
                        <p><strong>Email:</strong> {registration.email}</p>
                        <p><strong>Število ljudi:</strong> {registration.steviloLjudji}</p>
                        {activity.category === 'competitions' && registration.tekmovanje && (
                            <>
                                <p><strong>Ime psa:</strong> {registration.tekmovanje.imePsa}</p>
                                <p><strong>Pasma:</strong> {registration.tekmovanje.pasma}</p>
                                <p><strong>Starost:</strong> {registration.tekmovanje.starost}</p>
                                <p><strong>Področja:</strong> {registration.tekmovanje.podrocja}</p>
                            </>
                        )}
                    </div>
                ) : (
                    <p>Niste prijavljeni na to aktivnost.</p>
                )}
            </ModalBody>
            <Button color="secondary" onClick={toggle}>Zapri</Button>
        </Modal>
    );
};

export default PregledPrijave;
