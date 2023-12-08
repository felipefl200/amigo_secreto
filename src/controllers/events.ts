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

export const getEvent: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const eventItem = await events.getOne(id);
  if (eventItem) return res.json({ event: eventItem });

  res.status(500).json({ error: "Ocorreu um erro." });
};

export const createEvent: RequestHandler = async (req, res) => {
  const parseEvent = eventSchema.safeParse(req.body);

  if (!parseEvent.success)
    return res.status(422).json({ error: "Dados inválidados." });

  const result = await events.createEvent(parseEvent.data);
  if (result) {
    return res.status(201).json({ message: "Evento criado com sucesso." });
  }
  return res.json({ error: "Ocorreu um erro na criação." });
};

export const updateEvent: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const parseEvent = eventSchema.safeParse(req.body);

  if (!parseEvent.success)
    return res.status(422).json({ error: "Dados inválidados." });

  const result = await events.updateEvent(id, parseEvent.data);

  if (result)
    return res.status(200).json({ message: "Evento atualizado com sucesso." });

  return res
    .status(500)
    .json({ error: "Ocorreu um erro na atualização do evento." });
};

export const deleteEvent: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const result = await events.deleteEvent(id);

  if (result) return res.json({ message: "Evento exluído com sucesso." });

  return res
    .status(500)
    .json({ message: "Ocorreu um erro ao excluir o evento." });
};
