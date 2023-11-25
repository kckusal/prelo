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
