import React, { useState, useEffect } from 'react';
import Navbar from "components/Navbars/Navbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import { firestore } from 'components/Firebase/Firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SledenjeZdravju = () => {
  const [healthData, setHealthData] = useState({
    cepljenje: [{ namen: '', datum: '' }],
    prehrana: '',
    teza: '',
    obiskiPriVeterinarju: ''
  });

  const [submittedEntries, setSubmittedEntries] = useState([]);
  const [vaccinationDates, setVaccinationDates] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'healthData'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSubmittedEntries(data);

        // Extract vaccination dates from data and save them in state
        const dates = data.flatMap(entry =>
          entry.cepljenje.map(vaccine => new Date(vaccine.datum))
        );
        setVaccinationDates(dates);
      } catch (error) {
        console.error('Error fetching documents: ', error);
      }
    };

    fetchData();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEntry = {
      ...healthData,
      timestamp: new Date().toLocaleString()
    };

    try {
      const docRef = await addDoc(collection(firestore, 'healthData'), newEntry);
      setSubmittedEntries([...submittedEntries, { id: docRef.id, ...newEntry }]);
      setHealthData({
        cepljenje: [{ namen: '', datum: '' }],
        prehrana: '',
        teza: '',
        obiskiPriVeterinarju: ''
      });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'healthData', id));
      setSubmittedEntries(submittedEntries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  // Sort submittedEntries by timestamp in ascending order
  const sortedEntries = [...submittedEntries].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const weightData = sortedEntries.map(entry => ({
    timestamp: entry.timestamp,
    teza: parseFloat(entry.teza)
  }));

  
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

        {sortedEntries.length > 0 && (
          <div className="mt-5">
            <h3>Vpisani podatki o zdravju</h3>
            {sortedEntries.map((entry, index) => (
              <div key={index} className="card mb-3">
                <div className="card-header">
                  <strong>Datum in ura vnosa:</strong> {entry.timestamp}
                  <button
                    className="btn btn-danger btn-sm float-right ml-2"
                    onClick={() => handleDelete(entry.id)}
                  >
                    Odstrani
                  </button>
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
            
            <div className="mt-5">
              <h3>Spremembe teže skozi čas</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="teza" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
      <SimpleFooter />
    </div>
  );
};

export default SledenjeZdravju;
