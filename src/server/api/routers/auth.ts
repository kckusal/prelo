import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { AuthService } from "~/server/services/AuthService";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => AuthService.login(ctx, input)),

  register: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string().optional(),
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => AuthService.register(input)),
});
