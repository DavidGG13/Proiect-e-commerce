import { Request, Response } from "express";
import { QueryResult } from "pg";
import pool from "../config/database";
import { Recenzie } from "../models/recenzie";

export const findAll = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    const queryText = `
      SELECT r.recenzie_id, r.rating, r.comentariu, r.data_recenzie,
             u.nume AS utilizator
      FROM Recenzii r
      JOIN Utilizatori u ON r.utilizator_id = u.utilizator_id
      ORDER BY r.data_recenzie DESC;
    `;
    const result: QueryResult = await client.query(queryText); // Execută query-ul
    res.status(200).json(result.rows); // Returnează recenziile
  } catch (err) {
    console.error('Eroare la obținerea recenziilor:', err);
    res.status(500).json({ error: "Eroare internă de server." });
  } finally {
    client.release();
  }
};

export const findById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // ID-ul produsului
  const client = await pool.connect();
  try {
    const queryText = `
      SELECT r.recenzie_id, r.rating, r.comentariu, r.data_recenzie,
             u.nume AS utilizator -- Modificat din 'nume_utilizator' în 'nume'
      FROM Recenzii r
      JOIN Utilizatori u ON r.utilizator_id = u.utilizator_id
      WHERE r.produs_id = $1
      ORDER BY r.data_recenzie DESC;
    `;

    console.log("SQL Query:", queryText); // Log pentru query
    console.log("Values:", [id]); // Log pentru valorile parametrilor

    const result: QueryResult = await client.query(queryText, [id]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows); // Returnează recenziile
    } else {
      res.status(404).json({ error: "Nicio recenzie găsită!" });
    }
  } catch (err) {
    console.error('Eroare la obținerea recenziilor:', err);
    res.status(500).json({ error: "Eroare internă de server." });
  } finally {
    client.release();
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const recenzie: Recenzie = req.body;
  const client = await pool.connect();
  try {
    const queryText = `INSERT INTO Recenzii(produs_id, rating, comentariu, data_recenzie) VALUES($1, $2, $3, $4) RETURNING *`;
    const result: QueryResult = await client.query(queryText, [
      recenzie.produs_id,
      recenzie.rating,
      recenzie.comentariu,
      recenzie.data_recenzie,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const { recenzie_id } = req.params;
  const recenzie: Recenzie = req.body;
  const client = await pool.connect();
  try {
    const queryText = `UPDATE Recenzii SET produs_id = $1, rating = $2, comentariu = $3, data_recenzie = $4 WHERE recenzie_id = $5 RETURNING *`;
    const result: QueryResult = await client.query(queryText, [
      recenzie.produs_id,
      recenzie.rating,
      recenzie.comentariu,
      recenzie.data_recenzie,
      recenzie_id,
    ]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Recenzie not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const { recenzie_id } = req.params;
  const client = await pool.connect();
  try {
    const queryText = `DELETE FROM Recenzii WHERE recenzie_id = $1`;
    await client.query(queryText, [recenzie_id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};


