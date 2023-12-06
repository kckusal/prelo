import { type Schedule } from "@prisma/client";
import { db } from "../db";

export class PlannerService {
  static getSchedulesByStatus(input: Pick<Schedule, "userId" | "status">) {
    return db.schedule.findMany({
      select: {
        id: true,
        numOfPagesRead: true,
        status: true,
        document: true,
        createdAt: true,
      },
      where: input,
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  static addPlannedToRead({
    docId,
    userId,
  }: {
    docId: number;
    userId: number;
  }) {
    return db.schedule.create({
      data: {
        documentId: docId,
        userId: userId,
        numOfPagesRead: 0,
        status: "READING_PLANNED",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  static updateSchedule(
    input: Pick<Schedule, "id" | "numOfPagesRead" | "status">,
  ) {
    const { id, status, numOfPagesRead } = input;

    return db.schedule.update({
      data: { status, numOfPagesRead, updatedAt: new Date() },
      where: { id },
    });
  }
}
