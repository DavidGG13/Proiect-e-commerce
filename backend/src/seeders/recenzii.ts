import { QueryResult } from "pg";
import pool from "../config/database";
import { Recenzie } from "../models/recenzie";

export const seedRecenzii = async () => {
  const recenzii: Recenzie[] = [
    {
      recenzie_id: 1,
      utilizator_id: 1,
      produs_id: 1,
      rating: 5,
      comentariu: "Foarte bun",
      data_recenzie: new Date(),
    },
    {
      recenzie_id: 2,
      utilizator_id: 2,
      produs_id: 2,
      rating: 4,
      comentariu: "Bun",
      data_recenzie: new Date(),
    },
    {
      recenzie_id: 3,
      utilizator_id: 3,
      produs_id: 3,
      rating: 3,
      comentariu: "Ok",
      data_recenzie: new Date(),
    },
    {
      recenzie_id: 4,
      utilizator_id: 4,
      produs_id: 4,
      rating: 2,
      comentariu: "Nu imi place",
      data_recenzie: new Date(),
    },
    {
      recenzie_id: 5,
      utilizator_id: 5,
      produs_id: 5,
      rating: 1,
      comentariu: "Foarte slab",
      data_recenzie: new Date(),
    },
  ];

  const insertQuery = `
    INSERT INTO Recenzii (recenzie_id ,utilizator_id, produs_id, rating, comentariu, data_recenzie)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  for (const recenzie of recenzii) {
    const values = [
      recenzie.recenzie_id,
      recenzie.utilizator_id,
      recenzie.produs_id,
      recenzie.rating,
      recenzie.comentariu,
      recenzie.data_recenzie,
    ];

    try {
      const result: QueryResult = await pool.query(insertQuery, values);
      console.log(result.rows[0]);
    } catch (err) {
      console.error(err);
    }
  }
};
