import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PopularProducts.css'; // Stilurile pentru componente

const PopularProducts = () => {
  const [popularProducts, setPopularProducts] = useState([]); // Starea produselor populare
  const navigate = useNavigate(); // Navigare către pagina detaliată a produsului

  // Fetch pentru produse populare
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5500/prod/populare'); // Endpoint pentru produsele populare
        setPopularProducts(response.data); // Actualizăm state-ul cu datele primite
      } catch (err) {
        console.error('Eroare la încărcarea produselor populare:', err);
      }
    };

    fetchPopularProducts(); // Apelăm funcția la montare
  }, []);

  // Navigare către pagina detaliată a produsului
  const handleProductClick = (id) => {
    navigate(`/product/${id}`); // Redirecționează către pagina de detalii a produsului
  };

  return (
    <div className="popular-products-container">
      <h2>Produse Populare</h2>
      <div className="popular-products-grid">
        {popularProducts.map((product) => (
          <div
            key={product.produs_id}
            className="popular-product-card"
            onClick={() => handleProductClick(product.produs_id)}
          >
            <img
            src={`http://localhost:5500/imagini/${product.nume_produs.replace(/ /g, '_')}/1.jpg`}
            alt={product.nume_produs || 'default.jpg'}
            className="product-image"
            onError={(e) => (e.target.src = 'http://localhost:5500/imagini/default.jpg')} // Fallback pentru imagine lipsă
            onClick={() => handleProductClick(product.produs_id)}
            />
            <h3>{product.nume_produs}</h3>
            <p>{product.descriere}</p>
            <span>Preț: {product.pret} Lei</span>
            <span>Rating: {Number(product.rating_mediu).toFixed(1)} ★</span>
            <span>Recenzii: {product.numar_recenzii}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;