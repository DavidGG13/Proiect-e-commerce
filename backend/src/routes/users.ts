import { Router } from "express";
import {
  getAll,
  getById,
  register,
  login,
  update,
  remove,
  smth,
} from "../crud/auth";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/register", register);
router.post("/login", login);
router.patch("/update/:id", update);
router.delete("/delete/:id", remove);
router.get("/ceva", smth);

export default router;
