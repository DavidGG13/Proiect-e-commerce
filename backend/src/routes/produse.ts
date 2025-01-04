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

// GET RECENZII pentru un produs
router.get('/recenzii/:id', async (req, res) => {
  const { id } = req.params; // ID-ul produsului
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT r.recenzie_id, r.rating, r.comentariu, r.data_recenzie, 
             u.nume AS utilizator
      FROM Recenzii r
      JOIN Utilizatori u ON r.utilizator_id = u.utilizator_id
      WHERE r.produs_id = $1
      ORDER BY r.data_recenzie DESC
    `, [id]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows); // Returnează lista recenziilor
    } else {
      res.status(404).json([]); // Returnează un array gol dacă nu există recenzii
    }
  } catch (error) {
    console.error('Eroare la fetch recenzii:', error);
    res.status(500).json({ error: 'Eroare internă de server!' });
  } finally {
    client.release();
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