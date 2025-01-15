import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import MainPage from './pages/MainPage';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AnalyticsPage from './pages/StatisticiPage';

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
            <Route path="/cart" element={<CartPage />} /> {/* Pagina Cos de cumparaturi */}
            <Route path="/checkout" element={<CheckoutPage />} /> {/* Pagina de finalizare comanda */}
            <Route path="/analytics" element={<AnalyticsPage />} /> {/* Pagina de statistici */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;