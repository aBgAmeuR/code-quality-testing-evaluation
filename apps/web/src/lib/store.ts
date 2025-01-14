import { create } from "zustand";
import { persist } from "zustand/middleware";

import { User } from "~/types";

interface Store {
  token: string | null;
  setToken: (token: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useStore = create(
  persist<Store>(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      user: null,
      setUser: (user) => set({ user })
    }),
    {
      name: "auth-storage"
    }
  )
);
