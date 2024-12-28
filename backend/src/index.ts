import express from "express";
import dotenv from "dotenv";
import pool from "./config/database";
import userRoute from "./routes/users";
import catRoute from "./routes/categorii";
import comRoute from "./routes/comanda";
import prodRoute from "./routes/produse";
import recRoute from "./routes/recenzie";
import invRoute from "./routes/inventar";
import speRoute from "./routes/specificatii";
import { seedCategorii } from "./seeders/categorii";
import { seedProduse } from "./seeders/produse";
import { seedUtilizatori } from "./seeders/utilizatori";
import { seedComenzi } from "./seeders/comenzi";
import { seedRecenzii } from "./seeders/recenzii";
import { seedInventar } from "./seeders/inventar";
import { seedSpecificatii } from "./seeders/specificatii";

import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/user", userRoute);
app.use("/cat", catRoute);
app.use("/rec", recRoute);
app.use("/com", comRoute);
app.use("/prod", prodRoute);
app.use("/inv", invRoute);
app.use("/spec", speRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Test database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Database connected:", res.rows[0]);

    // pool.query("DELETE FROM utilizatori");
    //     pool.query("DELETE FROM recenzii");
    // pool.query("DELETE FROM comenzi");
    //     pool.query("DELETE FROM produse");
    //     pool.query("DELETE FROM categorii");
    // pool.query("DELETE FROM inventar");
    //     pool.query("DELETE FROM specificatii");

    // run the seeders

  // seedUtilizatori();
   // seedCategorii();
    // seedProduse();
  ///  seedComenzi();
   // seedRecenzii();
  //  seedInventar();
   // seedSpecificatii();
  }
});
