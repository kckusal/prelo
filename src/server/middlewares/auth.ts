import { TRPCError } from "@trpc/server";
import { middleware } from "../api/trpc";
import { verifyJwt } from "../utils/auth";
import { type Session } from "../types";

export const isAuthenticated = middleware(({ next, ctx }) => {
  const token = ctx.headers.get("x-auth-token");

  let session: Session | null;
  try {
    if (!token) throw new Error("Missing auth token!");
    session = verifyJwt<Session>({
      token,
      configName: "jwtSigningSecretKey",
    });

    if (!session?.user) throw new Error("Invalid token");
  } catch (e) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({
    ctx: {
      session,
    },
  });
});
