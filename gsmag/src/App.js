import React from 'react';
import './App.css';
import Header from './components/Header';
import Categories from './components/Categories';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="content-container">
        <Categories />
        <div className="main-content">
          <h1>Produse disponibile</h1>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;