import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FilterComponent = ({ filterLocation, filterMonth, filterCategory, sortByDate, handleFilterLocation, handleFilterMonth, handleFilterCategory, handleSortByDate, categories }) => {
    return (
        <div>
            <h3 className="text-center">Filter</h3>
            <FormGroup>
                <Label for="locationFilter">Lokacija</Label>
                <Input type="text" id="locationFilter" value={filterLocation} onChange={handleFilterLocation} placeholder="Enter location" />
            </FormGroup>
            <FormGroup>
                <Label for="monthFilter">Mesec</Label>
                <Input type="select" id="monthFilter" value={filterMonth} onChange={handleFilterMonth}>
                    <option value="">All</option>
                    <option value="1">Januar</option>
                    <option value="2">Februar</option>
                    <option value="3">Marec</option>
                    <option value="4">April</option>
                    <option value="5">Maj</option>
                    <option value="6">Junij</option>
                    <option value="7">Julij</option>
                    <option value="8">Avgust</option>
                    <option value="9">September</option>
                    <option value="10">Oktober</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="categoryFilter">Kategorija</Label>
                <Input type="select" id="categoryFilter" value={filterCategory} onChange={handleFilterCategory}>
                    <option value="">All</option>
                    {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </Input>
            </FormGroup>
            <FormGroup check>
                <Label check>
                    <Input type="checkbox" checked={sortByDate} onChange={handleSortByDate} /> Sort by Date
                </Label>
            </FormGroup>
        </div>
    );
};

export default FilterComponent;
