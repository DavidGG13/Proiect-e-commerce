import React, { useState, useEffect } from 'react';
import CategoriesFilters from '../components/CategoriesFilters';
import ProductGrid from '../components/ProductGrid';
import './MainPage.css';

function MainPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:5500/prod')
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
        setFilteredProducts(data);
      })
      .catch((err) => console.error('Eroare la fetch:', err));
  }, []);

  useEffect(() => {
    let filtered = allProducts;

    if (filters.categorie) {
      filtered = filtered.filter((product) =>
        filters.categorie === 'Telefoane'
          ? product.categorie_id === 1
          : filters.categorie === 'Tablete'
          ? product.categorie_id === 2
          : true
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.nume_produs.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters) {
      filtered = filtered.filter((product) => {
        const isWithinPrice =
          (!filters.minPrice || product.pret >= filters.minPrice) &&
          (!filters.maxPrice || product.pret <= filters.maxPrice);
        const isBrandSelected =
          !filters.brand || product.marca === filters.brand;
        const isInStock = !filters.stock || product.cantitate_stoc > 0;

        return isWithinPrice && isBrandSelected && isInStock;
      });
    }

    setFilteredProducts(filtered);
  }, [filters, searchQuery, allProducts]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="main-page">
      <div className="sidebar">
        <CategoriesFilters onFilterChange={handleFilterChange} />
      </div>
      <div className="content">
        <ProductGrid products={filteredProducts} onSearch={handleSearch} />
      </div>
    </div>
  );
}

export default MainPage;