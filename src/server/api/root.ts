import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { documentRouter } from "./routers/document";
import { plannerRouter } from "./routers/planner";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  document: documentRouter,
  planner: plannerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
