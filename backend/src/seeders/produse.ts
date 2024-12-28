// seeder pentru produse

import { QueryResult } from "pg";
import pool from "../config/database";
import { Produs } from "../models/produs";

export const seedProduse = async () => {
  const produse: Produs[] = [
    {
      produs_id: 1,
      nume_produs: "Produs 1",
      categorie_id: 1,
      marca: "Marca 1",
      pret: 100,
      cantitate_stoc: 10,
      descriere: "Descriere produs 1",
    },
    {
      produs_id: 2,
      nume_produs: "Produs 2",
      categorie_id: 2,
      marca: "Marca 2",
      pret: 200,
      cantitate_stoc: 20,
      descriere: "Descriere produs 2",
    },
    {
      produs_id: 3,
      nume_produs: "Produs 3",
      categorie_id: 3,
      marca: "Marca 3",
      pret: 300,
      cantitate_stoc: 30,
      descriere: "Descriere produs 3",
    },
    {
      produs_id: 4,
      nume_produs: "Produs 4",
      categorie_id: 4,
      marca: "Marca 4",
      pret: 400,
      cantitate_stoc: 40,
      descriere: "Descriere produs 4",
    },
    {
      produs_id: 5,
      nume_produs: "Produs 5",
      categorie_id: 5,
      marca: "Marca 5",
      pret: 500,
      cantitate_stoc: 50,
      descriere: "Descriere produs 5",
    },
    {
      produs_id: 6,
      nume_produs: "Produs 6",
      categorie_id: 6,
      marca: "Marca 6",
      pret: 600,
      cantitate_stoc: 60,
      descriere: "Descriere produs 6",
    },
  ];
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM Produse;");

    for (const produs of produse) {
      const queryText = `INSERT INTO Produse(produs_id ,nume_produs, categorie_id, marca, pret, cantitate_stoc, descriere) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
      const result: QueryResult = await client.query(queryText, [
        produs.produs_id,
        produs.nume_produs,
        produs.categorie_id,
        produs.marca,
        produs.pret,
        produs.cantitate_stoc,
        produs.descriere,
      ]);
      const dbProdus = result.rows[0];
      console.log(`Produs seed: ${dbProdus.nume_produs}`);
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
  } finally {
    client.release();
  }
};
