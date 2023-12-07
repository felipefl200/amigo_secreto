import { RequestHandler } from "express";
import { createToken, validatePassword, validateToken } from "../services/auth";
import { z } from "zod";

export const login: RequestHandler = (req, res) => {
  const loginSchema = z.object({
    password: z.string(),
  });
  console.log("teste");

  const body = loginSchema.safeParse(req.body);
  if (!body.success) return res.json({ error: "Dados inválidos." });

  // Validar a senha e gerar o token
  if (validatePassword(body.data.password)) {
    return res.json({
      token: createToken(),
    });
  }

  return res.status(403).json({ error: "Acesso negado." });
};

export const validade: RequestHandler = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ error: "Acesso negado." });
  }
  const token = req.headers.authorization.split(" ")[1];

  if (!validateToken(token)) {
    return res.status(403).json({ error: "Acesso negado." });
  }
  next();
};
