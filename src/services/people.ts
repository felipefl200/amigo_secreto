import { Prisma } from "@prisma/client";
import prisma from "../utils/dbPrisma";
import * as groups from "./groups";

type GetAllFilters = {
  id_event: string;
  id_group?: string;
};
export const getAll = async (filters: GetAllFilters) => {
  try {
    return await prisma.eventPeople.findMany({
      where: filters,
    });
  } catch (error) {
    return false;
  }
};

type GetPersonFilters = {
  id?: string;
  cpf?: string;
  id_event: string;
  id_group?: string;
};
export const getPerson = async (filters: GetPersonFilters) => {
  try {
    if (!filters.id && !filters.cpf) return false;
    return await prisma.eventPeople.findFirst({ where: filters });
  } catch (error) {
    return false;
    1;
  }
};

type PeopleCreate = Prisma.Args<typeof prisma.eventPeople, "create">["data"];
export const createPerson = async (data: PeopleCreate) => {
  try {
    if (!data.id_group) return false;
    const group = await groups.getGroup({
      id: data.id_group,
      id_event: data.id_event,
    });
    if (!group) return false;

    return await prisma.eventPeople.create({ data });
  } catch (error) {
    return false;
  }
};

type PeopleUpdate = Prisma.Args<typeof prisma.eventPeople, "update">["data"];
type UpdateFilters = {
  id?: string;
  id_event: string;
  id_group?: string;
};
export const updatePeople = async (
  filters: UpdateFilters,
  data: PeopleUpdate
) => {
  try {
    return await prisma.eventPeople.updateMany({ where: filters, data });
  } catch (error) {
    return false;
  }
};

type DeleteFilters = {
  id: string;
  id_event?: string;
  id_group?: string;
};
export const deletePerson = async (filters: DeleteFilters) => {
  try {
    return await prisma.eventPeople.delete({ where: filters });
  } catch (error) {
    return false;
  }
};
