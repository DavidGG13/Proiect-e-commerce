import pool from "../config/database";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";
import e, { Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config();

export const register = async (req: Request, res: Response) => {
  const { nume, email, parola, adresa, numar_telefon } = req.body;
  try {
    //check if email already exists
    const emailExists = await pool.query(
      `
      SELECT * FROM Utilizatori
      WHERE email = $1
      `,
      [email]
    );
    if (emailExists.rows.length) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    // validate input
    const schema = z.object({
      nume: z.string(),
      email: z.string().email(),
      parola: z.string().min(6),
      adresa: z.string(),
      numar_telefon: z.string(),
    });

    const check = schema.safeParse({
      nume,
      email,
      parola,
      adresa,
      numar_telefon,
    });

    if (!check.success) {
      res.status(400).json({ error: check.error });
      return;
    }

    const hashedParola = await bcrypt.hash(parola, 10);
    const utilizator = await pool.query(
      `
        INSERT INTO Utilizatori (nume, email, parola, rol, adresa, numar_telefon)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
      [nume, email, hashedParola, "user", adresa, numar_telefon]
    );
    res.status(201).json({ message: "Utilizator creat!" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, parola } = req.body;
  try {
    const utilizator = await pool.query(
      `
      SELECT * FROM Utilizatori
      WHERE email = $1
      `,
      [email]
    );
    if (!utilizator.rows.length) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }
    const isValid = await bcrypt.compare(parola, utilizator.rows[0].parola);
    if (!isValid) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }
    // remove parola from response
    delete utilizator.rows[0].parola;

    // generate jwt token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign(
      { utilizator: utilizator.rows[0] },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const utilizatori = await pool.query("SELECT * FROM Utilizatori");
    res.status(200).json({ users: utilizatori.rows });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const utilizator = await pool.query(
      `
      SELECT * FROM Utilizatori
      WHERE utilizator_id = $1;
      `,
      [id]
    );
    if (!utilizator.rows.length) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json({ user: utilizator.rows });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const smth = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'Utilizatori';`);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nume, email, parola, adresa, numar_telefon } = req.body;

  console.log(id, nume, email, parola, adresa, numar_telefon);
  try {
    const utilizator = await pool.query(
      `
      UPDATE Utilizatori
      SET nume = $1, email = $2, parola = $3, adresa = $4, numar_telefon = $5
      WHERE utilizator_id = $6
      RETURNING *
      `,
      [nume, email, parola, adresa, numar_telefon, id]
    );
    if (!utilizator.rows.length) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json({ message: "Updated!" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const utilizator = await pool.query(
      `
      DELETE FROM Utilizatori
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );
    if (!utilizator.rows.length) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json({ message: "Deleted!" });
  } catch (error) {
    res.status(500).json(error);
  }
};
