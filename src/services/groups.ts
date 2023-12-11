import { Prisma } from "@prisma/client";
import prisma from "../utils/dbPrisma";
import * as events from "../services/events";

export const getAll = async (id_event: string) => {
  try {
    return await prisma.eventGroup.findMany({
      where: {
        id_event,
      },
    });
  } catch (error) {
    return false;
  }
};

type GetGroup = {
  id: string;
  id_event?: string;
};
export const getGroup = async (filters: GetGroup) => {
  try {
    return await prisma.eventGroup.findFirst({ where: filters });
  } catch (error) {
    return false;
  }
};

type AddGroup = Prisma.Args<typeof prisma.eventGroup, "create">["data"];
export const createGroup = async (data: AddGroup) => {
  try {
    if (!data.id_event) return false;
    const eventItem = await events.getOne(data.id_event);
    if (!eventItem) return false;

    return await prisma.eventGroup.create({
      data,
    });
  } catch (error) {
    return false;
  }
};

type UpdateFilters = {
  id: string;
  id_event?: string;
};
type UpdateGroup = Prisma.Args<typeof prisma.eventGroup, "update">["data"];
export const updateGroup = async (
  filters: UpdateFilters,
  data: UpdateGroup
) => {
  try {
    return await prisma.eventGroup.update({ where: filters, data });
  } catch (error) {
    return false;
  }
};

type DeleteFilters = { id: string; id_event?: string };
export const deleteGroup = async (filters: DeleteFilters) => {
  try {
    return await prisma.eventGroup.delete({
      where: filters,
    });
  } catch (error) {
    return false;
  }
};
