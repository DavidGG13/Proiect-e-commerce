import { Request, Response } from "express";
import { QueryResult } from "pg";
import pool from "../config/database";
import { Specificatie } from "../models/specificatie";

export const get = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();

  try {
    const result: QueryResult = await client.query(
      "SELECT * FROM Specificatii"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();
  const id = parseInt(req.params.id, 10);

  try {
    const result: QueryResult = await client.query(
      "SELECT * FROM Specificatii WHERE specificatie_id = $1",
      [id]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Not Found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();
  const specificatie: Specificatie = req.body;

  try {
    const query = `
      INSERT INTO Specificatii(produs_id, procesor, ram, rom, capacitate_baterie, sistem_operare)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const { rows }: QueryResult = await client.query(query, [
      specificatie.produs_id,
      specificatie.procesor,
      specificatie.ram,
      specificatie.rom,
      specificatie.capacitate_baterie,
      specificatie.sistem_operare,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();
  const specificatie: Specificatie = req.body;

  try {
    const query = `
      UPDATE Specificatii
      SET produs_id = $1, procesor = $2, ram = $3, rom = $4, capacitate_baterie = $5, sistem_operare = $6
      WHERE specificatie_id = $7
      RETURNING *
    `;

    const { rows }: QueryResult = await client.query(query, [
      specificatie.produs_id,
      specificatie.procesor,
      specificatie.ram,
      specificatie.rom,
      specificatie.capacitate_baterie,
      specificatie.sistem_operare,
      specificatie.specificatie_id,
    ]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: "Not Found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();
  const id = parseInt(req.params.id, 10);

  try {
    const query = `
      DELETE FROM Specificatii
      WHERE specificatie_id = $1
      RETURNING *
    `;

    const { rows }: QueryResult = await client.query(query, [id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: "Not Found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};
