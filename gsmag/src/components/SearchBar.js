import React, { useState } from 'react';
import axios from 'axios';
import './SearchBar.css';

function SearchBar({ onSearchResults }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null); // Starea pentru erori

  // Funcția pentru gestionarea căutării
  const handleSearch = async () => {
    if (query.trim() === '') return; // Verifică dacă query-ul este gol

    try {
      setError(null); // Resetează eroarea înainte de fetch
      const response = await axios.get(`http://localhost:5500/prod/search?query=${query}`);
      if (onSearchResults && typeof onSearchResults === 'function') {
        onSearchResults(response.data); // Transmite rezultatele către componenta părinte
      } else {
        console.warn('onSearchResults nu este definit sau nu este o funcție.');
      }
    } catch (err) {
      console.error('Eroare la căutare:', err);
      setError('A apărut o problemă la căutare. Încearcă din nou.');
    }
  };

  // Gestionează apăsarea tastei Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Activează căutarea
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Căutare produse..."
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress} // Activează căutarea la Enter
      />
      <button type="submit" className="search-button" onClick={handleSearch}>
        Caută
      </button>
      {error && <p className="error-message">{error}</p>} {/* Mesaj de eroare */}
    </div>
  );
}

export default SearchBar;