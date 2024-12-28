import { QueryResult } from "pg";
import pool from "../config/database";
import { Comanda } from "../models/comanda";

export const seedComenzi = async () => {
  const comenzi: Comanda[] = [
    {
      comanda_id: 1,
      utilizator_id: 1,
      data_comanda: new Date(),
      pret_total: 100,
      adresa_livrare: "Adresa 1",
      status: "In curs de procesare",
    },
    {
      comanda_id: 2,
      utilizator_id: 2,
      data_comanda: new Date(),
      pret_total: 200,
      adresa_livrare: "Adresa 2",
      status: "In curs de procesare",
    },
    {
      comanda_id: 3,
      utilizator_id: 3,
      data_comanda: new Date(),
      pret_total: 300,
      adresa_livrare: "Adresa 3",
      status: "In curs de procesare",
    },
    {
      comanda_id: 4,
      utilizator_id: 4,
      data_comanda: new Date(),
      pret_total: 400,
      adresa_livrare: "Adresa 4",
      status: "In curs de proces",
    },
    {
      comanda_id: 5,
      utilizator_id: 5,
      data_comanda: new Date(),
      pret_total: 500,
      adresa_livrare: "Adresa 5",
      status: "In curs de procesare",
    },
  ];

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const comanda of comenzi) {
      const queryText = `INSERT INTO Comenzi(comanda_id ,utilizator_id, data_comanda, pret_total, adresa_livrare, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
      const result: QueryResult = await client.query(queryText, [
        comanda.comanda_id,
        comanda.utilizator_id,
        comanda.data_comanda,
        comanda.pret_total,
        comanda.adresa_livrare,
        comanda.status,
      ]);
      console.log(result.rows[0]);
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
  } finally {
    client.release();
  }
};
