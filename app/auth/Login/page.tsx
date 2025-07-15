"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import { authRequest } from "@/lib/api/auth-api";
import { AuthLoginType } from "@/app/types/auth";
import { useRouter } from "next/navigation";

const LoginSchema = z.object({
  user_name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

const Login = () => {
  const router = useRouter();
  const { AUTH_LOGIN } = authRequest();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      user_name: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: (payload: AuthLoginType) => AUTH_LOGIN(payload),
    onSuccess: (data) => {
      if (data) {
        router.push("/");
      }
    },
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left - Welcome / Register Panel */}
        <div className="bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex flex-col items-center justify-center p-8">
          <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-sm mb-4 text-center">
            Don't have an account yet?
          </p>
          <a href="/auth/Register">
            <button className="bg-white text-blue-700 hover:bg-gray-100 px-6 py-2 rounded-full text-sm font-medium shadow transition">
              Register
            </button>
          </a>
        </div>

        {/* Right - Login Form */}
        <div className="p-8 md:p-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Login to Your Account
          </h3>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        className="rounded-lg h-12 text-sm px-4"
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
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="rounded-lg h-12 text-sm px-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
                className={`w-full h-12 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-semibold transition ${
                  isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
