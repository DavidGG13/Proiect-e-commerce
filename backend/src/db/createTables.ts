import pool from "../config/database";

const createTables = async () => {
  const queries = [
    `
    CREATE TABLE IF NOT EXISTS Utilizatori (
      utilizator_id SERIAL PRIMARY KEY,
      nume VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      parola VARCHAR(100),
      rol VARCHAR(10),
      adresa TEXT,
      numar_telefon VARCHAR(15)
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS Categorii (
      categorie_id SERIAL PRIMARY KEY,
      nume_categorie VARCHAR(50)
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS Produse (
      produs_id SERIAL PRIMARY KEY,
      nume_produs VARCHAR(100),
      categorie_id INT REFERENCES Categorii(categorie_id),
      marca VARCHAR(50),
      pret DECIMAL(10, 2),
      cantitate_stoc INT,
      descriere TEXT
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS Comenzi (
      comanda_id SERIAL PRIMARY KEY,
      utilizator_id INT REFERENCES Utilizatori(utilizator_id),
      data_comanda TIMESTAMP,
      pret_total DECIMAL(10, 2),
      adresa_livrare TEXT,
      status VARCHAR(20)
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS ProduseComanda (
      produs_comanda_id SERIAL PRIMARY KEY,
      comanda_id INT REFERENCES Comenzi(comanda_id),
      produs_id INT REFERENCES Produse(produs_id),
      cantitate INT,
      pret_la_momentul_comenzii DECIMAL(10, 2)
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS Recenzii (
      recenzie_id SERIAL PRIMARY KEY,
      utilizator_id INT REFERENCES Utilizatori(utilizator_id),
      produs_id INT REFERENCES Produse(produs_id),
      rating INT CHECK (rating BETWEEN 1 AND 5),
      comentariu TEXT,
      data_recenzie TIMESTAMP
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS Specificatii (
      specificatie_id SERIAL PRIMARY KEY,
      produs_id INT REFERENCES Produse(produs_id),
      procesor VARCHAR(100),
      ram VARCHAR(50),
      rom VARCHAR(50),
      capacitate_baterie VARCHAR(50),
      sistem_operare VARCHAR(50)
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS SpecificatiiDisplay (
      specificatie_display_id SERIAL PRIMARY KEY,
      produs_id INT REFERENCES Produse(produs_id),
      dimensiune_ecran VARCHAR(50),
      rezolutie VARCHAR(50),
      tip_panou VARCHAR(50),
      rata_refresh VARCHAR(50)
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS SpecificatiiCamera (
      specificatie_camera_id SERIAL PRIMARY KEY,
      produs_id INT REFERENCES Produse(produs_id),
      camera_principala VARCHAR(50),
      camera_frontala VARCHAR(50),
      rezolutie_video VARCHAR(50)
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS Inventar (
      inventar_id SERIAL PRIMARY KEY,
      produs_id INT REFERENCES Produse(produs_id),
      cantitate_inventar INT,
      locatie_stoc VARCHAR(100)
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS Favorite (
      utilizator_id INT REFERENCES Utilizatori(utilizator_id),
      produs_id INT REFERENCES Produse(produs_id),
      PRIMARY KEY (utilizator_id, produs_id)
    );
    `,
  ];

  try {
    for (const query of queries) {
      await pool.query(query);
      console.log("Tabel creat cu succes.");
    }
  } catch (err) {
    console.error("Eroare la crearea tabelelor:", err);
  } finally {
    pool.end();
  }
};

createTables();
