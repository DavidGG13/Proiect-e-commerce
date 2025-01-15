import { Router } from "express";
import pool from '../config/database';
import { findAll, findById, create, update, remove } from "../crud/categorie";

const router = Router();

router.get("/", findAll);
router.get("/:id", findById);
router.post("/add", create);
router.patch("/update", update);
router.delete("/delete/:id", remove);

export default router;
