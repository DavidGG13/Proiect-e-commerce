import { QueryResult } from "pg";
import pool from "../config/database";
import { Inventar } from "../models/invetar";

const inventar: Inventar[] = [
  {
    inventar_id: 1,
    produs_id: 1,
    cantitate_inventar: 10,
    locatie_stoc: "Magazin",
  },
  {
    inventar_id: 2,
    produs_id: 2,
    cantitate_inventar: 5,
    locatie_stoc: "Magazin",
  },
  {
    inventar_id: 3,
    produs_id: 3,
    cantitate_inventar: 15,
    locatie_stoc: "Magazin",
  },
  {
    inventar_id: 4,
    produs_id: 4,
    cantitate_inventar: 20,
    locatie_stoc: "Magazin",
  },
  {
    inventar_id: 5,
    produs_id: 5,
    cantitate_inventar: 25,
    locatie_stoc: "Magazin",
  },
];

export const seedInventar = async () => {
  const query = `INSERT INTO inventar (inventar_id,produs_id, cantitate_inventar, locatie_stoc) VALUES ($1, $2, $3, $4) RETURNING *`;
  inventar.forEach(async (inventar) => {
    const values = [
      inventar.inventar_id,
      inventar.produs_id,
      inventar.cantitate_inventar,
      inventar.locatie_stoc,
    ];
    try {
      const res: QueryResult = await pool.query(query, values);
      console.log(res.rows[0]);
    } catch (err) {
      console.error(err);
    }
  });
};
