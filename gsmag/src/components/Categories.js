import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Categories.css';

function Categories() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(''); // Categoria selectată

  const handleCategoryClick = (categorie) => {
    setSelectedCategory(categorie); // Actualizează categoria activă
    navigate(`/?categorie=${categorie}`); // Actualizează URL-ul
  };

  return (
    <div className="categories">
      <button
        className={selectedCategory === 'Telefoane' ? 'selected' : ''}
        onClick={() => handleCategoryClick('Telefoane')}
      >
        Telefoane
      </button>
      <button
        className={selectedCategory === 'Tablete' ? 'selected' : ''}
        onClick={() => handleCategoryClick('Tablete')}
      >
        Tablete
      </button>
      <button
        className={selectedCategory === '' ? 'selected' : ''}
        onClick={() => handleCategoryClick('')}
      >
        Toate
      </button>
    </div>
  );
}

export default Categories;