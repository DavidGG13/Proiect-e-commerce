import React from 'react';
import Categories from '../components/Categories';
import ProductGrid from '../components/ProductGrid';
import './MainPage.css';

function MainPage() {
  return (
    <div className="main-page">
      {/* Sidebar fix pentru categorii */}
      <div className="sidebar">
        <Categories />
      </div>

      {/* Conținutul cu grid-ul de produse */}
      <div className="content">
        <h1>Produse din Stoc</h1>
        <ProductGrid />
      </div>
    </div>
  );
}

export default MainPage;