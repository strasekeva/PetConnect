import React, { useState } from 'react';
import Navbar from "components/Navbars/Navbar.js";
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

const ChatComponent = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await fetch('/api/get-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      setAnswer(data.choices[0].message.content); // Extracting and setting the answer
    } catch (error) {
      console.error('Error:', error);
      setError(`An error occurred while fetching the answer: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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
                <h1 className="text-center">Ask a Question</h1>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="question">Question</Label>
                    <Input
                      type="textarea"
                      name="question"
                      id="question"
                      value={question}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Enter your question here..."
                      required
                    />
                  </FormGroup>
                  <Button type="submit" color="primary" disabled={loading} block>
                    {loading ? <Spinner size="sm" /> : 'Submit'}
                  </Button>
                </Form>
                {error && (
                  <Alert color="danger" className="mt-4">
                    <h4 className="alert-heading">Error</h4>
                    <p>{error}</p>
                  </Alert>
                )}
                {answer && (
                  <Alert color="success" className="mt-4">
                    <h4 className="alert-heading">Answer</h4>
                    <p>{answer}</p>
                  </Alert>
                )}
              </Col>
            </Row>
          </Container>
        </section>
        <div>
          <span />
          <span />
        </div>
      </main>
      <SimpleFooter />
    </>
  );
}

export default ChatComponent;
