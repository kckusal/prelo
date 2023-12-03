"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  type TRPCLink,
  loggerLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useMemo, useState } from "react";

import { type AppRouter } from "~/server/api/root";
import { getUrl, transformer } from "./shared";
import { clearTokenFromLocalstorage, useAuthToken } from "~/app/_store/auth";
import { observable } from "@trpc/server/observable";

export const api = createTRPCReact<AppRouter>();

export const customLink: TRPCLink<AppRouter> = () => {
  // here we just got initialized in the app - this happens once per app
  // useful for storing cache for instance
  return ({ next, op }) => {
    // this is when passing the result to the next link
    // each link needs to return an observable which propagates results
    return observable((observer) => {
      console.log("performing operation:", op);
      const unsubscribe = next(op).subscribe({
        next(value) {
          observer.next(value);
        },
        error(err) {
          observer.error(err);
          if (err?.data?.code === "UNAUTHORIZED") {
            clearTokenFromLocalstorage();
            const win: Window = window;
            win.location = "/auth/login";
          }
        },
        complete() {
          observer.complete();
        },
      });
      return unsubscribe;
    });
  };
};

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  cookies: string;
}) {
  const { token } = useAuthToken();
  const [queryClient] = useState(() => new QueryClient());

  const trpcClient = useMemo(
    () =>
      api.createClient({
        transformer,
        links: [
          customLink,
          loggerLink({
            enabled: (op) =>
              process.env.NODE_ENV === "development" ||
              (op.direction === "down" && op.result instanceof Error),
          }),
          unstable_httpBatchStreamLink({
            url: getUrl(),
            headers() {
              return {
                cookie: props.cookies,
                "x-trpc-source": "react",
                "x-auth-token": token ?? undefined,
              };
            },
          }),
        ],
      }),
    [props.cookies, token],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
