import { DocumentType } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { isAuthenticated } from "~/server/middlewares/auth";
import { DocumentService } from "~/server/services/DocumentService";

export const documentRouter = createTRPCRouter({
  addNew: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        type: z.enum([DocumentType.BOOK]),
        title: z
          .string()
          .max(200, "Title cannot be more than 200 chars!")
          .min(3),
        description: z.string(),
        numOfPages: z.number(),
        author: z.string(),
        publishedDate: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await DocumentService.addNew({
        ...input,
        createdAt: new Date(),
        createdByUserId: ctx.session.user.id,
      });
    }),

  getMyDocuments: publicProcedure
    .use(isAuthenticated)
    .query(async ({ ctx }) => {
      return await DocumentService.findDocumentsByUser(ctx.session.user.id);
    }),
});
