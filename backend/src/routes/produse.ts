import { Router } from "express";

import { findAll, findById, create, update, remove } from "../crud/produs";

const router = Router();

router.get("/", findAll);
router.get("/:id", findById);
router.post("/add", create);
router.patch("/update/:id", update);
router.delete("/delete", remove);

export default router;
