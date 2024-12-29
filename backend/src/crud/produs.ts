import { Request, Response } from "express";
import { QueryResult } from "pg";
import pool from "../config/database";
import path from "path";
import fs from "fs";

// Funcție pentru generarea URL-ului imaginii și crearea folderului
const createImageUrl = (nume_produs: string): string => {
  const basePath = path.join(__dirname, "../../imagini"); // Folderul de bază
  const folderPath = path.join(basePath, nume_produs, "1"); // Calea completă a folderului

  // Creează folderul dacă nu există
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Returnează URL-ul către 1.jpg
  return `/imagini/${nume_produs}/1.jpg`;
};
// GET ALL PRODUCTS
export const findAll = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    const result: QueryResult = await client.query(`
      SELECT p.*, c.nume_categorie 
      FROM Produse p
      LEFT JOIN Categorii c ON p.categorie_id = c.categorie_id
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

// GET PRODUCT BY ID
export const findById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result: QueryResult = await client.query(
      `
      SELECT p.*, 
             s.procesor, s.ram, s.rom, s.capacitate_baterie, s.sistem_operare,
             d.dimensiune_ecran, d.rezolutie, d.tip_panou, d.rata_refresh,
             c.camera_principala, c.camera_frontala, c.rezolutie_video
      FROM Produse p
      LEFT JOIN Specificatii s ON p.produs_id = s.produs_id
      LEFT JOIN Specificatiidisplay d ON p.produs_id = d.produs_id
      LEFT JOIN Specificatiicamera c ON p.produs_id = c.produs_id
      WHERE p.produs_id = $1
      `,
      [id]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Produsul nu a fost găsit." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare internă de server." });
  } finally {
    client.release();
  }
};


// CREATE PRODUCT
export const create = async (req: Request, res: Response): Promise<void> => {
  const {
    nume_produs,
    pret,
    categorie_id,
    cantitate_stoc,
    descriere,
  } = req.body;

  const imagine_url = createImageUrl(nume_produs); // Generează URL-ul imaginii

  const client = await pool.connect();
  try {
    const queryText = `
      INSERT INTO Produse(nume_produs, pret, categorie_id, cantitate_stoc, descriere, imagine_url)
      VALUES($1, $2, $3, $4, $5, $6) 
      RETURNING *`;
    const result: QueryResult = await client.query(queryText, [
      nume_produs,
      pret,
      categorie_id,
      cantitate_stoc,
      descriere,
      imagine_url,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

// UPDATE PRODUCT
export const update = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const {
    nume_produs,
    pret,
    categorie_id,
    cantitate_stoc,
    descriere,
    imagine_url,
  } = req.body;

  const client = await pool.connect();
  try {
    const queryText = `
      UPDATE Produse 
      SET nume_produs = $1, pret = $2, categorie_id = $3, cantitate_stoc = $4, descriere = $5, imagine_url = $6
      WHERE produs_id = $7 
      RETURNING *`;
    const result: QueryResult = await client.query(queryText, [
      nume_produs,
      pret,
      categorie_id,
      cantitate_stoc,
      descriere,
      imagine_url,
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

// DELETE PRODUCT
export const remove = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result: QueryResult = await client.query(
      "DELETE FROM Produse WHERE produs_id = $1",
      [id]
    );
    if (result.rowCount && result.rowCount > 0) {
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
