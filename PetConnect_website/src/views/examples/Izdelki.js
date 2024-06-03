import React, { useState, useEffect } from 'react';
import Navbar from "components/Navbars/Navbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import { firestore, auth } from 'components/Firebase/Firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { FaStar, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';


const categories = [
  { id: 'food', name: 'Hrana' },
  { id: 'toys', name: 'Igrače' },
  { id: 'accessories', name: 'Pripomočki' },
  { id: 'care', name: 'Izdelki za nego' }
];

const Izdelki = () => {
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newReview, setNewReview] = useState({
    category: '',
    productName: '',
    description: '',
    rating: 0,
    imageData: ''
  });
  const [hover, setHover] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [userLikedReviews, setUserLikedReviews] = useState([]);
  const [userDislikedReviews, setUserDislikedReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'productReviews'));
        const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch user data for each review
        const reviewsWithUserData = await Promise.all(
          reviews.map(async (review) => {
            const userDoc = await getDoc(doc(firestore, 'users', review.userUID));
            const userData = userDoc.exists() ? userDoc.data() : {};
            return { ...review, userEmail: userData.email };
          })
        );

        setProducts(reviewsWithUserData);
      } catch (error) {
        console.error('Error fetching documents: ', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserLikedReviews = async () => {
      if (currentUser) {
        try {
          const querySnapshot = await getDocs(collection(firestore, 'users', currentUser.uid, 'userLikes'));
          const likedReviews = querySnapshot.docs.map(doc => doc.id);
          setUserLikedReviews(likedReviews);
        } catch (error) {
          console.error('Error fetching liked reviews: ', error);
        }
      }
    };

    const fetchUserDislikedReviews = async () => {
      if (currentUser) {
        try {
          const querySnapshot = await getDocs(collection(firestore, 'users', currentUser.uid, 'userDislikes'));
          const dislikedReviews = querySnapshot.docs.map(doc => doc.id);
          setUserDislikedReviews(dislikedReviews);
        } catch (error) {
          console.error('Error fetching disliked reviews: ', error);
        }
      }
    };

    fetchUserLikedReviews();
    fetchUserDislikedReviews();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewEntry = {
      ...newReview,
      userUID: currentUser.uid,
      timestamp: new Date().toLocaleString(),
      likes: 0,
      dislikes: 0
    };

    try {
      if (editingReviewId) {
        await updateDoc(doc(firestore, 'productReviews', editingReviewId), reviewEntry);
        setProducts(products.map(product => product.id === editingReviewId ? { ...reviewEntry, id: editingReviewId, userEmail: product.userEmail } : product));
        setEditingReviewId(null);
      } else {
        const docRef = await addDoc(collection(firestore, 'productReviews'), reviewEntry);
        const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};

        setProducts([...products, { ...reviewEntry, id: docRef.id, userEmail: userData.email }]);
      }

      setNewReview({ category: '', productName: '', description: '', rating: 0, imageData: '' });
      setShowModal(false); // Close modal after submission
    } catch (error) {
      console.error('Error adding/updating document: ', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'productReviews', id));
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const handleEdit = (product) => {
    setNewReview({
      category: product.category,
      productName: product.productName,
      description: product.description,
      rating: product.rating,
      imageData: product.imageData
    });
    setEditingReviewId(product.id);
    setShowModal(true); // Show modal when editing
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewReview({ ...newReview, imageData: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleLike = async (id) => {
    try {
      if (!userLikedReviews.includes(id) && !userDislikedReviews.includes(id) && products.find(product => product.id === id)?.userUID !== currentUser.uid) {
        const productRef = doc(firestore, 'productReviews', id);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          const productData = productDoc.data();
          await updateDoc(productRef, { likes: (productData.likes || 0) + 1 });
          setProducts(products.map(product => product.id === id ? { ...product, likes: (product.likes || 0) + 1 } : product));
          await addDoc(collection(firestore, 'users', currentUser.uid, 'userLikes'), { reviewId: id });
          setUserLikedReviews([...userLikedReviews, id]);
        }
      } else if (userLikedReviews.includes(id)) {
        const productRef = doc(firestore, 'productReviews', id);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          const productData = productDoc.data();
          await updateDoc(productRef, { likes: (productData.likes || 0) - 1 });
          setProducts(products.map(product => product.id === id ? { ...product, likes: (product.likes || 0) - 1 } : product));
          const likeDocRef = doc(firestore, 'users', currentUser.uid, 'userLikes', id);
          await deleteDoc(likeDocRef);
          setUserLikedReviews(userLikedReviews.filter(reviewId => reviewId !== id));
        }
      }
    } catch (error) {
      console.error('Error liking document: ', error);
    }
  };
  
  const handleDislike = async (id) => {
    try {
      if (!userLikedReviews.includes(id) && !userDislikedReviews.includes(id) && products.find(product => product.id === id)?.userUID !== currentUser.uid) {
        const productRef = doc(firestore, 'productReviews', id);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          const productData = productDoc.data();
          await updateDoc(productRef, { dislikes: (productData.dislikes || 0) + 1 });
          setProducts(products.map(product => product.id === id ? { ...product, dislikes: (product.dislikes || 0) + 1 } : product));
          await addDoc(collection(firestore, 'users', currentUser.uid, 'userDislikes'), { reviewId: id });
          setUserDislikedReviews([...userDislikedReviews, id]);
        }
      } else if (userDislikedReviews.includes(id)) {
        const productRef = doc(firestore, 'productReviews', id);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          const productData = productDoc.data();
          await updateDoc(productRef, { dislikes: (productData.dislikes || 0) - 1 });
          setProducts(products.map(product => product.id === id ? { ...product, dislikes: (product.dislikes || 0) - 1 } : product));
          const dislikeDocRef = doc(firestore, 'users', currentUser.uid, 'userDislikes', id);
          await deleteDoc(dislikeDocRef);
          setUserDislikedReviews(userDislikedReviews.filter(reviewId => reviewId !== id));
        }
      }
    } catch (error) {
      console.error('Error disliking document: ', error);
    }
  };

  const filteredProducts = selectedCategory ? products.filter(product => product.category === selectedCategory) : products;

  return (
    <>
      <Navbar />
      <section className="section section-shaped section-lg">
        <div className="shape shape-style-1 shape-default alpha-4">
          <span />
        </div>
      </section>
      <div className="container mt-5">
        {currentUser && (
          <div>
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              Dodaj oceno
            </button>
          </div>
        )}
        <div className="mt-5">
          <h3>Ocene in priporočila</h3>
          <div className="form-group">
            <label>Filtriraj po kategoriji:</label>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Vse kategorije</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {filteredProducts.length === 0 ? (
            <p>Ni podanih ocen za to kategorijo</p>
          ) : (
            filteredProducts.map((product, index) => (
              <div key={index} className="card mb-3">
                <div className="card-header">
                  <strong>Izdelek:</strong> {product.productName}
                  {currentUser && currentUser.uid === product.userUID && (
                    <>
                      <button
                        className="btn btn-warning btn-sm float-right ml-2"
                        onClick={() => handleEdit(product)}
                      >
                        Uredi
                      </button>
                      <button
                        className="btn btn-danger btn-sm float-right ml-2"
                        onClick={() => handleDelete(product.id)}
                      >
                        Odstrani
                      </button>
                    </>
                  )}
                </div>
                <div className="card-body">
                  <p><strong>Kategorija:</strong> {categories.find(category => category.id === product.category)?.name}</p>
                  <p><strong>Opis:</strong> {product.description}</p>
                  <p><strong>Ocena:</strong> 
                    {[...Array(5)].map((star, index) => {
                      const ratingValue = index + 1;
                      return (
                        <FaStar
                          key={index}
                          color={ratingValue <= product.rating ? "#ffc107" : "#e4e5e9"}
                          size={25}
                        />
                      );
                    })}
                  </p>
                  {product.imageData && (
                    <div>
                      <strong>Slika izdelka:</strong>
                      <br />
                      <img src={product.imageData} alt="Product" className="img-fluid" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                    </div>
                  )}
                  <br/>
                  <p><strong>Datum:</strong> {product.timestamp}</p>
                  <p><strong>Objavil:</strong> <Link to={`/profile-page/${product.userUID}`}>{product.userEmail}</Link></p>
                  <div className="mt-2">
                    <button
                      className={`btn btn-success btn-sm mr-2 ${!currentUser ? 'disabled' : userLikedReviews.includes(product.id) ? 'disabled' : ''}`}
                      onClick={() => currentUser ? handleLike(product.id) : alert("Samo za prijavljene uporabnike")}
                      disabled={!currentUser || userLikedReviews.includes(product.id)}
                    >
                      <FaThumbsUp /> {product.likes || 0}
                    </button>
                    <button
                      className={`btn btn-danger btn-sm ${!currentUser ? 'disabled' : userDislikedReviews.includes(product.id) ? 'disabled' : ''}`}
                      onClick={() => currentUser ? handleDislike(product.id) : alert("Samo za prijavljene uporabnike")}
                      disabled={!currentUser || userDislikedReviews.includes(product.id)}
                    >
                      <FaThumbsDown /> {product.dislikes || 0}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <SimpleFooter />
      <Modal isOpen={showModal} toggle={() => setShowModal(false)}>
        <ModalHeader toggle={() => setShowModal(false)}>
          {editingReviewId ? 'Uredi oceno' : 'Dodaj oceno'}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="category">Kategorija:</Label>
              <Input
                type="select"
                name="category"
                id="category"
                value={newReview.category}
                onChange={(e) => setNewReview({ ...newReview, category: e.target.value })}
                required
              >
                <option value="">Izberite kategorijo</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="productName">Naziv izdelka:</Label>
              <Input
                type="text"
                name="productName"
                id="productName"
                value={newReview.productName}
                onChange={(e) => setNewReview({ ...newReview, productName: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Opis izdelka:</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={newReview.description}
                onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Ocena:</Label>
              <div>
                {[...Array(5)].map((star, index) => {
                  const ratingValue = index + 1;
                  return (
                    <label key={index}>
                      <Input
                        type="radio"
                        name="rating"
                        value={ratingValue}
                        onClick={() => setNewReview({ ...newReview, rating: ratingValue })}
                        required
                        style={{ display: 'none' }}
                      />
                      <FaStar
                        className="star"
                        color={ratingValue <= (hover || newReview.rating) ? "#ffc107" : "#e4e5e9"}
                        size={25}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(newReview.rating)}
                      />
                    </label>
                  );
                })}
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="image">Slika izdelka:</Label>
              <Input
                type="file"
                name="image"
                id="image"
                onChange={handleImageChange}
              />
            </FormGroup>
            <ModalFooter>
              <Button color="primary" type="submit">
                {editingReviewId ? 'Shrani spremembe' : 'Dodaj oceno'}
              </Button>
              <Button color="secondary" onClick={() => setShowModal(false)}>
                Prekliči
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Izdelki;
