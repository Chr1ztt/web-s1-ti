import { User } from "@/features/user/types/user.type";
import { axiosBackendInstance } from "@/services/axiosInstance";
import { create, StateCreator } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { useLoaderStore } from "./loader.store";

// type AuthState = ExtractState<typeof useAuthStore>

export type StoreUser = Omit<User, "id" | "created_at" | "updated_at">;
interface AuthState {
  user: StoreUser | null;
  token: string | null;
}

export interface AuthAction {
  setUser: (user: StoreUser | null) => void;
  setToken: (token: string | null) => void;
  isAuthenticated: () => Promise<boolean>;
}

interface AuthStore extends AuthState, AuthAction {}

const middleware = <T extends object>(
  f: StateCreator<T, [["zustand/persist", unknown]], [], T>,
) => devtools(persist(f, { name: "authStore" }));

export const useAuthStore = create<AuthStore>()(
  middleware((set, get) => ({
    token: null,
    user: null,
    //actions
    isAuthenticated: async () => {
      try {
        const setAuthLoading = useLoaderStore.getState().setAuthLoading;
        setAuthLoading(true);

        if (!get().token) {
          set({ user: null });
          setAuthLoading(false);
          return false;
        }
        const response = await axiosBackendInstance.get("/me", {});
        const userProfile: StoreUser = {

          email: response.data.email,
          name: response.data.name,
          role: response.data.role,
        };
        set({ user: userProfile });
        setAuthLoading(false);
        return true;
      } catch {
        set({ user: null, token: null });
        const setAuthLoading = useLoaderStore.getState().setAuthLoading;
        setAuthLoading(false);
        return false;
      }
    },
    setUser: (user: StoreUser | null) => set({ user: user }),
    setToken: (token: string | null) => set({ token: token }),
  })),
);
