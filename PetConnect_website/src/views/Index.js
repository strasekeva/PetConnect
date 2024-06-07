
import React from "react";

// reactstrap components
import { Container, Row, Col } from "reactstrap";

// core components
import Navbar from "components/Navbars/Navbar.js";
import CardsFooter from "components/Footers/CardsFooter.js";

// index page sections
import Hero from "./IndexSections/Hero.js";
import 'assets/css/zacetna.css';

class Index extends React.Component {
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }
  render() {
    return (
        <>
          <Navbar />
          <main ref="main">
            <Hero />
            <section id="funkcionalnosti" className="section section-lg reduce-footer-margin">
              <Container>
                <Row>
                  <Col lg="4" className="mb-5 mb-lg-0">
                    <div className="feature-box shadow-lg rounded-lg text-center p-4">
                      <div className="icon icon-lg rounded-circle">
                        <i className="ni ni-chat-round"></i>
                      </div>
                      <h3 className="mt-4" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333333" }}>Skupnost</h3>
                      <p className="mt-3">
                        Povežite se s skupnostjo preko skupinskih aktivnosti, foruma in lokalnih skupin.
                      </p>
                      <a href="/skupinske-aktivnosti" className="btn btn-primary mt-4">Več informacij</a>
                    </div>
                  </Col>
                  <Col lg="4" className="mb-5 mb-lg-0">
                    <div className="feature-box shadow-lg rounded-lg text-center p-4">
                      <div className="icon icon-lg rounded-circle">
                        <i className="ni ni-shop"></i>
                      </div>
                      <h3 className="mt-4" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333333" }}>Priporočila izdelkov</h3>
                      <p className="mt-3">
                        Odkrijte najboljše izdelke za vašega ljubljenčka, ki jih priporoča naša skupnost.
                      </p>
                      <a href="/izdelki" className="btn btn-primary mt-4">Več informacij</a>
                    </div>
                  </Col>
                  <Col lg="4">
                    <div className="feature-box shadow-lg rounded-lg text-center p-4">
                      <div className="icon icon-lg rounded-circle">
                        <i className="ni ni-ambulance"></i>
                      </div>
                      <h3 className="mt-4" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333333" }}>Veterinarski nasveti</h3>
                      <p className="mt-3">
                        Dostopajte do strokovnih nasvetov, člankov in možnosti klepetanja s ChatGPT-jem.
                      </p>
                      <a href="/clanki" className="btn btn-primary mt-4">Več informacij</a>
                    </div>
                  </Col>
                </Row>
                <Row className="mt-5 justify-content-center">
                  <Col lg="4" className="mb-5 mb-lg-0">
                    <div className="feature-box shadow-lg rounded-lg text-center p-4">
                      <div className="icon icon-lg rounded-circle">
                        <i className="ni ni-favourite-28"></i>
                      </div>
                      <h3 className="mt-4" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333333" }}>Zdravje</h3>
                      <p className="mt-3">
                        Sledite zdravju vašega ljubljenčka s sledenjem cepljenjem, prehrani in obiskov pri veterinarju.
                      </p>
                      <a href="/sledenje-zdravju" className="btn btn-primary mt-4">Več informacij</a>
                    </div>
                  </Col>
                  <Col lg="4" className="mb-5 mb-lg-0">
                    <div className="feature-box shadow-lg rounded-lg text-center p-4">
                      <div className="icon icon-lg rounded-circle">
                        <i className="ni ni-calendar-grid-58"></i>
                      </div>
                      <h3 className="mt-4" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333333" }}>Oskrba</h3>
                      <p className="mt-3">
                        Rezervirajte storitve, kot so frizer, veterinar, hoteli in sprehodi, za vašega ljubljenčka.
                      </p>
                      <a href="/koledar" className="btn btn-primary mt-4">Več informacij</a>
                    </div>
                  </Col>
                </Row>
              </Container>
            </section>
          </main>
          <CardsFooter />
        </>
      );
    }
  }
  
  export default Index;