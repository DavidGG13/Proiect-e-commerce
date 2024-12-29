import { Router } from "express";
import pool from '../config/database';
import { get, getById, create, update, remove } from "../crud/specificatie";

const router = Router();

router.get("/", get);
router.get("/:id", getById);
router.post('/add', async (req, res) => {
  const { produs_id, specificatie, valoare } = req.body;
  try {
    const query = `
      INSERT INTO Specificatii (produs_id, specificatie, valoare)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [produs_id, specificatie, valoare];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Eroare la adăugarea specificației:', error);
    res.status(500).json({ error: 'Eroare la adăugare!' });
  }
});
router.patch("/update", update);
router.delete("/delete", remove);

export default router;
