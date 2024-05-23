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
import { Link } from "react-router-dom";
// JavaScript plugin that hides or shows a component based on your scroll
import Headroom from "headroom.js";
import Logout from "views/examples/Logout";
import { auth } from "components/Firebase/Firebase.js"; // Make sure the path is correct
import { onAuthStateChanged } from "firebase/auth";
// reactstrap components
import {
  Button,
  UncontrolledCollapse,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

class DemoNavbar extends React.Component {
  state = {
    collapseClasses: "",
    collapseOpen: false,
    isAuthenticated: false,  // State to keep track of authentication status
  };

  componentDidMount() {
    let headroom = new Headroom(document.getElementById("navbar-main"));
    headroom.init();

    // Firebase Auth listener to toggle authentication status
    this.authUnsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setState({ isAuthenticated: true });
      } else {
        this.setState({ isAuthenticated: false });
      }
    });
  }

  componentWillUnmount() {
    this.authUnsub();  // Unsubscribe from auth listener when component unmounts
  }

  onExiting = () => {
    this.setState({
      collapseClasses: "collapsing-out",
    });
  };

  onExited = () => {
    this.setState({
      collapseClasses: "",
    });
  };

  render() {
    const { isAuthenticated } = this.state;
    return (
      <>
        <header className="header-global">
          <Navbar
            className="navbar-main navbar-transparent navbar-light headroom"
            expand="lg"
            id="navbar-main"
          >
            <Container>
              <NavbarBrand className="mr-lg-5" to="/" tag={Link}>
                <p>PETCONNECT</p>
              </NavbarBrand>
              <button className="navbar-toggler" id="navbar_global">
                <span className="navbar-toggler-icon" />
              </button>
              <UncontrolledCollapse
                toggler="#navbar_global"
                navbar
                className={this.state.collapseClasses}
                onExiting={this.onExiting}
                onExited={this.onExited}
              >
                <div className="navbar-collapse-header">
                  <Row>
                    <Col className="collapse-brand" xs="6">
                      <Link to="/">
                        <img
                          alt="..."
                          src={require("assets/img/brand/argon-react.png")}
                        />
                      </Link>
                    </Col>
                    <Col className="collapse-close" xs="6">
                      <button className="navbar-toggler" id="navbar_global">
                        <span />
                        <span />
                      </button>
                    </Col>
                  </Row>
                </div>
                <Nav className="navbar-nav-hover align-items-lg-center" navbar>
                  <UncontrolledDropdown nav>
                  <DropdownToggle nav>
                      <i className="ni ni-collection d-lg-none mr-1" />
                      <span className="nav-link-inner--text">Skupnost</span>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem to="/skupinske-aktivnosti" tag={Link}>
                      Skupinske aktivnosti
                      </DropdownItem>
                      <DropdownItem to="#" tag={Link}>
                      Forum
                      </DropdownItem>
                      <DropdownItem to="#" tag={Link}>
                      Lokalne skupine
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <UncontrolledDropdown nav>
                    <DropdownToggle nav>
                      <i className="ni ni-collection d-lg-none mr-1" />
                      <span className="nav-link-inner--text">Priporočila</span>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem to="#" tag={Link}>
                      Hrana
                      </DropdownItem>
                      <DropdownItem to="#" tag={Link}>
                      Igrače
                      </DropdownItem>
                      <DropdownItem to="#" tag={Link}>
                      Pripomočki
                      </DropdownItem>
                      <DropdownItem to="#" tag={Link}>
                      Izdelki za nego
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <UncontrolledDropdown nav>
                  <DropdownToggle nav>
                      <i className="ni ni-collection d-lg-none mr-1" />
                      <span className="nav-link-inner--text">Veterinarski nasveti</span>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem to="/clanki" tag={Link}>
                      Članki
                      </DropdownItem>
                      <DropdownItem to="/nasveti" tag={Link}>
                      Nasveti
                      </DropdownItem>
                      <DropdownItem to="/pogosta-vprasanja" tag={Link}>
                      Pogosta vprašanja
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <UncontrolledDropdown nav>
                  <DropdownToggle nav>
                      <i className="ni ni-collection d-lg-none mr-1" />
                      <span className="nav-link-inner--text" to="/sledenje-zdravju">Zdravje</span>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem to="/sledenje-zdravju" tag={Link}>
                      Cepljenja
                      </DropdownItem>
                      <DropdownItem to="/sledenje-zdravju" tag={Link}>
                      Prehrana
                      </DropdownItem>
                      <DropdownItem to="/sledenje-zdravju" tag={Link}>
                      Obiski pri veterinarju
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <UncontrolledDropdown nav>
                  <DropdownToggle nav>
                      <i className="ni ni-collection d-lg-none mr-1" />
                      <span className="nav-link-inner--text">Oskrba</span>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem to="/koledar" tag={Link}>
                      Sprehajalci
                      </DropdownItem>
                      <DropdownItem to="#" tag={Link}>
                      Frizerji
                      </DropdownItem>
                      <DropdownItem to="#" tag={Link}>
                      Trenerji
                      </DropdownItem>
                      <DropdownItem to="#" tag={Link}>
                      Varstvo ljubljenčkov
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Nav>
                <Nav className="ml-lg-auto" navbar>
                  {!isAuthenticated && (
                    <>
                      <NavItem>
                        <NavLink to="/register-page" tag={Link}>
                          Registracija <span className="sr-only">(current)</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink to="/login-page" tag={Link}>
                          Prijava
                        </NavLink>
                      </NavItem>
                    </>
                  )}
                  {isAuthenticated && (
                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav>
                        <i className="ni ni-circle-08"></i>
                      </DropdownToggle>
                      <DropdownMenu
                        aria-labelledby="navbar-primary_dropdown_1"
                        right
                      >
                        <DropdownItem to="/profile-page" tag={Link}>
                          Uredi profil
                        </DropdownItem>
                        <DropdownItem divider />
                        <Logout />
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  )}
                </Nav>
              </UncontrolledCollapse>
            </Container>
          </Navbar>
        </header>
      </>
    );
  }
}

export default DemoNavbar;
