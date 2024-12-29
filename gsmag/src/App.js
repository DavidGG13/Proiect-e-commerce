import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import MainPage from './pages/MainPage';
import ProductDetails from './pages/ProductDetails';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<MainPage />} /> {/* Pagina principală */}
            <Route path="/profile" element={<Profile />} /> {/* Profil utilizator */}
            <Route path="/product/:productId" element={<ProductDetails />} /> {/* Detalii produs */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;