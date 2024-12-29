import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ProductGrid.css';

function ProductGrid() {
  const [products, setProducts] = useState([]); // Lista de produse
  const [filteredProducts, setFilteredProducts] = useState([]); // Produse filtrate
  const [searchParams] = useSearchParams(); // Parametri URL
  const navigate = useNavigate();

  // Fetch products din backend
  useEffect(() => {
    fetch('http://localhost:5500/prod') // Endpoint corect
      .then((response) => response.json())
      .then((data) => {
        setProducts(data); // Setăm lista de produse
      })
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  // Filtrare în funcție de categorie_id
  useEffect(() => {
    const categorie = searchParams.get('categorie'); // Obține categoria din URL
    let filtered = products;

    if (categorie === 'Telefoane') {
      filtered = products.filter((product) => product.categorie_id === 1); // ID pentru Telefoane
    } else if (categorie === 'Tablete') {
      filtered = products.filter((product) => product.categorie_id === 2); // ID pentru Tablete
    }

    setFilteredProducts(filtered);
  }, [products, searchParams]); // Actualizează filtrul când se schimbă produsele sau URL-ul

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigare la pagina detaliilor produsului
  };

  return (
    <div className="product-grid">
      {filteredProducts.map((product) => (
        <div
          key={product.produs_id}
          className="product-card"
          onClick={() => handleProductClick(product.produs_id)}
        >
          <img
            src={`http://localhost:5500/imagini/${product.nume_produs.replace(/ /g, '_')}/1.jpg`}
            alt={product.nume_produs || 'default.jpg'}
            className="product-image"
            onError={(e) => (e.target.src = 'http://localhost:5500/imagini/default.jpg')}
          />
          <h3 className="product-name">{product.nume_produs}</h3>
          <p className="product-price">{product.pret} Lei</p>
          <button className="product-button">Adaugă în coș</button>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;