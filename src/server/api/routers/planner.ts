import { ReadingStatus } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { isAuthenticated } from "~/server/middlewares/auth";
import { PlannerService } from "~/server/services/PlannerService";

export const plannerRouter = createTRPCRouter({
  getSchedulesByStatus: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        status: z.enum([
          ReadingStatus.READING_PLANNED,
          ReadingStatus.READING_IN_PROGRESS,
          ReadingStatus.READING_COMPLETED,
        ]),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await PlannerService.getSchedulesByStatus({
        userId: ctx.session.user.id,
        status: input.status,
      });
    }),

  addPlannedToRead: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        docId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await PlannerService.addPlannedToRead({
        docId: input.docId,
        userId: ctx.session.user.id,
      });
    }),

  updatePlan: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        id: z.number(),
        numOfPagesRead: z.number(),
        status: z.enum([
          ReadingStatus.READING_COMPLETED,
          ReadingStatus.READING_IN_PROGRESS,
          ReadingStatus.READING_PLANNED,
        ]),
      }),
    )
    .mutation(async ({ input }) => {
      return await PlannerService.updateSchedule(input);
    }),
});
