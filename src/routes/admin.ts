import { Router } from "express";
import * as auth from "../controllers/auth";

const router = Router();
router.get("/ping", auth.validade, (req, res) =>
  res.json({ pong: true, admin: true })
);
router.post("/login", auth.login);

export default router;
