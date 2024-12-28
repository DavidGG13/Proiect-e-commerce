import { Request, Response } from "express";
import { QueryResult } from "pg";
import pool from "../config/database";
import { Comanda } from "../models/comanda";

export const findAll = async (req: Request, res: Response): Promise<void> => {
  // console.log("Request:", req);
  const client = await pool.connect();
  try {
    const result: QueryResult = await client.query("SELECT * FROM Comenzi");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
  console.log("Response:", res);
};

export const findById = async (req: Request, res: Response): Promise<void> => {
  console.log("Request:", req);
  const { comanda_id } = req.params;
  const client = await pool.connect();
  try {
    const result: QueryResult = await client.query(
      "SELECT * FROM Comenzi WHERE comanda_id = $1",
      [comanda_id]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Comanda not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
  console.log("Response:", res);
};

export const create = async (req: Request, res: Response): Promise<void> => {
  console.log("Request:", req);
  const comanda: Comanda = req.body;
  const client = await pool.connect();
  try {
    const queryText = `INSERT INTO Comenzi(data_comanda, pret_total, utilizator_id) VALUES($1, $2, $3) RETURNING *`;
    const result: QueryResult = await client.query(queryText, [
      comanda.data_comanda,
      comanda.pret_total,
      comanda.utilizator_id,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
  console.log("Response:", res);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  console.log("Request:", req);
  const { comanda_id } = req.params;
  const comanda: Comanda = req.body;
  const client = await pool.connect();
  try {
    const queryText = `UPDATE Comenzi SET data_comanda = $1, pret_total = $2, utilizator_id = $3 WHERE comanda_id = $4 RETURNING *`;
    const result: QueryResult = await client.query(queryText, [
      comanda.data_comanda,
      comanda.pret_total,
      comanda.utilizator_id,
      comanda_id,
    ]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Comanda not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
  console.log("Response:", res);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  console.log("Request:", req);
  const { comanda_id } = req.params;
  const client = await pool.connect();
  try {
    const result: QueryResult = await client.query(
      "DELETE FROM Comenzi WHERE comanda_id = $1",
      [comanda_id]
    );
    if (!result) {
      res.status(200).json({ message: "Comanda deleted successfully" });
    } else {
      res.status(404).json({ error: "Comanda not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
  console.log("Response:", res);
};
