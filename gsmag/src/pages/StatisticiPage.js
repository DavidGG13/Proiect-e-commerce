import React, { useState, useEffect } from 'react';
import './StatisticiPage.css';

function AnalyticsPage() {
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [categoriesSummary, setCategoriesSummary] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [estimatedRevenue, setEstimatedRevenue] = useState([]);
  const [productsWithoutReviews, setProductsWithoutReviews] = useState([]);
  const [topProductsPerCategory, setTopProductsPerCategory] = useState([]);

  useEffect(() => {
    const fetchTopRatedProducts = async () => {
      try {
        const response = await fetch('http://localhost:5500/api/queries/top-rated');
        const data = await response.json();
        setTopRatedProducts(data);
      } catch (error) {
        console.error('Eroare la fetch pentru top-rated:', error);
      }
    };

    const fetchCategoriesSummary = async () => {
      try {
        const response = await fetch('http://localhost:5500/api/queries/categories-summary');
        const data = await response.json();
        setCategoriesSummary(data);
      } catch (error) {
        console.error('Eroare la fetch pentru categories-summary:', error);
      }
    };

    const fetchLowStockProducts = async () => {
      try {
        const response = await fetch('http://localhost:5500/api/queries/low-stock');
        const data = await response.json();
        setLowStockProducts(data);
      } catch (error) {
        console.error('Eroare la fetch pentru low-stock:', error);
      }
    };

    const fetchEstimatedRevenue = async () => {
      try {
        const response = await fetch('http://localhost:5500/api/queries/estimated-revenue');
        const data = await response.json();
        setEstimatedRevenue(data);
      } catch (error) {
        console.error('Eroare la fetch pentru estimated-revenue:', error);
      }
    };

    const fetchProductsWithoutReviews = async () => {
      try {
        const response = await fetch('http://localhost:5500/api/queries/products-without-reviews');
        const data = await response.json();
        setProductsWithoutReviews(data);
      } catch (error) {
        console.error('Eroare la fetch pentru products-without-reviews:', error);
      }
    };

    const fetchTopProductsPerCategory = async () => {
      try {
        const response = await fetch('http://localhost:5500/api/queries/top-products-per-category');
        const data = await response.json();
        setTopProductsPerCategory(data);
      } catch (error) {
        console.error('Eroare la fetch pentru top-products-per-category:', error);
      }
    };

    fetchTopRatedProducts();
    fetchCategoriesSummary();
    fetchLowStockProducts();
    fetchEstimatedRevenue();
    fetchProductsWithoutReviews();
    fetchTopProductsPerCategory();
  }, []);

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">Analytics Dashboard</h1>

      {/* Produse cu cele mai bune rating-uri */}
      <section className="analytics-section">
        <h2 className="section-title">Produse cu cele mai bune rating-uri</h2>
        <div className="multi-row-grid">
          {topRatedProducts.map((product) => (
            <div key={product.produs_id} className="product-card">
              <h3 className="product-name">{product.nume_produs}</h3>
              <p className="product-details">
                Rating: <span>{product.rating_mediu} ★</span> ({product.numar_recenzii} recenzii)
              </p>
              <p className="product-details">Preț: {product.pret} Lei</p>
              <p className="product-details">Categorie: {product.nume_categorie}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categorii cu cele mai multe produse */}
      <section className="analytics-section">
        <h2 className="section-title">Categorii cu cele mai multe produse</h2>
        <div className="card-container">
          {categoriesSummary.map((category) => (
            <div key={category.nume_categorie} className="category-card">
              <h3 className="category-name">{category.nume_categorie}</h3>
              <p className="category-details">
                Produse: <span>{category.numar_produse}</span>
              </p>
              <p className="category-details">
                Preț mediu: <span>{category.pret_mediu || '0'} Lei</span>
              </p>
              <p className="category-details">
                Valoare totală: <span>{category.valoare_totala || '0'} Lei</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Produse cu stoc limitat */}
      <section className="analytics-section">
        <h2 className="section-title">Produse cu stoc limitat</h2>
        <div className="card-container">
          {lowStockProducts.map((product) => (
            <div key={product.produs_id} className="low-stock-card">
              <h3 className="product-name">{product.nume_produs}</h3>
              <p className="low-stock-details">
                Stoc: <span>{product.cantitate_stoc} bucăți</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Venit estimat */}
      <section className="analytics-section">
  <h2 className="section-title">Venit Estimat din Comenzi Active</h2>
  <div className="card-container">
    {estimatedRevenue.map((item, index) => (
      <div key={index} className="revenue-card">
        <h3 className="category-name">Categorie: {item.nume_categorie}</h3>
        <p className="category-details">
          Venit estimat: <span>{item.venit_estimat || '0'} Lei</span>
        </p>
      </div>
    ))}
  </div>
</section>

      {/* Produse fără recenzii */}
      <section className="analytics-section">
        <h2 className="section-title">Produse fără recenzii</h2>
        <div className="card-container">
          {productsWithoutReviews.map((product) => (
            <div key={product.produs_id} className="no-review-card">
              <h3 className="product-name">{product.nume_produs}</h3>
              <p className="no-review-details">Categorie: {product.nume_categorie}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top produse pe categorie */}
      <section className="analytics-section">
        <h2 className="section-title">Top Produse pe Categorie</h2>
        <div className="card-container">
          {topProductsPerCategory.map((product) => (
            <div key={product.produs_id} className="top-category-card">
              <h3 className="product-name">{product.nume_produs}</h3>
              <p className="product-details">
                Categorie: <span>{product.nume_categorie}</span>
              </p>
              <p className="product-details">Preț: {product.pret} Lei</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AnalyticsPage;