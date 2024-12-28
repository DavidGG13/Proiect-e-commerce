import { QueryResult } from "pg";
import pool from "../config/database";
import { Specificatie } from "../models/specificatie";

export const seedSpecificatii = async () => {
  const specificatii: Specificatie[] = [
    {
      specificatie_id: 1,
      produs_id: 1,
      procesor: "Procesor 1",
      ram: "RAM 1",
      rom: "ROM 1",
      capacitate_baterie: "Capacitate baterie 1",
      sistem_operare: "Sistem de operare 1",
    },
    {
      specificatie_id: 2,
      produs_id: 2,
      procesor: "Procesor 2",
      ram: "RAM 2",
      rom: "ROM 2",
      capacitate_baterie: "Capacitate baterie 2",
      sistem_operare: "Sistem de operare 2",
    },
    {
      specificatie_id: 3,
      produs_id: 3,
      procesor: "Procesor 3",
      ram: "RAM 3",
      rom: "ROM 3",
      capacitate_baterie: "Capacitate baterie 3",
      sistem_operare: "Sistem de operare 3",
    },
    {
      specificatie_id: 4,
      produs_id: 4,
      procesor: "Procesor 4",
      ram: "RAM 4",
      rom: "ROM 4",
      capacitate_baterie: "Capacitate baterie 4",
      sistem_operare: "Sistem de operare 4",
    },
    {
      specificatie_id: 5,
      produs_id: 5,
      procesor: "Procesor 5",
      ram: "RAM 5",
      rom: "ROM 5",
      capacitate_baterie: "Capacitate baterie 5",
      sistem_operare: "Sistem de operare 5",
    },
    {
      specificatie_id: 6,
      produs_id: 6,
      procesor: "Procesor 6",
      ram: "RAM 6",
      rom: "ROM 6",
      capacitate_baterie: "Capacitate baterie 6",
      sistem_operare: "Sistem de operare 6",
    },
  ];
  const query = {
    text: `INSERT INTO Specificatii (specificatie_id, produs_id, procesor, ram, rom, capacitate_baterie, sistem_operare) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
  };
  for (const specificatie of specificatii) {
    const values = [
      specificatie.specificatie_id,
      specificatie.produs_id,
      specificatie.procesor,
      specificatie.ram,
      specificatie.rom,
      specificatie.capacitate_baterie,
      specificatie.sistem_operare,
    ];
    try {
      await pool.query(query, values);
    } catch (err) {
      console.error(err);
    }
  }
};
