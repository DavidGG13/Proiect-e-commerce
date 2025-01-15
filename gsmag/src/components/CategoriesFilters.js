import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'; // Importă stilurile pentru slider
import './CategoriesFilters.css';

function CategoriesFilters({ onFilterChange }) {
  const navigate = useNavigate();
  const location = useLocation(); // Obține calea curentă

  // Extragem categoria selectată din URL
  const searchParams = new URLSearchParams(location.search);
  const selectedCategory = searchParams.get('categorie') || '';

  // Stare pentru filtre
  const [filters, setFilters] = useState({
    categorie: selectedCategory, // Categoria selectată
    minPrice: 0,                 // Preț minim
    maxPrice: 10000,             // Preț maxim
    brand: '',                   // Brand
    stock: false,                // Disponibilitate în stoc
  });

  const [sliderValue, setSliderValue] = useState([0, 10000]); // Interval slider

  // Actualizează categoria selectată
  const handleCategoryClick = (categorie) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      categorie, // Actualizează categoria selectată
    }));
    navigate(`/?categorie=${categorie}`); // Actualizează URL-ul
  };

  // Actualizează slider-ul live
  const handleSliderChange = (value) => {
    setSliderValue(value); // Actualizează doar slider-ul
    setFilters((prevFilters) => ({
      ...prevFilters,
      minPrice: value[0],
      maxPrice: value[1],
    }));
  };

  // Actualizează alte filtre
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Aplică toate filtrele la apăsarea butonului
  const handleApplyFilters = () => {
    onFilterChange(filters); // Trimite filtrele către componenta părinte
  };

  return (
    <div className="categories-filters">
      {/* Categorii */}
      <div className="categories">
        <h3>Categorii</h3>
        <button
          className={filters.categorie === 'Telefoane' ? 'selected' : ''}
          onClick={() => handleCategoryClick('Telefoane')}
        >
          Telefoane
        </button>
        <button
          className={filters.categorie === 'Tablete' ? 'selected' : ''}
          onClick={() => handleCategoryClick('Tablete')}
        >
          Tablete
        </button>
        <button
          className={filters.categorie === '' ? 'selected' : ''}
          onClick={() => handleCategoryClick('')}
        >
          Toate
        </button>
      </div>

      {/* Filtre */}
      <div className="filters">
        <h3>Filtre</h3>

        {/* Slider pentru preț */}
        <div className="filter-group">
          <label>Preț:</label>
          <Slider
            range
            min={0}
            max={10000}
            value={sliderValue} // Valoarea slider-ului
            onChange={handleSliderChange} // Actualizează slider-ul live
            step={50} // Pas
          />
          <div className="price-values">
            <span>{sliderValue[0]} Lei</span> - <span>{sliderValue[1]} Lei</span>
          </div>
        </div>

        {/* Filtru după brand */}
        <div className="filter-group">
          <label>Brand:</label>
          <select
            name="brand"
            value={filters.brand}
            onChange={handleInputChange}
          >
            <option value="">Toate</option>
            <option value="Samsung">Samsung</option>
            <option value="Apple">Apple</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="Huawei">Huawei</option>
            <option value="Lenovo">Lenovo</option>
          </select>
        </div>

        {/* Filtru după stoc */}
        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              name="stock"
              checked={filters.stock}
              onChange={handleInputChange}
            />
            Doar produse în stoc
          </label>
        </div>

        {/* Buton pentru aplicarea filtrelor */}
        <button className="apply-filters-button" onClick={handleApplyFilters}>
          Aplică Filtre
        </button>
        
      </div>
      {/* Buton pentru Analytics */}
      <div className="analytics-button">
        <button
          className="navigate-analytics-button"
          onClick={() => navigate('/analytics')}
        >
          Analytics
        </button>
      </div>
    </div>
  );
}

export default CategoriesFilters;