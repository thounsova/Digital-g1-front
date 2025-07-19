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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-purple-200">
        {/* Left Panel */}
        <div className="bg-gradient-to-tr from-pink-700 to-pink-500 text-white flex flex-col items-center justify-center p-8 space-y-4">
          <h2 className="text-3xl font-bold">Welcome Back! </h2>
          <p className="text-sm text-center max-w-[80%]">
            Don’t have an account yet? Sign up and join the fun!
          </p>
          <a href="/auth/Register">
            <button className="bg-white text-purple-600 hover:bg-pink-100 px-6 py-2 rounded-full text-sm font-semibold shadow transition-all">
              Register
            </button>
          </a>
        </div>

        {/* Right Panel - Login */}
        <div className="p-8 md:p-10 bg-white">
          <h3 className="text-2xl font-semibold text-purple-700 mb-6 text-center">
            Login to Your Account
          </h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        className="rounded-xl h-12 text-sm px-4 border-gray-300 focus:ring-2 focus:ring-purple-300"
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
                    <FormLabel className="text-sm text-gray-700">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="rounded-xl h-12 text-sm px-4 border-gray-300 focus:ring-2 focus:ring-purple-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
                className={`w-full h-12 rounded-xl bg-pink-600 hover:bg-purple-700 text-white font-semibold shadow-md transition ${
                  isPending ? "opacity-60 cursor-not-allowed" : ""
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
