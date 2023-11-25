"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { REDIRECT_FOR_AUTH_ROUTE } from "~/app/_config/default";
import { useAuthToken } from "~/app/_store/auth";

export default () => {
  const router = useRouter();
  const { token, removeToken } = useAuthToken();

  removeToken();

  const redirectUrl = useMemo(() => {
    console.log({ token });
    if (token) {
      return REDIRECT_FOR_AUTH_ROUTE;
    }
  }, [token]);

  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [router, redirectUrl]);

  return null;
};
