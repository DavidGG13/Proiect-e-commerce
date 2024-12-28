import { Request, Response } from "express";
import { QueryResult } from "pg";
import pool from "../config/database";

export const findAll = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const result: QueryResult = await client.query("SELECT * FROM Categorii");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const findById = async (req: Request, res: Response) => {
  const { categorie_id } = req.params;
  const client = await pool.connect();
  try {
    const result: QueryResult = await client.query(
      "SELECT * FROM Categorii WHERE categorie_id = $1",
      [Number(categorie_id)]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Categorie not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const create = async (req: Request, res: Response) => {
  const { nume_categorie } = req.body;
  const client = await pool.connect();
  try {
    const queryText = `INSERT INTO Categorii(nume_categorie) VALUES($1) RETURNING *`;
    const result: QueryResult = await client.query(queryText, [nume_categorie]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const update = async (req: Request, res: Response) => {
  const { categorie_id } = req.params;
  const { nume_categorie } = req.body;
  const client = await pool.connect();
  try {
    const queryText = `UPDATE Categorii SET nume_categorie = $1 WHERE categorie_id = $2 RETURNING *`;
    const result: QueryResult = await client.query(queryText, [
      nume_categorie,
      Number(categorie_id),
    ]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Categorie not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const remove = async (req: Request, res: Response) => {
  const { categorie_id } = req.params;
  const client = await pool.connect();
  try {
    const result: QueryResult = await client.query(
      "DELETE FROM Categorii WHERE categorie_id = $1",
      [Number(categorie_id)]
    );

    if (!result) {
      res.status(204).send({ message: "Categorie deleted successfully" });
    } else {
      res.status(404).json({ error: "Categorie not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export default {
  findAll,
  findById,
  create,
  update,
  remove,
};
