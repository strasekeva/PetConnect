import React from 'react';
import { FormGroup, Label, Input, FormText } from 'reactstrap';

const PrijavaNaAktivnost = ({ registrationRequired, setRegistrationRequired, availableSeats, setAvailableSeats, free, setFree, price, setPrice }) => {
    return (
        <>
            <FormGroup>
                <Label for="registrationRequired">Potrebna prijava</Label>
                <Input
                    type="select"
                    id="registrationRequired"
                    value={registrationRequired}
                    onChange={(e) => setRegistrationRequired(e.target.value)}
                >
                    <option value="no">Ne</option>
                    <option value="yes">Da</option>
                </Input>
            </FormGroup>
            {registrationRequired === 'yes' && (
                <FormGroup>
                    <Label for="availableSeats">Število mest</Label>
                    <Input
                        type="number"
                        id="availableSeats"
                        value={availableSeats}
                        onChange={(e) => setAvailableSeats(e.target.value)}
                        min="1"
                    />
                </FormGroup>
            )}
            <FormGroup>
                <Label for="free">Brezplačno</Label>
                <Input
                    type="select"
                    id="free"
                    value={free}
                    onChange={(e) => setFree(e.target.value)}
                >
                    <option value="yes">Da</option>
                    <option value="no">Ne</option>
                </Input>
            </FormGroup>
            {free === 'no' && (
                <FormGroup>
                    <Label for="price">Cena</Label>
                    <Input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min="0"
                    />
                    <FormText color="muted">Vpišite ceno v EUR.</FormText>
                </FormGroup>
            )}
        </>
    );
};

export default PrijavaNaAktivnost;
