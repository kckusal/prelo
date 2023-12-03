"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useMemo, useState } from "react";

import { type AppRouter } from "~/server/api/root";
import { getUrl, transformer } from "./shared";
import { useAuthToken } from "~/app/_store/auth";

export const api = createTRPCReact<AppRouter>();

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
