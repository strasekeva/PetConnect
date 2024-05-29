import React from "react";
import { firestore } from "components/Firebase/Firebase"; // Uvozite Firestore povezavo
import { doc, getDoc, collection, getDocs, query, where, updateDoc } from "firebase/firestore";
import { Button, Card, Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import Navbar from "components/Navbars/Navbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

class Profile extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    profilePicture: "",
    activityCount: 0,
    groupCount: 0,
    forumCount: 0,
    modal: false,
    formData: {
      firstName: "",
      lastName: "",
      email: "",
      profilePicture: "",
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  };

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;

    const userUid = localStorage.getItem('userUid'); // Retrieve user UID from localStorage

    if (userUid) {
      const fetchUserData = async () => {
        const userDoc = doc(firestore, "users", userUid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          this.setState({
            firstName: userData.name,
            lastName: userData.surname,
            email: userData.email,
            profilePicture: userData.profilePicture || "",
            formData: {
              firstName: userData.name,
              lastName: userData.surname,
              email: userData.email,
              profilePicture: userData.profilePicture || "",
              oldPassword: "",
              password: "",
              confirmPassword: "",
            }
          });

          const activityCount = await this.getActivityCount(userUid);
          const groupCount = await this.getGroupCount(userUid);
          const forumCount = await this.getForumCount(userUid);

          this.setState({
            activityCount,
            groupCount,
            forumCount,
          });
        } else {
          console.log("No such document!");
        }
      };

      fetchUserData().catch((error) => {
        console.log("Error getting document:", error);
      });
    }
  }

  getActivityCount = async (userUid) => {
    const q = query(collection(firestore, "activities"), where("user.uid", "==", userUid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  };

  getGroupCount = async (userUid) => {
    const q = query(collection(firestore, "groups"), where("members", "array-contains", userUid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  };

  getForumCount = async (userUid) => {
    const q = query(collection(firestore, "forums"), where("user.uid", "==", userUid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  };

  toggleModal = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      formData: {
        ...this.state.formData,
        [name]: value,
      },
    });
  };

  handleImageChange = async (e) => {
    const file = e.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, `profilePictures/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    this.setState({
      formData: {
        ...this.state.formData,
        profilePicture: url,
      },
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const userUid = localStorage.getItem('userUid');
    const userDoc = doc(firestore, "users", userUid);

    const { oldPassword, password, confirmPassword, firstName, lastName, email, profilePicture } = this.state.formData;
    
    const auth = getAuth();
    const user = auth.currentUser;

    if (oldPassword && password === confirmPassword && password !== "") {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, password);
      } catch (error) {
        console.error("Error reauthenticating user:", error);
        alert("Error reauthenticating user. Please check your old password.");
        return;
      }
    }

    await updateDoc(userDoc, {
      name: firstName,
      surname: lastName,
      email: email,
      profilePicture: profilePicture,
    });

    alert("Profile updated successfully!");
    this.toggleModal();
    this.setState({
      firstName: firstName,
      lastName: lastName,
      email: email,
      profilePicture: profilePicture,
      formData: {
        ...this.state.formData,
        oldPassword: "",
        password: "",
        confirmPassword: "",
      }
    });
  };

  render() {
    const { firstName, lastName, email, profilePicture, activityCount, groupCount, forumCount, modal, formData } = this.state;

    return (
      <>
        <Navbar />
        <main className="profile-page" ref="main">
          <section className="section-profile-cover section-shaped my-0">
            <div className="shape shape-style-1 shape-default alpha-4">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="separator separator-bottom separator-skew">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-white"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </section>
          <section className="section">
            <Container>
              <Card className="card-profile shadow mt--300">
                <div className="px-4">
                  <Row className="justify-content-center">
                    <Col className="order-lg-2" lg="3">
                      <div className="card-profile-image">
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          <img
                            alt="..."
                            className="rounded-circle"
                            src={profilePicture || require("assets/img/theme/team-4-800x800.jpg")}
                          />
                        </a>
                      </div>
                    </Col>
                    <Col
                      className="order-lg-3 text-lg-right align-self-lg-center"
                      lg="4"
                    >
                      <div className="card-profile-actions d-flex justify-content-end">
                        <Button
                          color="primary"
                          size="sm"
                          onClick={this.toggleModal}
                        >
                          Edit Profile
                        </Button>
                      </div>
                    </Col>
                    <Col className="order-lg-1" lg="4">
                      <div className="card-profile-stats d-flex justify-content-center">
                        <div>
                          <span className="heading">{activityCount}</span>
                          <span className="description">Activities</span>
                        </div>
                        <div>
                          <span className="heading">{groupCount}</span>
                          <span className="description">Groups</span>
                        </div>
                        <div>
                          <span className="heading">{forumCount}</span>
                          <span className="description">Forums</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className="text-center mt-5">
                    <h3>
                      {firstName} {lastName}{""}
                    </h3>
                    <div className="h6 font-weight-300">
                      <i className="ni location_pin mr-2" />
                      {email}
                    </div>
                    <div className="h6 mt-4">
                      <i className="ni business_briefcase-24 mr-2" />
                      PetConnect User
                    </div>
                    <div>
                      <i className="ni education_hat mr-2" />
                      Connecting Pet Owners
                    </div>
                  </div>
                  <div className="mt-5 py-5 border-top text-center">
                    <Row className="justify-content-center">
                      <Col lg="9">
                        <p>
                          Welcome to PetConnect! This platform helps pet owners connect with local groups, find and book pet services, get expert advice on pet health and care, and much more.
                        </p>
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          Show more
                        </a>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Card>
            </Container>
          </section>
          <Modal isOpen={modal} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>Edit Profile</ModalHeader>
            <Form onSubmit={this.handleSubmit}>
              <ModalBody>
                <FormGroup>
                  <Label for="firstName">First Name</Label>
                  <Input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={this.handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label for="lastName">Last Name</Label>
                  <Input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={this.handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input type="email" name="email" id="email" value={formData.email} onChange={this.handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label for="profilePicture">Profile Picture</Label>
                  <Input type="file" name="profilePicture" id="profilePicture" onChange={this.handleImageChange} />
                  {formData.profilePicture && <img src={formData.profilePicture} alt="Profile" style={{ width: "100px", height: "100px" }} />}
                </FormGroup>
                <FormGroup>
                  <Label for="oldPassword">Old Password</Label>
                  <Input type="password" name="oldPassword" id="oldPassword" value={formData.oldPassword} onChange={this.handleChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="password">New Password</Label>
                  <Input type="password" name="password" id="password" value={formData.password} onChange={this.handleChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="confirmPassword">Confirm New Password</Label>
                  <Input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={this.handleChange} />
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" color="primary">Save Changes</Button>{' '}
                <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
              </ModalFooter>
            </Form>
          </Modal>
        </main>
        <SimpleFooter />
      </>
    );
  }
}

export default Profile;
