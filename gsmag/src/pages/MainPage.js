import React, { useState, useEffect } from 'react';
import CategoriesFilters from '../components/CategoriesFilters'; // Componenta unificată
import ProductGrid from '../components/ProductGrid';
import './MainPage.css';

function MainPage() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filters, setFilters] = useState({}); // Stare pentru filtre

  // Fetch produse
  useEffect(() => {
    fetch('http://localhost:5500/prod')
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
        setFilteredProducts(data); // Inițial afișăm toate produsele
      })
      .catch((err) => console.error('Eroare:', err));
  }, []);

  // Aplică filtre
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters); // Actualizează filtrele în starea locală
  };

  return (
    <div className="main-page">
      {/* Sidebar pentru categorii și filtre */}
      <div className="sidebar">
        <CategoriesFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Conținutul cu grid-ul de produse */}
      <div className="content">
        <h1>Produse din Stoc</h1>
        <ProductGrid products={allProducts} filters={filters} />
      </div>
    </div>
  );
}

export default MainPage;