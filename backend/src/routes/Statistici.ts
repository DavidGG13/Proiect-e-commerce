import express from 'express';
import pool from '../config/database';// Configurarea bazei de date

const router = express.Router();

// 1. Produse cu cele mai bune rating-uri
router.get('/top-rated', async (req, res) => {
  try {
    const query = `
      WITH RecenziiPeProdus AS (
  SELECT 
    produs_id,
    COALESCE(AVG(rating), 0) AS rating_mediu,
    COUNT(recenzie_id) AS numar_recenzii
  FROM Recenzii
  GROUP BY produs_id
)

-- Query principal: Alăturăm informațiile din subcererea 1 cu tabelele Produse și Categorii
SELECT 
  p.produs_id, 
  p.nume_produs, 
  p.pret, 
  c.nume_categorie, 
  rpp.rating_mediu,
  rpp.numar_recenzii
FROM Produse p
LEFT JOIN Categorii c ON p.categorie_id = c.categorie_id
LEFT JOIN RecenziiPeProdus rpp ON p.produs_id = rpp.produs_id
WHERE rpp.numar_recenzii > 0
ORDER BY rpp.rating_mediu DESC, rpp.numar_recenzii DESC
LIMIT 10;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Eroare la fetch top-rated:', error);
    res.status(500).json({ error: 'Eroare internă de server!' });
  }
});

// Adaugă alte rute similare
router.get('/categories-summary', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.nume_categorie, 
        COUNT(p.produs_id) AS numar_produse, 
        SUM(p.pret * p.cantitate_stoc) AS valoare_totala,
        CASE 
          WHEN COUNT(p.produs_id) > 0 THEN ROUND(SUM(p.pret * p.cantitate_stoc) / SUM(p.cantitate_stoc), 2)
          ELSE 0
        END AS pret_mediu
      FROM Categorii c
      LEFT JOIN Produse p ON c.categorie_id = p.categorie_id
      GROUP BY c.nume_categorie
      ORDER BY valoare_totala DESC;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Eroare:', error);
    res.status(500).json({ error: 'Eroare internă de server!' });
  }
});

router.get('/low-stock', async (req, res) => {
  try {
    const query = `
      SELECT 
  produs_id, 
  nume_produs, 
  cantitate_stoc,
  (SELECT pret FROM Produse p2 
  WHERE p2.produs_id = Produse.produs_id) * cantitate_stoc AS valoare_totala_stoc
FROM Produse
WHERE cantitate_stoc < 10
ORDER BY cantitate_stoc ASC;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Eroare:', error);
    res.status(500).json({ error: 'Eroare internă de server!' });
  }
});

router.get('/estimated-revenue', async (req, res) => {
  try {
    const query = `
      SELECT 
    c.nume_categorie,
    COALESCE(SUM(pc.cantitate * pc.pret_la_momentul_comenzii), 0) AS venit_estimat
FROM Categorii c
LEFT JOIN Produse p ON c.categorie_id = p.categorie_id
LEFT JOIN ProduseComanda pc ON p.produs_id = pc.produs_id
LEFT JOIN Comenzi co ON pc.comanda_id = co.comanda_id
WHERE co.status = 'In curs de procesare'
GROUP BY c.nume_categorie
ORDER BY venit_estimat DESC;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Eroare la fetch estimated-revenue:', error);
    res.status(500).json({ error: 'Eroare internă de server!' });
  }
});


router.get('/products-without-reviews', async (req, res) => {
  try {
    const query = `
      SELECT 
  p.produs_id, 
  p.nume_produs, 
  p.pret, 
  c.nume_categorie,
  (SELECT COUNT(*) FROM Recenzii r 
  WHERE r.produs_id = p.produs_id) AS numar_recenzii
FROM Produse p
LEFT JOIN Categorii c ON p.categorie_id = c.categorie_id
WHERE NOT EXISTS (
  SELECT 1
  FROM Recenzii r
  WHERE r.produs_id = p.produs_id
)
ORDER BY p.nume_produs ASC;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Eroare la fetch products-without-reviews:', error);
    res.status(500).json({ error: 'Eroare internă de server!' });
  }
});
router.get('/similar-products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
  p2.produs_id, 
  p2.nume_produs, 
  p2.pret, 
  c.nume_categorie
FROM Produse p1
JOIN Produse p2 ON p1.categorie_id = p2.categorie_id
LEFT JOIN Categorii c ON p2.categorie_id = c.categorie_id
WHERE p1.produs_id = $1 
  AND p2.produs_id != $1
  AND p2.pret BETWEEN (
    SELECT p1.pret - 50
    FROM Produse p1
    WHERE p1.produs_id = $1
  ) AND (
    SELECT p1.pret + 50
    FROM Produse p1
    WHERE p1.produs_id = $1
  )
ORDER BY p2.pret ASC;
    `;
    const result = await pool.query(query, [id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Eroare la fetch similar-products:', error);
    res.status(500).json({ error: 'Eroare internă de server!' });
  }
});
router.get('/top-products-per-category', async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT ON (c.nume_categorie)
  p.produs_id,
  p.nume_produs,
  p.pret,
  c.nume_categorie,
  (SELECT COALESCE(AVG(r.rating), 0) 
    FROM Recenzii r 
    WHERE r.produs_id = p.produs_id) AS rating_mediu
FROM Produse p
LEFT JOIN Categorii c ON p.categorie_id = c.categorie_id
ORDER BY c.nume_categorie, rating_mediu DESC;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Eroare la fetch top-products-per-category:', error);
    res.status(500).json({ error: 'Eroare internă de server!' });
  }
});

export default router;