import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

function CheckoutPage() {
  const navigate = useNavigate(); // Navigare la finalizare
  const [cart, setCart] = useState([]); // Produsele din coș
  const [total, setTotal] = useState(0); // Totalul comenzii
  const [formData, setFormData] = useState({
    adresa_livrare: '',
    numar_telefon: '',
  });

  // Preia produsele din localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);

    // Calculează totalul
    const totalPrice = storedCart.reduce((acc, item) => acc + item.pret * item.quantity, 0);
    setTotal(totalPrice);
  }, []);

  // Actualizează datele introduse
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Trimite comanda
  const handlePlaceOrder = async () => {
    const userId = localStorage.getItem('userId'); // Obține ID-ul utilizatorului
    if (!userId) {
      alert('Trebuie să te autentifici pentru a plasa comanda!');
      navigate('/login'); // Redirecționează către login dacă utilizatorul nu este autentificat
      return;
    }

    if (!formData.adresa_livrare || !formData.numar_telefon) {
      alert('Completează toate câmpurile!');
      return;
    }

    const orderData = {
      utilizator_id: userId,
      adresa_livrare: formData.adresa_livrare,
      produse: cart.map((item) => ({
        produs_id: item.produs_id,
        cantitate: item.quantity,
        pret: item.pret,
      })),
    };

    try {
      const response = await fetch('http://localhost:5500/com/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Comanda a fost plasată cu succes!');
        localStorage.removeItem('cart'); // Golește coșul
        navigate('/'); // Redirecționează către pagina principală
      } else {
        alert(data.error || 'Eroare la plasarea comenzii!');
      }
    } catch (error) {
      console.error('Eroare:', error);
      alert('Eroare la conexiune. Încearcă din nou!');
    }
  };

  return (
    <div className="checkout-page">
      <h1>Finalizează Comanda</h1>

      {/* Afișare produse din coș */}
      <div className="checkout-items">
        {cart.map((item) => (
          <div key={item.produs_id} className="checkout-item">
            <img
              src={`http://localhost:5500/imagini/${item.nume_produs.replace(/ /g, '_')}/1.jpg`}
              alt={item.nume_produs}
              className="checkout-image"
            />
            <div className="checkout-details">
              <h3>{item.nume_produs}</h3>
              <p>{item.pret} Lei x {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Total: {total} Lei</h2>

      {/* Formular date livrare */}
      <div className="checkout-form">
        <label>Adresă Livrare:</label>
        <input
          type="text"
          name="adresa_livrare"
          value={formData.adresa_livrare}
          onChange={handleChange}
          required
        />

        <label>Număr de Telefon:</label>
        <input
          type="text"
          name="numar_telefon"
          value={formData.numar_telefon}
          onChange={handleChange}
          required
        />
      </div>

      <button className="place-order-button" onClick={handlePlaceOrder}>
        Plasează Comanda
      </button>
    </div>
  );
}

export default CheckoutPage;