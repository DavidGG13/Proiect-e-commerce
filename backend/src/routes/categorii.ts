import { Router } from "express";
import pool from '../config/database';
import { findAll, findById, create, update, remove } from "../crud/categorie";

const router = Router();

router.get("/", findAll);
router.get("/:id", findById);
router.post('/add', async (req, res) => {
  const { nume_categorie, descriere } = req.body;
  try {
    const query = `
      INSERT INTO Categorii (nume_categorie, descriere)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [nume_categorie, descriere];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Eroare la adăugarea categoriei:', error);
    res.status(500).json({ error: 'Eroare la adăugare!' });
  }
});

router.patch("/update", update);
router.delete("/delete", remove);

export default router;
