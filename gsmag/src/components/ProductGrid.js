import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ProductGrid.css';

function ProductGrid({ filters }) {
  const [products, setProducts] = useState([]); // Toate produsele
  const [filteredProducts, setFilteredProducts] = useState([]); // Produse filtrate
  const [searchQuery, setSearchQuery] = useState(''); // Query pentru căutare
  const [searchParams] = useSearchParams(); // Parametrii din URL
  const navigate = useNavigate();

  // Fetch produse din backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5500/prod'); // Endpoint pentru produse
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data); // Setăm toate produsele
          setFilteredProducts(data); // Inițial, toate produsele sunt filtrate
        } else {
          console.error('Datele primite nu sunt un array:', data);
        }
      } catch (error) {
        console.error('Eroare la fetch:', error);
      }
    };

    fetchProducts();
  }, []);

  // Aplicare filtre, căutare și categorii
  useEffect(() => {
    let filtered = [...products];

    // Filtrare după categorie din URL
    const categorie = searchParams.get('categorie');
    if (categorie) {
      filtered = filtered.filter((product) => {
        const categoryId = parseInt(categorie === 'Telefoane' ? 1 : categorie === 'Tablete' ? 2 : 0, 10);
        return product.categorie_id === categoryId;
      });
    }

    // Filtrare după query de căutare
    if (searchQuery.trim()) {
  filtered = filtered.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.nume_produs.toLowerCase().includes(query) || // Caută în numele produsului
      product.descriere?.toLowerCase().includes(query) || // Caută în descriere
      product.marca?.toLowerCase().includes(query)        // Caută în marcă
    );
  });
}

    // Filtrare după filtre suplimentare
    if (filters) {
      filtered = filtered.filter((product) => {
        const isWithinPrice =
          (!filters.minPrice || product.pret >= Number(filters.minPrice)) &&
          (!filters.maxPrice || product.pret <= Number(filters.maxPrice));
        const isBrandSelected =
          !filters.brand || product.marca.toLowerCase() === filters.brand.toLowerCase();
        const isInStock = !filters.stock || product.cantitate_stoc > 0;

        return isWithinPrice && isBrandSelected && isInStock;
      });
    }

    setFilteredProducts(filtered); // Actualizăm lista filtrată
  }, [products, searchParams, filters, searchQuery]); // Dependențe

  // Funcție pentru adăugarea în coș
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find((item) => item.produs_id === product.produs_id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.nume_produs} adăugat în coș!`);
  };

  // Navigare la detaliile produsului
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="product-grid-container">
      {/* SearchBar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Caută produse..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Grid de produse */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.produs_id} className="product-card">
              <img
                src={`http://localhost:5500/imagini/${product.nume_produs.replace(/ /g, '_')}/1.jpg`}
                alt={product.nume_produs || 'default.jpg'}
                className="product-image"
                onError={(e) => (e.target.src = 'http://localhost:5500/imagini/default.jpg')}
                onClick={() => handleProductClick(product.produs_id)}
              />
              <h3 className="product-name">{product.nume_produs}</h3>
              <p className="product-price">{product.pret} Lei</p>
              <button className="product-button" onClick={() => addToCart(product)}>
                Adaugă în coș
              </button>
            </div>
          ))
        ) : (
          <p className="no-products">Niciun produs găsit!</p>
        )}
      </div>
    </div>
  );
}

export default ProductGrid;