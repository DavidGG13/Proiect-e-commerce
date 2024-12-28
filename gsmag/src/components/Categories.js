import React from 'react';
import './Categories.css';

function Categories() {
  const categories = ['Telefoane', 'Tablete', 'Accesorii', 'Promoții'];

  return (
    <aside className="categories">
      <h2>Categorii</h2>
      <ul>
        {categories.map((category, index) => (
          <li key={index} className="category-item">{category}</li>
        ))}
      </ul>
    </aside>
  );
}

export default Categories;