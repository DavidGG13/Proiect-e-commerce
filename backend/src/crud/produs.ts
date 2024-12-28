import { Request, Response } from "express";
import { QueryResult } from "pg";
import pool from "../config/database";
import { Produs } from "../models/produs";
import { log } from "console";

export const findAll = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    const result: QueryResult = await client.query("SELECT * FROM Produse");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const findById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  console.log(req.params);

  const client = await pool.connect();
  try {
    const result: QueryResult = await client.query(
      "SELECT * FROM Produse WHERE produs_id = $1",
      [id]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Produs not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const { nume_produs, pret, categorie_id } = req.body;
  const client = await pool.connect();
  try {
    const queryText = `INSERT INTO Produse(nume_produs, pret, categorie_id) VALUES($1, $2, $3) RETURNING *`;
    const result: QueryResult = await client.query(queryText, [
      nume_produs,
      pret,
      categorie_id,
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
  const { id } = req.params;
  const { nume_produs, pret, categorie_id, descriere } = req.body;

  console.log(req.body);
  console.log(req.params);
  const client = await pool.connect();
  try {
    const queryText = `UPDATE Produse 
    SET nume_produs = $1, pret = $2, categorie_id = $3, descriere = $4
    WHERE produs_id = $5 
    RETURNING *`;
    const result: QueryResult = await client.query(queryText, [
      nume_produs,
      pret,
      categorie_id,
      descriere,
      id,
    ]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Produs not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const { produs_id } = req.params;
  const client = await pool.connect();
  try {
    const result: QueryResult = await client.query(
      "DELETE FROM Produse WHERE produs_id = $1",
      [Number(produs_id)]
    );
    if (!result) {
      res.status(200).json({ message: "Produs deleted successfully" });
    } else {
      res.status(404).json({ error: "Produs not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};
