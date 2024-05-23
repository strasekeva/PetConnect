import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from "components/Firebase/Firebase.js";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, CardImg } from 'reactstrap';
import Navbar from "components/Navbars/Navbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";

const VeterinaryArticles = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const articlesCollection = collection(firestore, 'clanki');
      const articlesSnapshot = await getDocs(articlesCollection);
      const articlesList = articlesSnapshot.docs.map(doc => doc.data());
      setArticles(articlesList);
    };

    fetchArticles();
  }, []);


  return (
    <>
      <Navbar />
      <main>
        <section className="section section-shaped section-lg">
          <div className="shape shape-style-1 shape-default alpha-4">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </section>
        <section>
          <Container className="mt-5">
            <div style={{marginBottom: "3%"}}>
              <h1 className="text-center display-1 mb-0">Novice</h1>
            </div>
            <Row>
              {articles.map((article, index) => (
                <Col key={index} md="4" className="mb-4">
                  <Card>
                    <CardBody>
                      <CardTitle tag="h5">{article.title}</CardTitle>
                      <CardImg
                        alt="Card image cap"
                        src={article.img}
                        top
                        width="100%"
                      />
                      <CardText>{article.description}</CardText>
                      <Button color="primary" href={article.url} target="_blank">Preberi več</Button>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>

        </section>
        <p className="text-center text-muted mb-0">Vir: https://www.dzzz.si/</p>
      </main>
      <SimpleFooter />
    </>
  );
}

export default VeterinaryArticles;
