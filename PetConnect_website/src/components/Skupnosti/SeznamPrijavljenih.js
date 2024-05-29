import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import { Table, Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

    const totalRegistered = registrations.reduce((total, reg) => total + parseInt(reg.steviloLjudji || 0), 0);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text(`Seznam prijavljenih na aktivnost: ${activity.name}`, 10, 10);

        const tableColumn = ["Ime", "Priimek", "Email", "Število ljudi"];
        if (activity.category === 'competitions') {
            tableColumn.push("Ime psa", "Starost", "Kategorije");
        }

        const tableRows = registrations.map(reg => {
            const row = [reg.ime, reg.priimek, reg.email, reg.steviloLjudji];
            if (activity.category === 'competitions') {
                row.push(reg.tekmovanje?.imePsa, reg.tekmovanje?.starost, reg.tekmovanje?.podrocja);
            }
            return row;
        });

        doc.autoTable(tableColumn, tableRows, { startY: 20 });
        doc.text(`Prosta mesta: ${totalRegistered}/${activity.availableSeats}`, 10, doc.autoTable.previous.finalY + 10);

        doc.save(`Seznam_prijavljenih_${activity.name}.pdf`);
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} className="modal-lg">
            <ModalHeader toggle={toggle}>Seznam prijavljenih</ModalHeader>
            <ModalBody>
                <Table>
                    <thead>
                        <tr>
                            <th>Ime</th>
                            <th>Priimek</th>
                            <th>Email</th>
                            <th>Število ljudi</th>
                            {activity.category === 'competitions' && (
                                <>
                                    <th>Ime psa</th>
                                    <th>Starost</th>
                                    <th>Kategorije</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map((reg, index) => (
                            <tr key={index}>
                                <td>{reg.ime}</td>
                                <td>{reg.priimek}</td>
                                <td>{reg.email}</td>
                                <td>{reg.steviloLjudji}</td>
                                {activity.category === 'competitions' && (
                                    <>
                                        <td>{reg.tekmovanje?.imePsa}</td>
                                        <td>{reg.tekmovanje?.starost}</td>
                                        <td>{reg.tekmovanje?.podrocja}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <p><strong>Prosta mesta:</strong> {totalRegistered}/{activity.availableSeats}</p>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button color="info" onClick={generatePDF}>Generiraj PDF</Button>
                </div>
            </ModalBody>
            <Button color="secondary" onClick={toggle}>Zapri</Button>
        </Modal>
    );
};

export default SeznamPrijavljenih;
