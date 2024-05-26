import React, { useState, useEffect } from 'react';
import Navbar from "components/Navbars/Navbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import { firestore, auth } from 'components/Firebase/Firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { FaStar } from 'react-icons/fa';

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewEntry = {
      ...newReview,
      userUID: currentUser.uid,
      timestamp: new Date().toLocaleString(),
    };

    try {
      const docRef = await addDoc(collection(firestore, 'productReviews'), reviewEntry);
      const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      setProducts([...products, { ...reviewEntry, id: docRef.id, userEmail: userData.email }]);
      setNewReview({ category: '', productName: '', description: '', rating: 0, imageData: '' });
    } catch (error) {
      console.error('Error adding document: ', error);
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

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

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
          <form onSubmit={handleSubmit}>
            <h2>Priporočila izdelkov za vašega ljubljenčka</h2>
            <div className="form-group">
              <label>Kategorija:</label>
              <select
                className="form-control"
                name="category"
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
              </select>
            </div>
            <div className="form-group">
              <label>Naziv izdelka:</label>
              <input
                type="text"
                className="form-control"
                name="productName"
                value={newReview.productName}
                onChange={(e) => setNewReview({ ...newReview, productName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Opis izdelka:</label>
              <textarea
                className="form-control"
                name="description"
                value={newReview.description}
                onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Ocena:</label>
              <div>
                {[...Array(5)].map((star, index) => {
                  const ratingValue = index + 1;
                  return (
                    <label key={index}>
                      <input
                        type="radio"
                        name="rating"
                        value={ratingValue}
                        onClick={() => setNewReview({ ...newReview, rating: ratingValue })}
                        required
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
            </div>
            <div className="form-group">
              <label>Slika izdelka:</label>
              <input
                type="file"
                className="form-control-file"
                name="image"
                onChange={handleImageChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Dodaj oceno
            </button>
          </form>
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
          {filteredProducts.map((product, index) => (
            <div key={index} className="card mb-3">
              <div className="card-header">
                <strong>Izdelek:</strong> {product.productName}
                {currentUser && currentUser.uid === product.userUID && (
                  <button
                    className="btn btn-danger btn-sm float-right ml-2"
                    onClick={() => handleDelete(product.id)}
                  >
                    Odstrani
                  </button>
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
                <p><strong>Objavil:</strong> {product.userEmail}</p>

              </div>
            </div>
          ))}
        </div>
      </div>
      <SimpleFooter />
    </>
  );
};

export default Izdelki;
