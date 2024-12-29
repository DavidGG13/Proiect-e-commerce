import { Router } from "express";
import pool from '../config/database';
import { findAll, findById, create, update, remove } from "../crud/recenzie";

const router = Router();

router.get("/", findAll);
router.get("/:id", findById);
router.post('/add', async (req, res) => {
  const { produs_id, utilizator_id, rating, comentariu } = req.body;
  const checkUser = await pool.query(
    'SELECT * FROM Utilizatori WHERE utilizator_id = $1',
    [utilizator_id]
  );
   

  try {
     const query = `
      INSERT INTO Recenzii (produs_id, utilizator_id, rating, comentariu, data_recenzie)
      VALUES ($1, $2, $3, $4, NOW()) -- Adaugă data curentă automat
      RETURNING *;
    `;
    const values = [produs_id, utilizator_id, rating, comentariu];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Eroare la adăugarea recenziei:', error);
    res.status(500).json({ error: 'Eroare la adăugare!' });
  }
});
router.patch("/update", update);
router.delete("/delete", remove);

export default router;
