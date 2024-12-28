// CREATE TABLE IF NOT EXISTS Utilizatori (
//     utilizator_id SERIAL PRIMARY KEY,
//     nume VARCHAR(100),
//     email VARCHAR(100) UNIQUE,
//     parola VARCHAR(100),
//     rol VARCHAR(10),
//     adresa TEXT,
//     numar_telefon VARCHAR(15)
//   );

export interface Utilizator {
  utilizator_id?: number;
  nume: string;
  email: string;
  parola: string;
  rol: string;
  adresa: string;
  numar_telefon: string;
}
