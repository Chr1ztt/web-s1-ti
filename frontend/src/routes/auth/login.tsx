import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GalleryVerticalEnd } from "lucide-react";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { zodValidator } from "@tanstack/zod-adapter";

import { LoginSchema, loginSchema } from "@/features/auth/types/login.schema";
import { Link } from "@tanstack/react-router";
import { z } from "zod";
import { handleAxiosError } from "@/lib/helpers";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/stores/auth.store";
import {
  googleTokenExchange,
  sendGoogleAuth,
} from "@/features/auth/hooks/useGoogleAuth";
import { AxiosError } from "axios";
import { ENV } from "@/env";

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth/login")({
  validateSearch: zodValidator(loginSearchSchema),
  component: LoginComponent,
});

function LoginComponent() {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const { redirect } = Route.useSearch();
  const navigate = useNavigate({ from: "/auth/login" });

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login } = useLogin();

  const onSubmit = async (data: LoginSchema) => {
    login(data, {
      onSuccess: (data) => {
        toast.success("Login berhasil", {
          description: `Selamat datang ${data.user.name}!`,
        });
        if (redirect) {
          navigate({ to: redirect });
          return;
        }
        navigate({ to: "/admin" });
      },
      onError: (error) => {
        const message = handleAxiosError(error)?.message;
        toast.error("Login gagal", {
          description: message ?? "Terjadi kesalahan yang tidak diketahui",
        });
      },
    });
  };

  const onClickGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const googleUserData = await googleTokenExchange(
          tokenResponse.access_token,
        );
        if (!googleUserData.data.email_verified) {
          throw new Error(
            "email belum diverifikasi. Silakan verifikasi email Anda melalui email terlebih dahulu.",
          );
        }
        const fullname = `${googleUserData.data.given_name} ${googleUserData.data.family_name}`;
        const email = googleUserData.data.email;
        const response = await sendGoogleAuth({
          name: fullname,
          email,
        });
        setUser({
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
        });
        setToken(response.data.token);
        toast.success("Login berhasil", {
          description: `Selamat datang ${response.data.user.name}!`,
        });
        if (redirect) {
          navigate({ to: redirect });
          return;
        }
        navigate({ to: "/admin" });
        return response;
      } catch (error) {
        toast.error("Login gagal", {
          description:
            error instanceof AxiosError
              ? handleAxiosError(error)?.message
              : error instanceof Error
                ? error.message
                : "Terjadi kesalahan yang tidak diketahui",
        });
      }
    },
    onError: (error) => {
      toast.error("Login gagal", {
        description:
          error.error_description ?? "Terjadi kesalahan yang tidak diketahui",
      });
    },
  });

  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Web S1 TI
          </Link>
          <div className="container flex flex-col gap-6 mx-auto min-w-96">
            <Card>
              <CardHeader className="flex items-center">
                <CardTitle>Selamat Datang</CardTitle>
                <CardDescription>Silakan isi data diri Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-2"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              required
                              type="email"
                              placeholder="admin@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              required
                              type="password"
                              placeholder="Enter password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex">
                      <Button type="submit" className="mt-7 w-full">
                        Submit
                      </Button>
                    </div>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Atau login dengan
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => onClickGoogle()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Login with Google
                    </Button>
                  </form>
                </Form>
                {ENV.APP.IS_REGISTER_ENABLED && (
                  <div className="text-center text-sm mt-5">
                    Belum punya akun?&nbsp;
                    <Link
                      to="/auth/register"
                      params={{ search: redirect }}
                      className="underline underline-offset-4"
                    >
                      Daftar
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
