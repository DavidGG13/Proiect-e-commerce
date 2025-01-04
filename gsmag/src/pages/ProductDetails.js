import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetails.css';

function ProductDetails() {
  const { productId } = useParams(); // Obține ID-ul produsului din URL
  const [product, setProduct] = useState(null); // Detaliile produsului
  const [loading, setLoading] = useState(true); // Starea de încărcare
  const [error, setError] = useState(null); // Erorile
  const [cart, setCart] = useState([]); // Coșul local
  const [reviews, setReviews] = useState([]); // Recenzii
  const [newReview, setNewReview] = useState(''); // Recenzie nouă
  const [rating, setRating] = useState(0); // Rating nou
  const [hover, setHover] = useState(0); // Hover pentru stele

  // Fetch detaliile produsului
  useEffect(() => {
  // Fetch detalii produs cu JOIN
  fetch(`http://localhost:5500/prod/${productId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Produsul nu a fost găsit.');
      }
      return response.json();
    })
    .then((data) => {
      setProduct(data); // Include specificațiile tehnice
      setLoading(false);
    })
    .catch((error) => {
      setError(error.message);
      setLoading(false);
    });

  // Fetch recenzii cu JOIN
  fetch(`http://localhost:5500/prod/recenzii/${productId}`)
    .then((response) => response.json())
    .then((data) => setReviews(data))
    .catch((error) => console.error('Eroare la fetch recenzii:', error));
}, [productId]);

   

  // Funcție pentru adăugarea produsului în coș
  const handleAddToCart = () => {
  // Preluăm coșul existent din localStorage
  const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

  // Verificăm dacă produsul există deja în coș
  const existingProduct = currentCart.find((item) => item.produs_id === product.produs_id);

  if (existingProduct) {
    // Dacă produsul există, creștem cantitatea
    existingProduct.quantity += 1;
  } else {
    // Dacă produsul nu există, îl adăugăm cu cantitate 1
    const newProduct = { ...product, quantity: 1 };
    currentCart.push(newProduct);
  }

  // Actualizăm coșul în localStorage
  localStorage.setItem('cart', JSON.stringify(currentCart));

  // Actualizăm starea locală pentru coș
  setCart(currentCart);

  alert('Produs adăugat în coș!');
};

  // Funcție pentru adăugarea unei recenzii
 const handleAddReview = () => {
  // Obține ID-ul utilizatorului din localStorage
  const userId = localStorage.getItem('userId'); // ID utilizator

  // Verifică dacă utilizatorul este autentificat
  if (!userId) {
    alert('Te rog să te autentifici pentru a adăuga o recenzie!');
    return;
  }

  if (!newReview.trim() || rating === 0) {
    alert('Te rog completează recenzia și alege un rating!');
    return;
  }

  fetch(`http://localhost:5500/rec/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      produs_id: productId,
      utilizator_id: userId, // Trimite ID-ul utilizatorului conectat
      rating: rating,
      comentariu: newReview,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Eroare la salvarea recenziei!');
      }
      return response.json();
    })
    .then((data) => {
      setReviews([data, ...reviews]); // Actualizează lista recenziilor
      setNewReview('');
      setRating(0);
      alert('Recenzie adăugată cu succes!');
    })
    .catch((error) => {
      console.error('Eroare adăugare recenzie:', error);
      alert('A apărut o eroare!');
    });
};
  if (loading) {
    return <div className="loading">Se încarcă...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-details">
      <img
        src={`http://localhost:5500/imagini/${product.nume_produs.replace(/ /g, '_')}/1.jpg`}
        alt={product.nume_produs}
        className="product-image"
      />
      <h1 className="product-title">{product.nume_produs}</h1>
      <p className="product-description">{product.descriere}</p>
      <p className="product-price">Preț: {product.pret} Lei</p>

      <h3>Specificații Tehnice</h3>
<ul>
  <li>Procesor: {product.procesor || 'N/A'}</li>
  <li>RAM: {product.ram || 'N/A'} GB</li>
  <li>Stocare: {product.rom || 'N/A'} GB</li>
  <li>Baterie: {product.capacitate_baterie || 'N/A'} mAh</li>
  <li>Sistem de operare: {product.sistem_operare || 'N/A'}</li>
</ul>

<h3>Display</h3>
<ul>
  <li>Dimensiune ecran: {product.dimensiune_ecran || 'N/A'} inch</li>
  <li>Rezoluție: {product.rezolutie || 'N/A'}</li>
  <li>Tip panou: {product.tip_panou || 'N/A'}</li>
  <li>Rată de refresh: {product.rata_refresh || 'N/A'} Hz</li>
</ul>

<h3>Camera</h3>
<ul>
  <li>Camera principală: {product.camera_principala || 'N/A'} MP</li>
  <li>Camera frontală: {product.camera_frontala || 'N/A'} MP</li>
  <li>Rezoluție video: {product.rezolutie_video || 'N/A'}</li>
</ul>
      <button className="add-to-cart-button" onClick={handleAddToCart}>
        Adaugă în coș
      </button>

      {/* Secțiune Recenzii */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h3>Recenzii</h3>
          <button className="add-review-button" onClick={handleAddReview}>
            Adaugă recenzie
          </button>
        </div>

        <div className="star-rating">
          {[...Array(5)].map((star, index) => {
            const currentRating = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={currentRating}
                  onClick={() => setRating(currentRating)}
                />
                <span
                  className={`star ${currentRating <= (hover || rating) ? 'filled' : ''}`}
                  onMouseEnter={() => setHover(currentRating)}
                  onMouseLeave={() => setHover(0)}
                >
                  ★
                </span>
              </label>
            );
          })}
        </div>

        <textarea
          className="review-input"
          placeholder="Scrie o recenzie..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        />
        {reviews.length > 0 ? (
  <ul className="reviews-list">
  {reviews.map((review) => (
    <li key={review.recenzie_id} className="review-item">
      <p><strong>{review.utilizator}</strong></p> {/* Nume utilizator */}
      <p>⭐ {review.rating}/5</p> {/* Rating */}
      <p>{review.comentariu}</p> {/* Comentariu */}
      <p className="review-date">
        {new Date(review.data_recenzie).toLocaleDateString()} {/* Data */}
      </p>
    </li>
  ))}
</ul>
) : (
  <p>Nu există recenzii pentru acest produs.</p>
)}
      </div>
    </div>
  );
}

export default ProductDetails;