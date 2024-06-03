import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Container, Row, Col, Alert } from "reactstrap";
import { auth } from "components/Firebase/Firebase.js"; // Adjust this path as necessary
import { signInWithEmailAndPassword } from 'firebase/auth';
import Navbar from "components/Navbars/Navbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const mainRef = useRef(null); 
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful', userCredential.user);
      // Save user UID to localStorage
      localStorage.setItem('userUid', userCredential.user.uid);
      navigate('/'); // Navigate to the homepage or profile page
    } catch (error) {
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      console.error('Error during login:', error);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Napačen email naslov.';
      case 'auth/user-disabled':
        return 'Uporabniški račun je onemogočen.';
      case 'auth/user-not-found':
        return 'Uporabniški račun ne obstaja.';
      case 'auth/wrong-password':
        return 'Napačno geslo.';
      default:
        return 'Prišlo je do napake. Prosimo, poskusite znova.';
    }
  };

  return (
    <>
      <Navbar />
      <main ref={mainRef}>
        <section className="section section-shaped section-lg">
          <div className="shape shape-style-1 bg-gradient-default">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <Container className="pt-lg-7">
            <Row className="justify-content-center">
              <Col lg="5">
                <Card className="bg-secondary shadow border-0">
                  <CardBody className="px-lg-5 py-lg-5">
                    <h2 className="text-center display-2 mb-0">Prijava</h2>
                    <br />
                    {error && <Alert color="danger">{error}</Alert>}
                    <Form role="form" onSubmit={handleLogin}>
                      <FormGroup className="mb-3">
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-email-83" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input placeholder="Geslo" type="password" autoComplete="off" onChange={(e) => setPassword(e.target.value)} />
                        </InputGroup>
                      </FormGroup>
                      <div className="custom-control custom-control-alternative custom-checkbox">
                        <input className="custom-control-input" id=" customCheckLogin" type="checkbox" />
                        <label className="custom-control-label" htmlFor=" customCheckLogin">
                          <span>Zapomni se me</span>
                        </label>
                      </div>
                      <div className="text-center">
                        <Button className="my-4" color="primary" type="submit">
                          Prijava
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
                <Row className="mt-3">
                  <Col xs="6">
                    <a className="text-light" href="#pablo" onClick={(e) => e.preventDefault()}>
                      <small>Pozabljeno geslo?</small>
                    </a>
                  </Col>
                  <Col className="text-right" xs="6">
                    <a className="text-light" href="#pablo" onClick={(e) => e.preventDefault()}>
                      <small>Ustvari nov račun</small>
                    </a>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
      <SimpleFooter />
    </>
  );
}

export default Login;
