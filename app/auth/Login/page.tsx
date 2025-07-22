"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { authRequest } from "@/lib/api/auth-api";
import { AuthLoginType } from "@/app/types/auth";
import { useAuthStore } from "@/app/Store/authStore";

// --- Form validation schema
const LoginSchema = z.object({
  user_name: z.string().min(2, { message: "Username is required" }),
  password: z.string().min(2, { message: "Password is required" }),
});

const Login = () => {
  const router = useRouter();
  const { AUTH_LOGIN } = authRequest();

  // Zustand store setter and boolean property (getter)
  const setTokens = useAuthStore((state) => state.setTokens);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // React Hook Form
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      user_name: "",
      password: "",
    },
  });

  // React Query mutation for login
  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (payload: AuthLoginType) => AUTH_LOGIN(payload),
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data.data || {};
      if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken);
        router.push("/");
      }
    },
    onError: (err) => {
      console.error("Login failed:", err);
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Form submit handler
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-orange-100 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-orange-600">Welcome Back!</h2>
          <p className="text-sm text-gray-600 mt-1">
            Don&apos;t have an account?{" "}
            <a
              href="/auth/Register"
              className="text-orange-500 hover:underline font-medium"
            >
              Register now
            </a>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="user_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700 font-medium">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      className="h-11 rounded-md text-sm border-gray-300 focus:ring-2 focus:ring-yellow-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700 font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="h-11 rounded-md text-sm border-gray-300 focus:ring-2 focus:ring-yellow-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className={`w-full h-12 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-semibold transition ${
                loginMutation.isPending ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
