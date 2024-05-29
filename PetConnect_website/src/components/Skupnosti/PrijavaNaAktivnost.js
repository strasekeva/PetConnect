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
        </>
    );
};

export default PrijavaNaAktivnost;
