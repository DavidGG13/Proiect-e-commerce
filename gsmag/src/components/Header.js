import React, { useState } from 'react';
import './Header.css';

function Header() {
  const [showModal, setShowModal] = useState(null); // 'login' sau 'signup'
  const [formData, setFormData] = useState({
    nume: '',
    email: '',
    parola: '',
    confirmPassword: '',
    adresa: '',
    numar_telefon: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Funcție pentru Sign Up
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (formData.parola !== formData.confirmPassword) {
      alert('Parolele nu se potrivesc!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nume: formData.nume,
          email: formData.email,
          parola: formData.parola,
          adresa: formData.adresa,
          numar_telefon: formData.numar_telefon,
        }),
      });

      const data = await response.json();
      alert(data.message || data.error); // Mesaj de succes sau eroare
      if (response.ok) setShowModal(null); // Închide modalul
    } catch (error) {
      alert('A apărut o eroare. Încearcă din nou!');
    }
  };

  // Funcție pentru Login
 const handleLoginSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:5500/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        parola: formData.parola,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token); // Salvăm token-ul în localStorage
      alert('Autentificare reușită!');
      setShowModal(null);
    } else {
      alert(data.error);
    }
  } catch (error) {
    alert('A apărut o eroare. Încearcă din nou!');
  }
};

  return (
    <>
      {/* Bara de căutare */}
      <div className="search-bar-container">
        <input type="text" placeholder="Caută produse..." className="search-input" />
        <button className="search-button">Caută</button>
        <button className="login-button" onClick={() => setShowModal('login')}>Login</button>
        <button className="signup-button" onClick={() => setShowModal('signup')}>Sign Up</button>
      </div>

      {/* Modal pentru Login */}
      {showModal === 'login' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowModal(null)}>&times;</span>
            <h2>Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <label>Email:</label>
              <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />
              <label>Parolă:</label>
              <input type="password" name="parola" placeholder="Parolă" onChange={handleInputChange} required />
              <button type="submit">Autentificare</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal pentru Sign Up */}
      {showModal === 'signup' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowModal(null)}>&times;</span>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignupSubmit}>
              <label>Nume:</label>
              <input type="text" name="nume" placeholder="Nume" onChange={handleInputChange} required />
              <label>Email:</label>
              <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />
              <label>Parolă:</label>
              <input type="password" name="parola" placeholder="Parolă" onChange={handleInputChange} required />
              <label>Confirmă Parola:</label>
              <input type="password" name="confirmPassword" placeholder="Confirmă Parola" onChange={handleInputChange} required />
              <label>Adresă:</label>
              <input type="text" name="adresa" placeholder="Adresă" onChange={handleInputChange} required />
              <label>Număr Telefon:</label>
              <input type="text" name="numar_telefon" placeholder="Telefon" onChange={handleInputChange} required />
              <button type="submit">Înregistrează-te</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;