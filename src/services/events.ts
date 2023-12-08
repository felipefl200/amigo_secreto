import prisma from "../utils/dbPrisma";
import { Prisma } from "@prisma/client";

export const getAll = async () => {
  try {
    return await prisma.event.findMany();
  } catch (error) {
    return false;
  }
};

export const getOne = async (id: string) => {
  try {
    return await prisma.event.findFirst({
      where: {
        id,
      },
    });
  } catch (error) {
    return false;
  }
};

type EventsCreateData = Prisma.Args<typeof prisma.event, "create">["data"];
export const createEvent = async (data: EventsCreateData) => {
  try {
    return await prisma.event.create({ data });
  } catch (error) {
    return false;
  }
};

type EventsUpdateData = Prisma.Args<typeof prisma.event, "update">["data"];
export const updateEvent = async (id: string, data: EventsUpdateData) => {
  try {
    return await prisma.event.update({
      data,
      where: { id },
    });
  } catch (error) {
    return false;
  }
};

export const deleteEvent = async (id: string) => {
  try {
    return await prisma.event.delete({
      where: { id },
    });
  } catch (error) {
    return false;
  }
};
