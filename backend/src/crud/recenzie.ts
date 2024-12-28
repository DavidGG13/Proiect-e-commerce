import { Request, Response } from "express";
import { QueryResult } from "pg";
import pool from "../config/database";
import { Recenzie } from "../models/recenzie";

export const findAll = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    const result: QueryResult = await client.query("SELECT * FROM Recenzii");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const findById = async (req: Request, res: Response): Promise<void> => {
  const { recenzie_id } = req.params;
  const client = await pool.connect();
  try {
    const result: QueryResult = await client.query(
      "SELECT * FROM Recenzii WHERE recenzie_id = $1",
      [recenzie_id]
    );
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
