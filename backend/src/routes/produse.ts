import { Router } from 'express';
import pool from '../config/database';
import { findById } from "../crud/produs"; // Ensure the file '../crud/produse.ts' exists and is correctly named
const router = Router();

// Adaugă un produs nou
router.post('/add', async (req, res) => {
  const { nume_produs, categorie_id, marca, pret, cantitate_stoc, descriere, imagine_url } = req.body;
  try {
    const query = `
      INSERT INTO Produse (nume_produs, categorie_id, marca, pret, cantitate_stoc, descriere, imagine_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [nume_produs, categorie_id, marca, pret, cantitate_stoc, descriere, imagine_url];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Eroare la adăugarea produsului:', error);
    res.status(500).json({ error: 'Eroare la adăugare!' });
  }
});

router.get('/', async (req, res) => {
  try {
    const produse = await pool.query('SELECT * FROM Produse');
    res.json(produse.rows);
  } catch (error) {
    console.error('Eroare la preluarea produselor:', error);
    res.status(500).json({ error: 'Eroare server!' });
  }
});
router.get("/:id", findById);
export default router;