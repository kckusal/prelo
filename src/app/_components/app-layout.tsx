"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type FC, type ReactNode, useMemo, Fragment } from "react";
import toast, { Toaster } from "react-hot-toast";
import cx from "classnames";
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
    <div className=" sticky top-0 flex h-full max-h-[50px] items-center justify-between bg-gray-900 px-3 text-white">
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

const UserNavigation = () => {
  const pathname = usePathname();

  const navigationItems = useMemo(() => {
    const navItems: {
      label: string;
      href: "/dashboard" | "/my-documents" | "/my-account";
    }[] = [
      { label: "HOME", href: "/dashboard" },
      { label: "DOCUMENTS", href: "/my-documents" },
      { label: "PROFILE", href: "/my-account" },
    ];

    return navItems;
  }, []);

  return (
    <nav className="sticky top-[50px] flex h-[30px] items-center justify-center gap-4 bg-slate-200 px-3 text-xs">
      {navigationItems.map((nav) => (
        <Link
          key={nav.href}
          href={nav.href}
          className={cx("text-gray-800", {
            " font-extrabold": pathname === nav.href,
          })}
        >
          {nav.label}
        </Link>
      ))}
    </nav>
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
      toast.error(err?.message || "Something went wrong!");
      if (token) {
        removeToken();
      }
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
    <div key="AppLayout" className=" flex h-full flex-col">
      <Toaster />
      <Header />
      {token && <UserNavigation />}

      <main className=" mx-auto h-full min-h-[250px] w-full min-w-[250px] px-6 py-6 text-gray-700 md:p-8">
        {children}
      </main>
    </div>
  );
};
