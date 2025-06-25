import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  userId: string;
  setUserId: (userId: string) => void;
  clearUserId: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: "",
      setUserId: (userId: string) => set({ userId }),
      clearUserId: () => set({ userId: "" }),
    }),
    {
      name: "user-storage", // localStorage에 저장될 키 이름
    }
  )
);
