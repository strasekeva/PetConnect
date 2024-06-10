import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from "components/Firebase/Firebase.js";
import { collection, addDoc, query, orderBy, getDocs, serverTimestamp } from "firebase/firestore";
import { useAuth } from 'components/Contexts/AuthContext';
import Navbar from "components/Navbars/Navbar.js";
import History from './History';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
  Spinner,
  Alert
} from 'reactstrap';
import SimpleFooter from "components/Footers/SimpleFooter.js";
import 'assets/css/styles.css';

const ChatComponent = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);


  const fetchHistory = useCallback(async () => {
    if (!currentUser) return;
    const q = query(collection(firestore, "users", currentUser.uid, "history"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const historyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setHistory(historyData);
  }, [currentUser]);

  useEffect(() => {
    fetchHistory();
  }, [currentUser, fetchHistory]);


  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async (event, savedQuestion) => {
    if (event) event.preventDefault();

    const questionToSubmit = savedQuestion || question;

    if (!currentUser) {
      alert('Potrebna je prijava');
      localStorage.setItem('unsavedQuestion', questionToSubmit);
      navigate('/login-page');
      return;
    }

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      // Predpostavimo, da imate endpoint, ki vrne odgovor od ChatGPT
      const response = await fetch('https://us-central1-petconnect-d446b.cloudfunctions.net/api/get-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: questionToSubmit })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (!data.choices || !data.choices.length || !data.choices[0].message.content) {
        throw new Error('Answer format is incorrect or missing');
      }

      const answer = data.choices[0].message.content;
      setAnswer(answer);  // Nastavite odgovor v stanje

      // Shranjevanje vprašanja in odgovora v Firestore
      await addDoc(collection(firestore, "users", currentUser.uid, "history"), {
        question: questionToSubmit,
        answer: answer,
        timestamp: serverTimestamp()
      });

      fetchHistory();

    } catch (error) {
      console.error('Error:', error);
      setError(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && localStorage.getItem('unsavedQuestion')) {
      handleSubmit(undefined, localStorage.getItem('unsavedQuestion'));
      localStorage.removeItem('unsavedQuestion');
    }
  }, [currentUser, handleSubmit]);

  return (
    <>
      <Navbar />
      <main>
        <section className="section section-shaped section-lg">
          <div className="shape shape-style-1 shape-default alpha-4">
            <span />
          </div>
        </section>
        <section>
          <Container>
            <Row className="justify-content-center">
              <Col md="8">
                <h1 style={{ marginTop: "3%" }} className="text-center display-2 mb-0">Kaj te zanima</h1>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="question">Vprašanje</Label>
                    <Input
                      type="textarea"
                      name="question"
                      id="question"
                      value={question}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Tukaj postavi vprašanje..."
                      required
                    />
                  </FormGroup>
                  <div className="button-group">
                    <Button type="submit" color="primary" disabled={loading}>
                      {loading ? <Spinner size="sm" /> : 'Vprašaj'}
                    </Button>
                    <Button onClick={() => setShowHistory(!showHistory)} color="info">
                      {showHistory ? 'Skrij zgodovino' : 'Prikaži zgodovino'}
                    </Button>
                  </div>
                </Form>
                {error && (
                  <Alert color="danger" className="mt-4">
                    <h4 className="alert-heading">Napaka</h4>
                    <p>{error}</p>
                  </Alert>
                )}
                {answer && (
                  <Alert color="secondary" className="mt-4">
                    <h4 className="alert-heading" style={{ color: 'black' }}>Odgovor</h4>
                    <p style={{ color: 'black' }}>{answer}</p>
                  </Alert>
                )}
                {showHistory && <History history={history} />}
              </Col>
            </Row>
          </Container>
        </section>
        <div>
          <span />
          <span />
        </div>
        <p className="text-center text-muted mb-0">Nasveti so napisani s strani chatGPT in ni nujno da so zanesljivi</p>
      </main>
      <SimpleFooter />
    </>
  );
}

export default ChatComponent;
