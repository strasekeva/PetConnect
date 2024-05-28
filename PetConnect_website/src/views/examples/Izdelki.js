import React, { useState, useEffect } from 'react';
import Navbar from "components/Navbars/Navbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import { firestore, auth } from 'components/Firebase/Firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { FaStar, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

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
          const querySnapshot = await getDocs(collection(firestore, 'userLikes', currentUser.uid));
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
          const querySnapshot = await getDocs(collection(firestore, 'userDislikes', currentUser.uid));
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
          setUserLikedReviews([...userLikedReviews, id]);
        }
      } else if (userLikedReviews.includes(id)) {
        const productRef = doc(firestore, 'productReviews', id);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          const productData = productDoc.data();
          await updateDoc(productRef, { likes: (productData.likes || 0) - 1 });
          setProducts(products.map(product => product.id === id ? { ...product, likes: (product.likes || 0) - 1 } : product));
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
          setUserDislikedReviews([...userDislikedReviews, id]);
        }
      } else if (userDislikedReviews.includes(id)) {
        const productRef = doc(firestore, 'productReviews', id);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          const productData = productDoc.data();
          await updateDoc(productRef, { dislikes: (productData.dislikes || 0) - 1 });
          setProducts(products.map(product => product.id === id ? { ...product, dislikes: (product.dislikes || 0) - 1 } : product));
          setUserDislikedReviews(userDislikedReviews.filter(reviewId => reviewId !== id));
        }
      }
    } catch (error) {
      console.error('Error disliking document: ', error);
    }
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
              {/* Vaš obrazec za dodajanje ocen */}
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
    
            {/* Preveri, ali je seznam filtriranih izdelkov prazen */}
            {filteredProducts.length === 0 ? (
              <p>Ni podanih ocen za to kategorijo</p>
            ) : (
              // Izpiši izdelke v karticah
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
                    <p><strong>Objavil:</strong> {product.userEmail}</p>
                    <div className="mt-2">
                      <button
                        className={`btn btn-success btn-sm mr-2 ${userLikedReviews.includes(product.id) ? 'disabled' : ''}`}
                        onClick={() => handleLike(product.id)}
                        disabled={userLikedReviews.includes(product.id)}
                      >
                        <FaThumbsUp /> {product.likes || 0}
                      </button>
                      <button
                        className={`btn btn-danger btn-sm ${userDislikedReviews.includes(product.id) ? 'disabled' : ''}`}
                        onClick={() => handleDislike(product.id)}
                        disabled={userDislikedReviews.includes(product.id)}
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
      </>
    );
  }    

export default Izdelki;
