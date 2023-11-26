"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type FC, type ReactNode, useMemo, Fragment } from "react";
import { Toaster } from "react-hot-toast";
import { useAuthToken, useAuthUser } from "../_store/auth";
import { Link } from "./page-utils";
import {
  REDIRECT_FOR_AUTH_ROUTE,
  NON_PROTECTED_ROUTES,
  REDIRECT_AFTER_AUTH_ROUTE,
} from "../_config/default";
import { api } from "~/trpc/react";

const Header = () => {
  const { token } = useAuthToken();

  return (
    <div className=" flex h-[50px] items-center justify-between bg-gray-900 px-3 text-white">
      <Link
        href="/dashboard"
        className=" text-white hover:text-gray-200 hover:no-underline"
      >
        <h1 className=" text-xl font-extrabold">PReLO</h1>
      </Link>

      {token ? (
        <Link href="/auth/logout" className=" text-white hover:text-gray-300">
          Logout
        </Link>
      ) : (
        <div className=" text-sm">Login to continue.</div>
      )}
    </div>
  );
};

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const { token, removeToken } = useAuthToken();
  const { user, setUser } = useAuthUser();
  const pathName = usePathname();
  const router = useRouter();

  const getMe = api.auth.me.useMutation({
    onSuccess: (data) => {
      if (data.user) {
        setUser(data.user);
      }
    },
    onError: (err) => {
      console.log({ err });
      // removeToken();
    },
  });

  const redirectUrl = useMemo(() => {
    const isProtectedRoute = !NON_PROTECTED_ROUTES.includes(pathName);
    if (isProtectedRoute) {
      if (!token) {
        return REDIRECT_FOR_AUTH_ROUTE;
      }
    } else {
      if (token) {
        return REDIRECT_AFTER_AUTH_ROUTE;
      }
    }
  }, [pathName, token]);

  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl, router]);

  useEffect(() => {
    if (!token) return;
    // get user details
    getMe.mutate({ authToken: token });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  console.log({ user });

  if (redirectUrl) {
    return <Fragment key="AppLayout"></Fragment>;
  }

  return (
    <div key="AppLayout" className=" flex flex-col">
      <Toaster />
      <Header />

      <main className=" mx-auto min-h-[250px] min-w-[250px] max-w-[600px] bg-slate-100 px-6 py-6 text-gray-700 md:p-8">
        {children}
      </main>
    </div>
  );
};
