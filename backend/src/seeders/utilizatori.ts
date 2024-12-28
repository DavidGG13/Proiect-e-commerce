import { QueryResult } from "pg";
import pool from "../config/database";
import { Utilizator } from "../models/utilizator";

const utilizatori: Utilizator[] = [
  {
    utilizator_id: 1,
    nume: "Admin",
    email: "ceva@gmail.com",
    parola: "admin",
    rol: "admin",
    adresa: "Str. Admin, Nr. 1",
    numar_telefon: "0722222222",
  },
  {
    utilizator_id: 2,
    nume: "User",
    email: "ceva1@gmail.com",
    parola: "user",
    rol: "user",
    adresa: "Str. User, Nr. 1",
    numar_telefon: "0722222223",
  },
  {
    utilizator_id: 3,
    nume: "User2",
    email: "ceva2@gmail.com",
    parola: "user2",
    rol: "user",
    adresa: "Str. User2, Nr. 1",
    numar_telefon: "0722222224",
  },
  {
    utilizator_id: 4,
    nume: "User3",
    email: "ceva3@gmail.com",
    parola: "user3",
    rol: "user",
    adresa: "Str. User3, Nr. 1",
    numar_telefon: "0722222225",
  },
  {
    utilizator_id: 5,
    nume: "User4",
    email: "ceva4@gmail.com",
    parola: "user4",
    rol: "user",
    adresa: "Str. User4, Nr. 1",
    numar_telefon: "0722222226",
  },
];

export const seedUtilizatori = async () => {
  const insertQuery = `
    INSERT INTO Utilizatori (utilizator_id ,nume, email, parola, rol, adresa, numar_telefon)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  for (const utilizator of utilizatori) {
    const values = [
      utilizator.utilizator_id,
      utilizator.nume,
      utilizator.email,
      utilizator.parola,
      utilizator.rol,
      utilizator.adresa,
      utilizator.numar_telefon,
    ];

    try {
      const result: QueryResult = await pool.query(insertQuery, values);
      console.log(result.rows[0]);
    } catch (error) {
      console.error(error);
    }
  }
};
