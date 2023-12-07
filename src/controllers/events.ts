import { RequestHandler } from "express";
import * as events from "../services/events";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string(),
  description: z.string(),
  grouped: z.boolean().optional(),
});

export const getAll: RequestHandler = async (req, res) => {
  const items = await events.getAll();
  if (items) return res.json({ events: items });

  return res.json({ error: "Ocorreu um erro." });
};

export const createEvent: RequestHandler = async (req, res) => {
  const parseEvent = eventSchema.safeParse(req.body);

  if (!parseEvent.success) {
    return res.status(422).json({ error: "Dados inválidados." });
  }
  const result = await events.createEvent(parseEvent.data);
  if (result) {
    return res.status(201).json({ message: "Evento criado com sucesso." });
  }
  return res.json({ error: "Ocorreu um erro na criação." });
};

export const getEvent: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const eventItem = await events.getOne(id);
  if (eventItem) return res.json({ event: eventItem });

  res.status(500).json({ error: "Ocorreu um erro." });
};
