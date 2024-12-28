import { QueryResult } from "pg";
import pool from "../config/database";
import { Categorie } from "../models/categorie";

export const seedCategorii = async () => {
  const categorii: Categorie[] = [
    { categorie_id: 1, nume_categorie: "Categorie 1" },
    { categorie_id: 2, nume_categorie: "Categorie 2" },
    { categorie_id: 3, nume_categorie: "Categorie 3" },
    { categorie_id: 4, nume_categorie: "Categorie 4" },
    { categorie_id: 5, nume_categorie: "Categorie 5" },
    { categorie_id: 6, nume_categorie: "Categorie 6" },
  ];

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const categorie of categorii) {
      const queryText = `INSERT INTO Categorii(categorie_id,nume_categorie) VALUES($1, $2) RETURNING *`;
      const result: QueryResult = await client.query(queryText, [
        categorie.categorie_id,
        categorie.nume_categorie,
      ]);
      const dbCategorie = result.rows[0];
      console.log(`Categorie seed: ${dbCategorie.nume_categorie}`);
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
  } finally {
    client.release();
  }
};
