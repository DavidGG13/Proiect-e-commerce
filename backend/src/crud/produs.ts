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
  const { categorie, minPrice, maxPrice, brand, stock } = req.query; // Extragem filtrele din query params

  const client = await pool.connect();
  try {
    // Construim query-ul dinamic
    let query = `
      SELECT p.*, c.nume_categorie 
      FROM Produse p
      LEFT JOIN Categorii c ON p.categorie_id = c.categorie_id
      WHERE 1 = 1
    `;

    const queryParams: any[] = [];

    // 1. Filtru pentru categorie
    if (categorie) {
      query += ` AND LOWER(c.nume_categorie) = LOWER($${queryParams.length + 1})`;
      queryParams.push(categorie);
    }

    // 2. Filtru pentru preț minim
    if (minPrice) {
      query += ` AND p.pret >= $${queryParams.length + 1}`;
      queryParams.push(Number(minPrice));
    }

    // 3. Filtru pentru preț maxim
    if (maxPrice) {
      query += ` AND p.pret <= $${queryParams.length + 1}`;
      queryParams.push(Number(maxPrice));
    }

    // 4. Filtru pentru brand
    if (brand) {
      query += ` AND LOWER(p.nume_produs) LIKE LOWER($${queryParams.length + 1})`;
      queryParams.push(`%${brand}%`);
    }

    // 5. Filtru pentru stoc
    if (stock === "true") {
      query += ` AND p.cantitate_stoc > 0`;
    }

    query += " ORDER BY p.nume_produs"; // Ordonăm după nume

    console.log("Query:", query); // Log pentru debugging
    console.log("Params:", queryParams);

    const result: QueryResult = await client.query(query, queryParams);
    res.status(200).json(result.rows); // Returnăm rezultatele filtrate
  } catch (err) {
    console.error("Eroare la filtrare:", err);
    res.status(500).json({ error: "Eroare internă de server!" });
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
             c.camera_principala, c.camera_frontala, c.rezolutie_video,
             json_agg(
               json_build_object(
                 'recenzie_id', r.recenzie_id,
                 'utilizator', u.nume,
                 'rating', r.rating,
                 'comentariu', r.comentariu,
                 'data_recenzie', r.data_recenzie
               )
             ) AS recenzii
      FROM Produse p
      LEFT JOIN Specificatii s ON p.produs_id = s.produs_id
      LEFT JOIN Specificatiidisplay d ON p.produs_id = d.produs_id
      LEFT JOIN Specificatiicamera c ON p.produs_id = c.produs_id
      LEFT JOIN Recenzii r ON p.produs_id = r.produs_id
      LEFT JOIN Utilizatori u ON r.utilizator_id = u.utilizator_id
      WHERE p.produs_id = $1
      GROUP BY p.produs_id, s.procesor, s.ram, s.rom, s.capacitate_baterie, 
               s.sistem_operare, d.dimensiune_ecran, d.rezolutie, d.tip_panou, 
               d.rata_refresh, c.camera_principala, c.camera_frontala, c.rezolutie_video;
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
  console.log("ID primit pentru ștergere:", id);
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

export const findPopular = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    console.log("Fetching popular products...");

    const query = `
      SELECT p.produs_id, p.nume_produs, p.categorie_id, p.marca, p.pret, 
             p.cantitate_stoc, p.descriere, p.imagine_url, c.nume_categorie, 
             COALESCE(AVG(r.rating), 0) AS rating_mediu, 
             COUNT(r.recenzie_id) AS numar_recenzii
      FROM Produse p
      LEFT JOIN Categorii c ON p.categorie_id = c.categorie_id
      LEFT JOIN Recenzii r ON p.produs_id = r.produs_id
      GROUP BY p.produs_id, p.nume_produs, p.categorie_id, p.marca, p.pret, 
               p.cantitate_stoc, p.descriere, p.imagine_url, c.nume_categorie
      ORDER BY numar_recenzii DESC, rating_mediu DESC
      LIMIT 10;
    `;

    console.log("SQL Query:", query);
    const result: QueryResult = await client.query(query);
    console.log("Results:", result.rows);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Eroare detaliată:", err); // Logare completă în server
    res.status(500).json({ 
        error: "Eroare internă de server!", 
        details: err instanceof Error ? err.message : JSON.stringify(err) 
    });
  } finally {
    client.release();
  }
};

export const findFiltered = async (req: Request, res: Response): Promise<void> => {
  const { categorie, minPrice, maxPrice, brand, stock } = req.query; // Extragem filtrele din query
  const client = await pool.connect();

  try {
    let query = `
      SELECT p.*, c.nume_categorie
      FROM Produse p
      LEFT JOIN Categorii c ON p.categorie_id = c.categorie_id
      WHERE 1=1
    `;
    const values = [];

    // Aplicăm filtrele
    if (categorie) {
      query += ` AND c.nume_categorie = $${values.length + 1}`;
      values.push(categorie);
    }

    if (minPrice) {
      query += ` AND p.pret >= $${values.length + 1}`;
      values.push(Number(minPrice));
    }

    if (maxPrice) {
      query += ` AND p.pret <= $${values.length + 1}`;
      values.push(Number(maxPrice));
    }

    if (brand) {
      query += ` AND p.marca = $${values.length + 1}`;
      values.push(brand);
    }

    if (stock === 'true') {
      query += ` AND p.cantitate_stoc > 0`;
    }

    console.log('Filtre primite:', { categorie, minPrice, maxPrice, brand, stock });
    console.log('Query generat:', query);
    console.log('Valori:', values);

    // Executăm interogarea
    const result: QueryResult = await client.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Eroare la filtrare:', err);
    res.status(500).json({ error: 'Eroare internă de server!' });
  } finally {
    client.release();
  }
};




export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query; // Preia cuvântul cheie din query params
  const client = await pool.connect();

  try {
    // Query SQL pentru căutare
    const sqlQuery = `
  SELECT p.*, c.nume_categorie
  FROM Produse p
  LEFT JOIN Categorii c ON p.categorie_id = c.categorie_id
  LEFT JOIN Specificatii s ON p.produs_id = s.produs_id
  WHERE 
    LOWER(COALESCE(p.nume_produs, '')) LIKE LOWER($1) OR
    LOWER(COALESCE(p.descriere, '')) LIKE LOWER($1) OR
    LOWER(COALESCE(p.marca, '')) LIKE LOWER($1) OR
    LOWER(COALESCE(c.nume_categorie, '')) LIKE LOWER($1) OR
    LOWER(COALESCE(s.procesor, '')) LIKE LOWER($1) OR
    LOWER(COALESCE(s.ram, '')) LIKE LOWER($1) OR
    LOWER(COALESCE(s.rom, '')) LIKE LOWER($1) OR
    LOWER(COALESCE(s.capacitate_baterie, '')) LIKE LOWER($1) OR
    LOWER(COALESCE(s.sistem_operare, '')) LIKE LOWER($1)
  ORDER BY p.nume_produs;
`;

const values = [`%${query}%`]; // Parametrii trimiși către query

console.log("SQL Query:", sqlQuery); // Log pentru debug
console.log("Query Params:", values);

const result: QueryResult = await client.query(sqlQuery, values); // Execută query-ul cu parametri
res.status(200).json(result.rows);
  } catch (err) {
    console.error("Eroare la căutare:", err);
    res.status(500).json({ error: "Eroare internă de server!" });
  } finally {
    client.release();
  }
};