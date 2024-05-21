import React, { useState } from 'react';
import Navbar from "components/Navbars/Navbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";

const SledenjeZdravju = () => {
  const [healthData, setHealthData] = useState({
    cepljenje: [{ namen: '', datum: '' }],
    prehrana: '',
    teza: '',
    obiskiPriVeterinarju: ''
  });

  const [submittedEntries, setSubmittedEntries] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHealthData({ ...healthData, [name]: value });
  };

  const handleCepljenjeChange = (index, e) => {
    const { name, value } = e.target;
    const newCepljenje = healthData.cepljenje.map((cepljenje, i) => {
      if (i === index) {
        return { ...cepljenje, [name]: value };
      }
      return cepljenje;
    });
    setHealthData({ ...healthData, cepljenje: newCepljenje });
  };

  const addCepljenje = () => {
    setHealthData({
      ...healthData,
      cepljenje: [...healthData.cepljenje, { namen: '', datum: '' }]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      ...healthData,
      timestamp: new Date().toLocaleString()
    };
    setSubmittedEntries([...submittedEntries, newEntry]);
    setHealthData({
      cepljenje: [{ namen: '', datum: '' }],
      prehrana: '',
      teza: '',
      obiskiPriVeterinarju: ''
    });
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2>Sledenje zdravju vašega ljubljenčka</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cepljenje:</label>
            {healthData.cepljenje.map((item, index) => (
              <div key={index} className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2"
                  name="namen"
                  placeholder="Namen cepljenja"
                  value={item.namen}
                  onChange={(e) => handleCepljenjeChange(index, e)}
                />
                <input
                  type="date"
                  className="form-control"
                  name="datum"
                  value={item.datum}
                  onChange={(e) => handleCepljenjeChange(index, e)}
                />
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={addCepljenje}>
              Dodaj cepljenje
            </button>
          </div>
          <div className="form-group">
            <label>Prehrana:</label>
            <input
              type="text"
              className="form-control"
              name="prehrana"
              value={healthData.prehrana}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Teža (v kilogramih):</label>
            <input
              type="number"
              className="form-control"
              name="teza"
              value={healthData.teza}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Zadnji obisk pri veterinarju:</label>
            <input
              type="date"
              className="form-control"
              name="obiskiPriVeterinarju"
              value={healthData.obiskiPriVeterinarju}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Shrani podatke o zdravju
          </button>
        </form>

        {submittedEntries.length > 0 && (
          <div className="mt-5">
            <h3>Vpisani podatki o zdravju</h3>
            {submittedEntries.map((entry, index) => (
              <div key={index} className="card mb-3">
                <div className="card-header">
                  <strong>Datum in ura vnosa:</strong> {entry.timestamp}
                </div>
                <div className="card-body">
                  <p><strong>Cepljenja:</strong></p>
                  <ul>
                    {entry.cepljenje.map((cepljenje, i) => (
                      <li key={i}>
                        <p><strong>Namen:</strong> {cepljenje.namen}</p>
                        <p><strong>Datum:</strong> {cepljenje.datum}</p>
                      </li>
                    ))}
                  </ul>
                  <p><strong>Prehrana:</strong> {entry.prehrana}</p>
                  <p><strong>Teža:</strong> {entry.teza} kg</p>
                  <p><strong>Zadnji obisk pri veterinarju:</strong> {entry.obiskiPriVeterinarju}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <SimpleFooter />
    </div>
  );
};

export default SledenjeZdravju;
