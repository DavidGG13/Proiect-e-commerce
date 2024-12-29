import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    nume: '',
    email: '',
    adresa: '',
    numar_telefon: '',
  });
  const [editMode, setEditMode] = useState({
    nume: false,
    email: false,
    adresa: false,
    numar_telefon: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    const user = JSON.parse(atob(token.split('.')[1])).utilizator;
    setUserData(user);
  }, [navigate]);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5500/user/update/${userData.utilizator_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Profil actualizat cu succes!');
        setEditMode({
          nume: false,
          email: false,
          adresa: false,
          numar_telefon: false,
        });
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Eroare la actualizarea profilului!');
    }
  };

  const toggleEditMode = (field) => {
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  return (
    <div className="profile-container">
      <h2>Profil Utilizator</h2>
      <form onSubmit={handleUpdateProfile} className="profile-form">
        <div className="form-group">
          <label>Nume:</label>
          <input
            type="text"
            name="nume"
            value={userData.nume}
            onChange={handleInputChange}
            disabled={!editMode.nume}
            required
          />
          <button type="button" onClick={() => toggleEditMode('nume')}>
            {editMode.nume ? 'Salvează' : 'Editează'}
          </button>
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            disabled={!editMode.email}
            required
          />
          <button type="button" onClick={() => toggleEditMode('email')}>
            {editMode.email ? 'Salvează' : 'Editează'}
          </button>
        </div>
        <div className="form-group">
          <label>Adresă:</label>
          <input
            type="text"
            name="adresa"
            value={userData.adresa}
            onChange={handleInputChange}
            disabled={!editMode.adresa}
            required
          />
          <button type="button" onClick={() => toggleEditMode('adresa')}>
            {editMode.adresa ? 'Salvează' : 'Editează'}
          </button>
        </div>
        <div className="form-group">
          <label>Telefon:</label>
          <input
            type="text"
            name="numar_telefon"
            value={userData.numar_telefon}
            onChange={handleInputChange}
            disabled={!editMode.numar_telefon}
            required
          />
          <button type="button" onClick={() => toggleEditMode('numar_telefon')}>
            {editMode.numar_telefon ? 'Salvează' : 'Editează'}
          </button>
        </div>
        <button type="submit">Salvează toate</button>
      </form>
    </div>
  );
}

export default Profile;