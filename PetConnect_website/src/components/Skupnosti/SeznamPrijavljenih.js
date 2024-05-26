import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import { Table, Modal, ModalHeader, ModalBody, Button } from 'reactstrap';

const SeznamPrijavljenih = ({ activity, isOpen, toggle }) => {
    const [registrations, setRegistrations] = useState([]);
    const firestore = getFirestore();

    useEffect(() => {
        const fetchRegistrations = async () => {
            if (isOpen) {
                const q = query(collection(firestore, 'activities', activity.id, 'registrations'));
                const querySnapshot = await getDocs(q);
                const registrationsList = querySnapshot.docs.map(doc => doc.data());
                setRegistrations(registrationsList);
            }
        };

        fetchRegistrations();
    }, [activity.id, firestore, isOpen]);

    const totalRegistered = registrations.reduce((total, reg) => total + (reg.steviloLjudji || 0), 0);
    const availableSpots = activity.availableSeats ? Math.max(activity.availableSeats - totalRegistered, 0) : 0;

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Seznam prijavljenih</ModalHeader>
            <ModalBody>
                <Table>
                    <thead>
                        <tr>
                            <th>Ime</th>
                            <th>Priimek</th>
                            <th>Email</th>
                            <th>Število ljudi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map((reg, index) => (
                            <tr key={index}>
                                <td>{reg.ime}</td>
                                <td>{reg.priimek}</td>
                                <td>{reg.email}</td>
                                <td>{reg.steviloLjudji}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <p><strong>Prosta mesta:</strong> {availableSpots}</p>
            </ModalBody>
            <Button color="secondary" onClick={toggle}>Zapri</Button>
        </Modal>
    );
};

export default SeznamPrijavljenih;
