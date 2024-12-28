import { Router } from "express";

import { findAll, findById, create, update, remove } from "../crud/inventar";

const router = Router();

router.get("/", findAll);
router.get("/:id", findById);
router.post("/add", create);
router.patch("/update", update);
router.delete("/delete", remove);

export default router;
