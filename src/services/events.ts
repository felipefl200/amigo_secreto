import prisma from "../utils/dbPrisma";
import { Prisma } from "@prisma/client";
import * as people from "./people";
import * as groups from "./groups";
import { encryptMatch } from "../utils/match";

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

export const doMatches = async (id: string): Promise<boolean> => {
  const eventItem = await prisma.event.findFirst({
    where: { id },
    select: { grouped: true },
  });
  if (eventItem) {
    const peopleList = await people.getAll({ id_event: id });
    if (peopleList) {
      let sortedList: { id: string; match: string }[] = [];
      let sortable: string[] = [];

      let attemps = 0;
      let maxAttemps = peopleList.length;
      let keepTrying = true;

      while (keepTrying && attemps < maxAttemps) {
        keepTrying = false;
        attemps++;
        sortable = peopleList.map((item) => item.id);

        for (let i in peopleList) {
          let sortableFiltered: string[] = sortable;
          if (eventItem.grouped) {
            sortableFiltered = sortable.filter((sortableItem) => {
              let sortablePerson = peopleList.find(
                (item) => item.id === sortableItem
              );
              return peopleList[i].id_group !== sortablePerson?.id_group;
            });
          }
          if (
            sortableFiltered.length === 0 ||
            (sortableFiltered.length === 1 &&
              peopleList[i].id === sortableFiltered[0])
          ) {
            keepTrying = true;
          } else {
            let sortedIndex = Math.floor(
              Math.random() * sortableFiltered.length
            );
            while (sortableFiltered[sortedIndex] === peopleList[i].id) {
              sortedIndex = Math.floor(Math.random() * sortableFiltered.length);
            }
            sortedList.push({
              id: peopleList[i].id,
              match: sortableFiltered[sortedIndex],
            });
            sortable = sortable.filter(
              (item) => item !== sortableFiltered[sortedIndex]
            );
          }
        }
      }
      // console.log(`ATTEMPS: ${attemps}`);
      // console.log(`MAX ATTEMPS: ${maxAttemps}`);
      // console.log(sortedList);

      if (attemps < maxAttemps) {
        for (let i in sortedList) {
          await people.updatePeople(
            {
              id: sortedList[i].id,
              id_event: id,
            },
            { matched: encryptMatch(sortedList[i].match) }
          );
        }
        return true;
      }
    }
  }
  return false;
};
