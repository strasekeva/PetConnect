/*!

=========================================================
* Argon Design System React - v1.1.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import { Container, Row, Col } from "reactstrap";

// core components
import Navbar from "components/Navbars/Navbar.js";
import CardsFooter from "components/Footers/CardsFooter.js";

// index page sections
import Hero from "./IndexSections/Hero.js";
import Buttons from "./IndexSections/Buttons.js";
import Inputs from "./IndexSections/Inputs.js";
import CustomControls from "./IndexSections/CustomControls.js";
import Menus from "./IndexSections/Menus.js";
import Navbars from "./IndexSections/Navbars.js";
import Tabs from "./IndexSections/Tabs.js";
import Progress from "./IndexSections/Progress.js";
import Pagination from "./IndexSections/Pagination.js";
import Pills from "./IndexSections/Pills.js";
import Labels from "./IndexSections/Labels.js";
import Alerts from "./IndexSections/Alerts.js";
import Typography from "./IndexSections/Typography.js";
import Modals from "./IndexSections/Modals.js";
import Datepicker from "./IndexSections/Datepicker.js";
import TooltipPopover from "./IndexSections/TooltipPopover.js";
import Carousel from "./IndexSections/Carousel.js";
import Icons from "./IndexSections/Icons.js";
import Login from "./IndexSections/Login.js";
import Download from "./IndexSections/Download.js";
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
          <section id="funkcionalnosti" className="section section-lg">
            <Container>
              <Row>
            <Col lg="4" className="mb-5 mb-lg-0">
                  <div className="feature-box shadow-lg rounded-lg text-center p-4">
                      <div className="icon icon-lg rounded-circle">
                          <i className="ni ni-chat-round"></i>
                      </div>
                      <h3 className="mt-4" style={{fontSize: "1.5rem", fontWeight: "bold", color: "#333333"}}>Skupnost</h3>
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
                      <h3 className="mt-4" style={{fontSize: "1.5rem", fontWeight: "bold", color: "#333333"}}>Priporočila izdelkov</h3>
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
                      <h3 className="mt-4" style={{fontSize: "1.5rem", fontWeight: "bold", color: "#333333"}}>Veterinarski nasveti</h3>
                      <p className="mt-3">
                          Dostopajte do strokovnih nasvetov, člankov in možnosti klepetanja s ChatGPT-jem.
                      </p>
                      <a href="/clanki" className="btn btn-primary mt-4">Več informacij</a>
                  </div>
              </Col>
              <Col lg="4" className="mb-5 mb-lg-0">
                  <div className="feature-box shadow-lg rounded-lg text-center p-4">
                      <div className="icon icon-lg rounded-circle">
                          <i className="ni ni-favourite-28"></i>
                      </div>
                      <h3 className="mt-4" style={{fontSize: "1.5rem", fontWeight: "bold", color: "#333333"}}>Zdravje</h3>
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
                      <h3 className="mt-4" style={{fontSize: "1.5rem", fontWeight: "bold", color: "#333333"}}>Oskrba</h3>
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