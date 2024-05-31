import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { firestore } from "components/Firebase/Firebase"; // Uvozite Firestore povezavo
import { doc, getDoc, collection, getDocs, query, where, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { Button, Card, Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import Navbar from "components/Navbars/Navbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const DEFAULT_PROFILE_PICTURE_URL = "https://firebasestorage.googleapis.com/v0/b/petconnect-d446b.appspot.com/o/profilePictures%2Fdefault.jpg?alt=media";

const Profile = () => {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePicture: "",
    activityCount: 0,
    groupCount: 0,
    forumCount: 0,
    petPhotos: [],
    modal: false,
    uploadModal: false,
    formData: {
      firstName: "",
      lastName: "",
      email: "",
      profilePicture: "",
      oldPassword: "",
      password: "",
      confirmPassword: "",
      petName: "",
      photoDescription: "",
      petPhotoFile: null
    },
  });

  const mainRef = useRef(null);
  const { id } = useParams();
  const userUid = id || localStorage.getItem('userUid'); // Retrieve user UID from URL params or localStorage

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }

    if (userUid) {
      const fetchUserData = async () => {
        const userDoc = doc(firestore, "users", userUid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setState(prevState => ({
            ...prevState,
            firstName: userData.name,
            lastName: userData.surname,
            email: userData.email,
            profilePicture: userData.profilePicture || DEFAULT_PROFILE_PICTURE_URL,
            formData: {
              ...prevState.formData,
              firstName: userData.name,
              lastName: userData.surname,
              email: userData.email,
              profilePicture: userData.profilePicture || DEFAULT_PROFILE_PICTURE_URL,
            }
          }));

          const activityCount = await getActivityCount(userUid);
          const groupCount = await getGroupCount(userUid);
          const forumCount = await getForumCount(userUid);
          const petPhotos = await fetchPetPhotos(userUid);

          setState(prevState => ({
            ...prevState,
            activityCount,
            groupCount,
            forumCount,
            petPhotos
          }));
        } else {
          console.log("No such document!");
        }
      };

      fetchUserData().catch((error) => {
        console.log("Error getting document:", error);
      });
    }
  }, [userUid]);

  const getActivityCount = async (userUid) => {
    const q = query(collection(firestore, "activities"), where("user.uid", "==", userUid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  };

  const getGroupCount = async (userUid) => {
    const q = query(collection(firestore, "groups"), where("members", "array-contains", userUid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  };

  const getForumCount = async (userUid) => {
    const q = query(collection(firestore, "forums"), where("user.uid", "==", userUid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  };

  const fetchPetPhotos = async (userUid) => {
    const q = query(collection(firestore, "petPhotos"), where("userUid", "==", userUid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const toggleModal = () => {
    setState(prevState => ({ ...prevState, modal: !prevState.modal }));
  };

  const toggleUploadModal = () => {
    setState(prevState => ({ ...prevState, uploadModal: !prevState.uploadModal }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(prevState => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, `profilePictures/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setState(prevState => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        profilePicture: url,
      },
    }));
  };

  const handlePetImageChange = (e) => {
    const file = e.target.files[0];
    setState(prevState => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        petPhotoFile: file,
      },
    }));
  };

  const handlePetAddition = async () => {
    const { petPhotoFile, petName, photoDescription } = state.formData;
    if (petPhotoFile) {
      const storageRef = ref(getStorage(), `petPhotos/${petPhotoFile.name}`);
      await uploadBytes(storageRef, petPhotoFile);
      const url = await getDownloadURL(storageRef);

      const newPhoto = {
        userUid: userUid,
        url,
        petName,
        description: photoDescription
      };

      const newPhotoRef = doc(collection(firestore, "petPhotos"));
      await setDoc(newPhotoRef, newPhoto);

      setState(prevState => ({
        ...prevState,
        petPhotos: [...prevState.petPhotos, { id: newPhotoRef.id, ...newPhoto }],
        formData: {
          ...prevState.formData,
          petName: "",
          photoDescription: "",
          petPhotoFile: null
        }
      }));
      toggleUploadModal();
    }
  };

  const handlePetDeletion = async (photoId, photoUrl) => {
    // Delete from Firestore
    await deleteDoc(doc(firestore, "petPhotos", photoId));

    // Delete from Storage
    const storageRef = ref(getStorage(), photoUrl);
    await deleteObject(storageRef);

    // Update state
    setState(prevState => ({
      ...prevState,
      petPhotos: prevState.petPhotos.filter(photo => photo.id !== photoId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userDoc = doc(firestore, "users", userUid);

    const { oldPassword, password, confirmPassword, firstName, lastName, email, profilePicture } = state.formData;

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
    toggleModal();
    setState(prevState => ({
      ...prevState,
      firstName: firstName,
      lastName: lastName,
      email: email,
      profilePicture: profilePicture,
      formData: {
        ...prevState.formData,
        oldPassword: "",
        password: "",
        confirmPassword: "",
      }
    }));
  };

  const { firstName, lastName, email, profilePicture, activityCount, groupCount, forumCount, petPhotos, modal, uploadModal, formData } = state;

  return (
    <>
      <Navbar />
      <main className="profile-page" ref={mainRef}>
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
                          src={profilePicture || DEFAULT_PROFILE_PICTURE_URL}
                          style={{ width: "165px", height: "165px", borderRadius: "50%" }}
                        />
                      </a>
                    </div>
                  </Col>
                  <Col
                    className="order-lg-3 text-lg-right align-self-lg-center"
                    lg="4"
                  >
                    <div className="card-profile-actions d-flex justify-content-end">
                      {localStorage.getItem('userUid') === userUid && (
                        <Button
                          color="primary"
                          size="sm"
                          onClick={toggleModal}
                        >
                          Uredi profil
                        </Button>
                      )}
                    </div>
                  </Col>
                  <Col className="order-lg-1" lg="4">
                    <div className="card-profile-stats d-flex justify-content-center">
                      <div>
                        <span className="heading">{activityCount}</span>
                        <span className="description">Aktivnosti</span>
                      </div>
                      <div>
                        <span className="heading">{groupCount}</span>
                        <span className="description">Skupine</span>
                      </div>
                      <div>
                        <span className="heading">{forumCount}</span>
                        <span className="description">Forumi</span>
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
                </div>
                <div className="mt-5 py-5 border-top text-center">
                  <Row className="justify-content-center">
                    <Col lg="12">
                      <h3 className="text-center display-3 mb-0">Moji hišni ljubljenčki</h3>
                      <br />
                      <div className="d-flex flex-column align-items-start">
                        {petPhotos.map((photo, index) => (
                          <div key={index} className="d-flex align-items-start mb-3">
                            <img src={photo.url} alt="Pet" style={{ width: "100%", height: "200px", marginRight: "10px" }} />
                            <div>
                              <h5>{photo.petName}</h5>
                              <p>{photo.description}</p>
                              {localStorage.getItem('userUid') === userUid && (
                                <Button color="danger" size="sm" onClick={() => handlePetDeletion(photo.id, photo.url)}>Izbriši</Button>
                              )}
                            </div>
                          </div>
                        ))}
                        {localStorage.getItem('userUid') === userUid && (
                          <Button color="primary" onClick={() => setState(prevState => ({ ...prevState, uploadModal: true }))}>Dodaj hišnega ljubljenčka</Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Modal isOpen={uploadModal} toggle={toggleUploadModal}>
                    <ModalHeader toggle={toggleUploadModal}>Dodaj hišnega ljubljenčka</ModalHeader>
                    <ModalBody>
                      <FormGroup>
                        <Label for="petName">Ime</Label>
                        <Input type="text" name="petName" id="petName" value={formData.petName} onChange={handleChange} />
                      </FormGroup>
                      <FormGroup>
                        <Label for="photoDescription">Opis</Label>
                        <Input type="text" name="photoDescription" id="photoDescription" value={formData.photoDescription} onChange={handleChange} />
                      </FormGroup>
                      <Input type="file" onChange={handlePetImageChange} />
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" onClick={handlePetAddition}>Dodaj</Button>
                      <Button color="secondary" onClick={toggleUploadModal}>Prekliči</Button>
                    </ModalFooter>
                  </Modal>
                </div>
              </div>
            </Card>
          </Container>
        </section>
        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Uredi profil</ModalHeader>
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <FormGroup>
                <Label for="firstName">Ime</Label>
                <Input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <Label for="lastName">Priimek</Label>
                <Input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <Label for="profilePicture">Profilna slika</Label>
                <Input type="file" name="profilePicture" id="profilePicture" onChange={handleImageChange} />
                {formData.profilePicture && <img src={formData.profilePicture} alt="Profile" style={{ width: "100px", height: "100px" }} />}
              </FormGroup>
              <FormGroup>
                <Label for="oldPassword">Staro geslo</Label>
                <Input type="password" name="oldPassword" id="oldPassword" value={formData.oldPassword} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="password">Novo geslo</Label>
                <Input type="password" name="password" id="password" value={formData.password} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="confirmPassword">Potrdi novo geslo</Label>
                <Input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" color="primary">Shrani</Button>{' '}
              <Button color="secondary" onClick={toggleModal}>Prekliči</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </main>
      <SimpleFooter />
    </>
  );
};

export default Profile;
