"use client";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDeviceStore } from "@/app/Store/decive-store";
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
import { useEffect } from "react";
import { AuthRegisterType } from "@/app/types/auth";
import { authRequest } from "@/lib/api/auth-api";
const RegisterSchema = z.object({
  user_name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  full_name: z.string().min(2, {
    message: "Fullname must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Fullname must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

const Register = () => {
  const { AUTH_REGISTER } = authRequest();
  const { device, fetchDeviceInfo } = useDeviceStore();
  console.log(device);
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      user_name: "",
      password: "",
      email: "",
      full_name: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: (payload: AuthRegisterType) => AUTH_REGISTER(payload),
    onSuccess: (data) => {
      console.log("response data", data);
    },
  });

  function onSubmit(data: z.infer<typeof RegisterSchema>) {
    mutate({
      ...data,
      device_name: device?.device_name,
      device_type: device?.device_type,
      os: device?.os,
      browser: device?.browser,
      ip_address: device?.ip_address,
    });
  }
  useEffect(() => {
    fetchDeviceInfo();
  }, [fetchDeviceInfo]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-inter">
      <div className="w-full max-w-md shadow-lg overflow-hidden bg-white">
        <div className="bg-blue-800 text-white text-center mt-1 p-6 rounded-l-full">
          <h2 className="text-xl font-bold">Welcome Aboard!</h2>
          <p className="text-sm">Already have an account?</p>
          <a href="/auth/Login">
            <button className="bg-blue-500 mt-4 text-white hover:bg-blue-400 font-semibold py-2 px-6 rounded-full shadow-md transition duration-300">
              Login
            </button>
          </a>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            <h3 className="text-xl font-semibold text-center text-gray-500">
              Register
            </h3>

            <FormField
              control={form.control}
              name="user_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      className="w-full h-12 px-8 py- border rounded-full focus:outline-none focus:ring-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full Name"
                      {...field}
                      className="w-full px-8 h-12 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      className="w-full px-8  h-12 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                      placeholder="Password"
                      {...field}
                      className="w-full px-8 h-12 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className={`w-full bg-blue-800 h-12 text-white py-3 rounded-full hover:bg-blue-600 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPending ? "Submitting..." : "Register"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
export default Register;
