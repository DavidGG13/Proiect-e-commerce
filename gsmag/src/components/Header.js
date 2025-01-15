import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import './Header.css';
import SearchBar from './SearchBar'; // Import the SearchBar component
import { parseJwt } from '../utils/auth';
function Header() {
  const navigate = useNavigate(); // Hook pentru navigare
  const location = useLocation(); // Hook pentru a obține calea curentă
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Stocăm utilizatorul logat
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown pentru profil
  const [formData, setFormData] = useState({
    nume: '',
    email: '',
    parola: '',
    confirmPassword: '',
    adresa: '',
    numar_telefon: '',
  });

  // Verificăm dacă utilizatorul este logat
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);

      // Decodăm token-ul pentru a extrage datele utilizatorului
      const userData = JSON.parse(atob(token.split('.')[1])); // Decodăm payload-ul
      setUser(userData.utilizator); // Salvăm datele utilizatorului
    }
  }, []);

  // Gestionăm datele din formular
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Login
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
      // Salvează token-ul
      localStorage.setItem('token', data.token);

      // Decodează token-ul pentru a extrage datele utilizatorului
      const decodedToken = parseJwt(data.token);

      // Salvează separat userId și userName
      localStorage.setItem('userId', decodedToken.utilizator.utilizator_id);
      localStorage.setItem('userName', decodedToken.utilizator.nume);

      alert('Autentificare reușită!');
      setIsLoggedIn(true);
      setUser(decodedToken.utilizator); // Actualizează starea locală a utilizatorului
      setShowLoginModal(false); // Închide modalul
    } else {
      alert(data.error);
    }
  } catch (error) {
    alert('Eroare de conexiune. Încearcă din nou!');
  }
};

  // Sign Up
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (formData.parola !== formData.confirmPassword) {
      alert('Parolele nu se potrivesc!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5500/user/register', {
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
      if (response.ok) {
        alert('Cont creat cu succes!');
        setShowSignupModal(false);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Eroare de conexiune. Încearcă din nou!');
    }
  };

  // Logout
  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId'); // Șterge userId
  localStorage.removeItem('userName'); // Șterge userName
  setIsLoggedIn(false);
  setUser(null);
  alert('Delogat cu succes!');
  navigate('/'); // Redirecționează către pagina principală
};

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  return (
    <>
      {/* Bara albastră cu logo-ul GSMag */}
      <header className="header">
        <div className="logo">
          <a href="/">GSMag</a>
        </div>


        {/* Buton Coș Personal */}
        <div className="cart-section">
        <button className="cart-button" onClick={() => navigate('/cart')}>
        🛒 Coșul Meu
        </button>
        </div>

        {/* Dropdown pentru utilizator logat */}
        {isLoggedIn ? (
          <div className="profile-section">
            <button className="profile-button" onClick={() => setShowDropdown(!showDropdown)}>
              {user?.nume} ▼
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => navigate('/profile')}>Profil</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="login-button" onClick={() => setShowLoginModal(true)}>Login</button>
            <button className="signup-button" onClick={() => setShowSignupModal(true)}>Sign Up</button>
          </div>
        )}

        
      </header>

      {/* Modal Login */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>X</button>
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

      {/* Modal Sign Up */}
      {showSignupModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>X</button>
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
              <button type="submit">Înregistrează-te</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;