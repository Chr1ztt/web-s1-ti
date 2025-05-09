import { axiosBackendInstance } from "@/services/axiosInstance";
import { useState } from "react";
import { LoginSchema } from "../types/login.schema";
import { useMutation } from "@tanstack/react-query";
import { handleAxiosError } from "@/lib/helpers";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/interfaces/responses/errorResponse.interface";
import { useAuthStore } from "@/stores/auth.store";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/error.constant";

export function login(data: LoginSchema) {
  return axiosBackendInstance.post("/login", data);
}

export function useLogin() {
  const [error, setError] = useState<string>(DEFAULT_ERROR_MESSAGE);
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: async (data: LoginSchema) => {
      const response = await login(data);
      return response.data;
    },
    onSuccess: (data) => {
      setUser({
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
      });
      setToken(data.token);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message = handleAxiosError(error)?.message;
      if (message) {
        setError(message);
      }
    },
  });

  return {
    error,
    mutateAsync: mutation.mutateAsync,
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
}
