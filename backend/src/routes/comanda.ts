import { Router } from "express";
import pool from '../config/database';
import { findAll, findById, update, remove } from "../crud/comanda";

const router = Router();

// 1. Găsește toate comenzile
router.get("/", findAll);

// 2. Găsește o comandă după ID
router.get("/:id", findById);

// 3. Plasează o comandă nouă
router.post('/place', async (req, res) => {
  const { utilizator_id, adresa_livrare, produse } = req.body;

  

  const client = await pool.connect(); // Conectare la baza de date
  try {
    await client.query('BEGIN'); // Începem tranzacția

    // 1. Inserăm comanda în tabela Comenzi
    const queryComanda = `
      INSERT INTO Comenzi (utilizator_id, data_comanda, pret_total, adresa_livrare, status)
      VALUES ($1, NOW(), 0, $2, 'In curs de procesare')
      RETURNING *;
    `;
    const resultComanda = await client.query(queryComanda, [utilizator_id, adresa_livrare]);
    const comandaId = resultComanda.rows[0].comanda_id; // Preluăm ID-ul comenzii

    // 2. Inserăm produsele în tabela ProduseComanda
    let pretTotal = 0;
    for (const produs of produse) {
      const { produs_id, cantitate, pret } = produs; // Preluăm datele produsului

      const queryProdus = `
        INSERT INTO ProduseComanda (comanda_id, produs_id, cantitate, pret_la_momentul_comenzii)
        VALUES ($1, $2, $3, $4);
      `;
      await client.query(queryProdus, [comandaId, produs_id, cantitate, pret]);

      // Calculăm prețul total
      pretTotal += cantitate * pret;
    }

    // 3. Actualizăm prețul total în tabelul Comenzi
    await client.query(
      `UPDATE Comenzi SET pret_total = $1 WHERE comanda_id = $2;`,
      [pretTotal, comandaId]
    );

    await client.query('COMMIT'); // Confirmăm tranzacția
    res.status(201).json({ message: 'Comanda plasată cu succes!', comandaId });
  } catch (error) {
    await client.query('ROLLBACK'); // Revenim dacă apare o eroare
    console.error('Eroare la plasarea comenzii:', error);
    res.status(500).json({ error: 'Eroare la plasarea comenzii!' });
  } finally {
    client.release(); // Eliberăm conexiunea
  }
});

// 4. Actualizează o comandă
router.patch("/update", update);

// 5. Șterge o comandă
router.delete("/delete", remove);

export default router;
