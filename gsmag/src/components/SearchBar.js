import React from 'react';
import './SearchBar.css';

function SearchBar() {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Căutare..." className="search-input" />
      <button type="submit" className="search-button">Caută</button>
    </div>
  );
}

export default SearchBar;