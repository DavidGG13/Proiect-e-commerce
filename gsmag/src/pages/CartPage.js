import React, { useState, useEffect } from 'react';
import './CartPage.css';
import { useNavigate } from 'react-router-dom'; // Importă useNavigate

function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate(); // Inițializează hook-ul de navigare în interiorul funcției

  // Preluare coș din localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  // Actualizare cantitate produs
  const updateQuantity = async (id, quantity) => {
  if (quantity < 1) return alert('Cantitatea nu poate fi mai mică de 1!');

  // Cerere către backend pentru a verifica stocul disponibil
  try {
    const response = await fetch(`http://localhost:5500/prod/${id}`); // Endpoint-ul produsului
    const product = await response.json();

    // Verifică dacă cantitatea dorită depășește stocul disponibil
    if (quantity > product.cantitate_stoc) {
      alert(`Stoc insuficient! Doar ${product.cantitate_stoc} produse disponibile.`);
      return; // Oprește modificarea cantității
    }

    // Actualizează cantitatea dacă există stoc suficient
    const updatedCart = cart.map((item) =>
      item.produs_id === id ? { ...item, quantity: Number(quantity) } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  } catch (error) {
    console.error('Eroare la verificarea stocului:', error);
    alert('Eroare la verificarea stocului. Încearcă din nou!');
  }
};

  // Șterge produs din coș
  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.produs_id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Calculează totalul
  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.pret * item.quantity, 0).toFixed(2);
  };

  // Navigare către checkout doar dacă există produse în coș
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Coșul este gol! Adaugă produse înainte de a finaliza comanda.'); // Afișează un mesaj
      return;
    }
    navigate('/checkout'); // Navighează către pagina de checkout
  };

  return (
    <div className="cart-page">
      <h1>Coșul Meu</h1>
      {cart.length === 0 ? (
        <p>Coșul este gol!</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.produs_id} className="cart-item">
              {/* Imagine Produs */}
              <img
                src={`http://localhost:5500/imagini/${item.nume_produs.replace(/ /g, '_')}/1.jpg`}
                alt={item.nume_produs || 'default.jpg'}
                className="cart-image"
                onError={(e) => (e.target.src = 'http://localhost:5500/imagini/default.jpg')}
              />
              <div className="cart-details">
                <h3>{item.nume_produs}</h3>
                <p>Preț: {item.pret} Lei</p>
                <div className="cart-quantity">
                  <label>Cantitate:</label>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => updateQuantity(item.produs_id, e.target.value)}
                  />
                </div>
                <button onClick={() => removeFromCart(item.produs_id)}>Șterge</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <h2>Total: {calculateTotal()} Lei</h2>
      <button className="checkout-button" onClick={handleCheckout}>
        Finalizează Comanda
      </button>
    </div>
  );
}

export default CartPage;