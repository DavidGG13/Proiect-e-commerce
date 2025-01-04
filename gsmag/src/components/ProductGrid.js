import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ProductGrid.css';

function ProductGrid({ filters }) { // Acceptă filtre ca prop
  const [products, setProducts] = useState([]); // Lista completă de produse
  const [filteredProducts, setFilteredProducts] = useState([]); // Produse filtrate
  const [searchParams] = useSearchParams(); // Parametrii URL
  const navigate = useNavigate();

  // Fetch produsele din backend
  useEffect(() => {
    fetch('http://localhost:5500/prod') // Endpoint backend
      .then((response) => response.json())
      .then((data) => {
        setProducts(data); // Salvează produsele inițiale
        setFilteredProducts(data); // Inițial, afișează toate produsele
      })
      .catch((error) => console.error('Eroare la fetch:', error));
  }, []);

  // Aplică filtrele (categorii și filtre suplimentare)
  useEffect(() => {
    let filtered = products;

    // Filtrare după categorie din URL
    const categorie = searchParams.get('categorie');
    if (categorie === 'Telefoane') {
      filtered = filtered.filter((product) => product.categorie_id === 1);
    } else if (categorie === 'Tablete') {
      filtered = filtered.filter((product) => product.categorie_id === 2);
    }

    // Aplică filtre suplimentare (preț, brand, stoc)
    if (filters) {
      filtered = filtered.filter((product) => {
        const isWithinPrice =
          (!filters.minPrice || product.pret >= Number(filters.minPrice)) &&
          (!filters.maxPrice || product.pret <= Number(filters.maxPrice));
        const isBrandSelected =
          !filters.brand || product.marca === filters.brand;
        const isInStock = !filters.stock || product.cantitate_stoc > 0;

        return isWithinPrice && isBrandSelected && isInStock;
      });
    }

    // Actualizează lista de produse filtrate
    setFilteredProducts(filtered);
  }, [products, searchParams, filters]); // Dependențe: produse, URL sau filtre

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
  );
}

export default ProductGrid;