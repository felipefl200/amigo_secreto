import { RequestHandler } from "express";
import * as people from "../services/people";
import { string, z } from "zod";
import { decryptMatch } from "../utils/match";

export const getAll: RequestHandler = async (req, res) => {
  const { id_event, id_group } = req.params;
  const items = await people.getAll({
    id_event,
    id_group,
  });
  if (!items)
    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao obter os dados." });

  return res.json({ people: items });
};

export const searchPerson: RequestHandler = async (req, res) => {
  const { id_event } = req.params;
  const searchPersonSchema = z.object({
    cpf: z.string().transform((val) => val.replace(/\.|-/gm, "")),
  });
  const cpf = searchPersonSchema.safeParse(req.query);

  if (!cpf.success) return res.status(422).json({ error: "Dados inválidos." });

  const personItem = await people.getPerson({
    id_event,
    cpf: cpf.data.cpf,
  });
  if (personItem && personItem.matched) {
    const matchId = decryptMatch(personItem.matched);
    const personMatched = await people.getPerson({
      id_event,
      id: matchId,
    });
    if (personMatched)
      return res.json({
        person: { id: personItem.id, name: personItem.name },
        personMatched: {
          id: personMatched.id,
          name: personMatched.name,
        },
      });
  }
  return res
    .status(500)
    .json({ error: "Ocorreu um erro na busca do usuário." });
};

export const getPerson: RequestHandler = async (req, res) => {
  const { id, id_event, id_group } = req.params;
  const person = await people.getPerson({ id, id_event, id_group });

  if (!person)
    return res.status(500).json({ error: "Erro ao pegar informações." });
};

export const createPeople: RequestHandler = async (req, res) => {
  const { id_event, id_group } = req.params;

  const addPersonSchema = z.object({
    name: z.string(),
    cpf: z.string().transform((val) => val.replace(/\.|-/gm, "")),
  });
  const body = addPersonSchema.safeParse(req.body);

  if (!body.success) return res.status(422).json({ error: "Dados inválidos." });
  const newPerson = await people.createPerson({
    name: body.data.name,
    cpf: body.data.cpf,
    id_event,
    id_group,
  });

  if (newPerson)
    return res
      .status(201)
      .json({ message: "Pessoa adicionada.", person: newPerson });

  return res.status(500).json("Ocorreu um erro na criação da pessoa.");
};

export const updatePerson: RequestHandler = async (req, res) => {
  const { id, id_event, id_group } = req.params;
  const updatePersonSchema = z.object({
    name: z.string().optional(),
    cpf: string()
      .transform((val) => val.replace(/\.|-/gm, ""))
      .optional(),
    matched: z.string().optional(),
  });
  const body = updatePersonSchema.safeParse(req.body);
  if (!body.success) return res.status(422).json({ error: "Dados inválidos." });

  const updatedPerson = await people.updatePeople(
    { id, id_event, id_group },
    body.data
  );
  if (!updatedPerson)
    return res.status(500).json({ error: "Ocorreu um erro." });

  const personItem = await people.getPerson({ id, id_event });
  return res.json({
    message: "Dados atualizados com sucesso.",
    person: personItem,
  });
};

export const deletePerson: RequestHandler = async (req, res) => {
  const { id, id_event, id_group } = req.params;
  const deletedPerson = await people.deletePerson({
    id,
    id_event,
    id_group,
  });
  if (deletedPerson)
    return res.json({
      message: "Pessoa deletada com sucesso.",
      person: deletedPerson,
    });

  return res.json({ message: "Ocorreu um erro ao deletar uma pessoa." });
};
