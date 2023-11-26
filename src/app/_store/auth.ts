import { type User } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  token: string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
}

export const useAuthToken = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,

      setToken: (authToken: string) => set({ token: authToken }),
      removeToken: () => set({ token: null }),
    }),
    { name: "auth" },
  ),
);

type Me = Pick<
  User,
  "id" | "firstName" | "lastName" | "email" | "createdAt" | "updatedAt"
>;

interface AuthUser {
  user: Me | null;
  setUser: (user: Me) => void;
}

export const useAuthUser = create<AuthUser>((set) => ({
  user: null,
  setUser: (user: Me) => set({ user: user }),
}));
