import { RequestHandler } from "express";
import * as groups from "../services/groups";
import { z } from "zod";

export const getAll: RequestHandler = async (req, res) => {
  const { id_event } = req.params;
  const items = await groups.getAll(id_event);
  if (items) return res.json({ groups: items });

  return res.json({ error: "Ocorreu um erro ao buscar os grupos" });
};

export const getGroup: RequestHandler = async (req, res) => {
  const { id_event, id } = req.params;
  const group = await groups.getGroup({ id_event, id });
  if (group) {
    return res.status(200).json({ group });
  }
  return res.status(500).json({ error: "Ocorreu um erro." });
};

export const createGroup: RequestHandler = async (req, res) => {
  const { id_event } = req.params;
  const createGroupSchema = z.object({
    name: z.string(),
  });
  const body = createGroupSchema.safeParse(req.body);

  if (!body.success) return res.json({ error: "Dados inválidos." });

  const newGroup = await groups.createGroup({ id_event, name: body.data.name });
  if (newGroup)
    return res.status(201).json({ message: "Grupo criado com sucesso." });

  return res.status(500).json({ error: "Ocorreu um erro ao criar o grupo." });
};

export const updateGroup: RequestHandler = async (req, res) => {
  const { id, id_event } = req.params;
  const updateGroupSchema = z.object({
    name: z.string().optional(),
  });
  const body = updateGroupSchema.safeParse(req.body);
  if (!body.success) return res.status(422).json({ error: "Dados inválidos" });
  const updatedGroup = await groups.updateGroup({ id, id_event }, body.data);

  if (updatedGroup)
    return res.json({ message: "Grupo atualizado com sucesso." });

  return res
    .status(500)
    .json({ error: "Ocorreu um erro ao atualizar o grupo." });
};

export const deleteGroup: RequestHandler = async (req, res) => {
  const { id, id_event } = req.params;
  const deletedGroup = await groups.deleteGroup({ id, id_event });
  if (!deletedGroup)
    return res.json({ error: "Ocorreu um erro ao deletar o grupo." });

  return res.json({
    message: "Grupo deletado com sucesso.",
    group: deleteGroup,
  });
};
