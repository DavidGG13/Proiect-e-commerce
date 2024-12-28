import { Router } from "express";

import { get, getById, create, update, remove } from "../crud/specificatie";

const router = Router();

router.get("/", get);
router.get("/:id", getById);
router.post("/add", create);
router.patch("/update", update);
router.delete("/delete", remove);

export default router;
