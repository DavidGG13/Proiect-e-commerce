import React from 'react';
import './SearchBar.css';

function SearchBar() {
  return (
    <div className="search-bar-container">
      <input type="text" placeholder="Caută produse..." className="search-input" />
      <button className="search-button">Caută</button>
    </div>
  );
}

export default SearchBar;