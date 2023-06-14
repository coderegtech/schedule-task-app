import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ZustandState {
  currentUser: any | [];
  isLoading: boolean;
  setCurrentUser: (user: any) => void;
}

const authStore = (set: any) => ({
  currentUser: null,
  isLoading: false,

  setCurrentUser: (user: any) => {
    set((state: any) => ({
      currentUser: user,
      isLoading: false,
    }));
  },
});

const useAuthStore = create(
  devtools(
    persist(authStore, {
      name: "currentUser",
    })
  )
);

export default useAuthStore;
