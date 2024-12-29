import { Router } from "express";
import pool from '../config/database';
import { findAll, findById, create, update, remove } from "../crud/comanda";

const router = Router();

router.get("/", findAll);
router.get("/:id", findById);
router.post('/add', async (req, res) => {
  const { utilizator_id, data_comanda, total } = req.body;
  try {
    const query = `
      INSERT INTO Comenzi (utilizator_id, data_comanda, total)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [utilizator_id, data_comanda, total];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Eroare la adăugarea comenzii:', error);
    res.status(500).json({ error: 'Eroare la adăugare!' });
  }
});
router.patch("/update", update);
router.delete("/delete", remove);

export default router;
