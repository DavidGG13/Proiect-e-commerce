import { Request, Response } from "express";
import { QueryResult } from "pg";
import pool from "../config/database";
import { Inventar } from "../models/invetar";

export const findAll = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    const result: QueryResult = await client.query("SELECT * FROM Inventar");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const findById = async (req: Request, res: Response): Promise<void> => {
  const { inventar_id } = req.params;
  const client = await pool.connect();
  try {
    const result: QueryResult = await client.query(
      "SELECT * FROM Inventar WHERE inventar_id = $1",
      [inventar_id]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Inventar not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const { produs_id, cantitate_inventar, locatie_stoc } = req.body;
  const client = await pool.connect();
  try {
    const queryText = `INSERT INTO Inventar(produs_id, cantitate_inventar, locatie_stoc) VALUES($1, $2, $3) RETURNING *`;
    const result: QueryResult = await client.query(queryText, [
      produs_id,
      cantitate_inventar,
      locatie_stoc,
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
  const { inventar_id } = req.params;
  const { produs_id, cantitate_inventar, locatie_stoc } = req.body;
  const client = await pool.connect();
  try {
    const queryText = `UPDATE Inventar SET produs_id = $1, cantitate_inventar = $2, locatie_stoc = $3 WHERE inventar_id = $4 RETURNING *`;
    const result: QueryResult = await client.query(queryText, [
      produs_id,
      cantitate_inventar,
      locatie_stoc,
      inventar_id,
    ]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Inventar not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const { inventar_id } = req.params;
  const client = await pool.connect();
  try {
    const result: QueryResult = await client.query(
      "DELETE FROM Inventar WHERE inventar_id = $1",
      [inventar_id]
    );
    if (!result) {
      res.status(200).json({ message: "Inventar deleted successfully" });
    } else {
      res.status(404).json({ error: "Inventar not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};
