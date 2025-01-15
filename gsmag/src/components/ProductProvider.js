import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchBar from './SearchBar';
import ProductGrid from './ProductGrid';
import { ProductProvider } from './ProductContext';

function App() {
  return (
    <ProductProvider>
      <Router>
        <div>
          <SearchBar />
          <ProductGrid />
        </div>
      </Router>
    </ProductProvider>
  );
}

export default App;