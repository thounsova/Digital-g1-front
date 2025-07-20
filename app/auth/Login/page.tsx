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
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-white flex items-center justify-center px-4">
      <div className="relative w-full max-w-5xl bg-white shadow-xl rounded-3xl overflow-hidden flex flex-col md:grid md:grid-cols-2">
        {/* Left Image Panel - Hidden on Mobile */}
        <div
          className="hidden md:flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://codemyui.com/wp-content/uploads/2016/01/owl-login-form-replica-from-readme-io_.gif')",
          }}
        />

        {/* Right Form Panel */}
        <div className="p-8 md:p-12 w-full flex flex-col justify-center">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-orange-600 mb-2">Welcome Back!</h2>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/auth/Register"
                className="text-orange-500 font-medium hover:underline"
              >
                Register now
              </a>
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        className="h-11 rounded-lg text-sm border-gray-300 focus:ring-2 focus:ring-yellow-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="h-11 rounded-lg text-sm border-gray-300 focus:ring-2 focus:ring-yellow-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
                className={`w-full h-12 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition ${
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
