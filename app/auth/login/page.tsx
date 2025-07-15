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
  const navigate = useRouter();
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
      console.log(data, "===data ==== login success");

      if (data) {
        navigate.push("/");
      }
    },
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    console.log(data, "===data ==== login");
    mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-inter">
      <div className="w-full max-w-sm shadow-md overflow-hidden bg-white ">
        <div className="bg-blue-800 text-white text-center p-4 rounded-l-full">
          <h2 className="text-lg font-bold">Welcome Back!</h2>
          <p className="text-sm">Don't have an account?</p>
          <a href="/auth/Register">
            <button className="bg-blue-500 mt-2 h-10 w-34 text-white hover:bg-blue-400 font-medium py-1.5 px-4 rounded-full shadow-sm transition duration-300 text-sm">
              Register
            </button>
          </a>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 space-y-4"
          >
            <h3 className="text-lg font-semibold text-center text-gray-600">
              Login
            </h3>

            <FormField
              control={form.control}
              name="user_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      className="w-full px-6 h-14 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                  <FormLabel className="text-sm">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      className="w-full px-6 h-14 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className={`w-full bg-blue-800 h-14 text-white py-2 text-sm rounded-full hover:bg-blue-600 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
