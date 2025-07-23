"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDeviceStore } from "@/app/Store/decive-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthRegisterType, AuthLoginType } from "@/app/types/auth";
import { authRequest } from "@/lib/api/auth-api";
import { useAuthStore } from "@/app/Store/authStore";
import { jwtDecode } from "jwt-decode";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";

const RegisterSchema = z.object({
  user_name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  full_name: z.string().min(2, {
    message: "Fullname must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Email must be valid.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

interface JwtPayload {
  roles: string[];
}

const Register = () => {
  const router = useRouter();
  const { AUTH_REGISTER, AUTH_LOGIN } = authRequest();

  const { isAuthenticated, setTokens, checkAuth } = useAuthStore();
  const { device, fetchDeviceInfo } = useDeviceStore();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      user_name: "",
      password: "",
      email: "",
      full_name: "",
    },
  });

  // Alert dialog states for error and success
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/"); // or "/" if your profile is home page
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    fetchDeviceInfo();
  }, [fetchDeviceInfo]);

  const registerMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: (payload: AuthRegisterType) => AUTH_REGISTER(payload),
    onSuccess: async (registerData, variables) => {
      try {
        // Auto-login after registration using submitted credentials
        const loginPayload: AuthLoginType = {
          user_name: variables.user_name,
          password: variables.password,
        };

        const loginResponse = await AUTH_LOGIN(loginPayload);
        const { accessToken, refreshToken } = loginResponse.data;

        // Decode roles from access token
        const decoded = jwtDecode<JwtPayload>(accessToken);
        const roles = decoded.roles || [];

        // Save tokens and update auth store
        setTokens(accessToken, refreshToken, roles);

        // Show success toast and success alert dialog
        toast.success("Registration successful! Welcome aboard.");
        setOpenSuccessAlert(true);
      } catch (error) {
        console.error("Auto-login failed after registration:", error);
        const msg =
          // error?.response?.data?.message ||
          // error?.message ||
          "Auto-login failed after registration.";
        setErrorMessage(msg);
        setOpenErrorAlert(true);
        toast.error(msg);
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";
      setErrorMessage(message);
      setOpenErrorAlert(true);
      toast.error(message);
    },
  });

  function onSubmit(data: z.infer<typeof RegisterSchema>) {
    registerMutation.mutate({
      ...data,
      device_name: device?.device_name,
      device_type: device?.device_type,
      os: device?.os,
      browser: device?.browser,
      ip_address: device?.ip_address,
    });
  }

  const handleSuccessClose = () => {
    setOpenSuccessAlert(false);
    router.push("/");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-white flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Welcome message */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-orange-600">Welcome Aboard!</h2>
            <p className="text-sm text-gray-600 mt-2">
              Already have an account?{" "}
              <a
                href="/auth/Login"
                className="text-orange-500 font-medium hover:underline"
              >
                Login
              </a>
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Choose a username"
                        {...field}
                        className="h-12 rounded-md px-4 text-sm border-gray-300 focus:ring-2 focus:ring-yellow-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your full name"
                        {...field}
                        className="h-12 rounded-md px-4 text-sm border-gray-300 focus:ring-2 focus:ring-yellow-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        {...field}
                        className="h-12 rounded-md px-4 text-sm border-gray-300 focus:ring-2 focus:ring-yellow-400"
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
                    <FormLabel className="text-sm text-gray-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create a password"
                        {...field}
                        className="h-12 rounded-md px-4 text-sm border-gray-300 focus:ring-2 focus:ring-yellow-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className={`w-full h-12 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-semibold transition ${
                  registerMutation.isPending ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {registerMutation.isPending ? "Creating account..." : "Register"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Error Alert Dialog */}
      <AlertDialog open={openErrorAlert} onOpenChange={setOpenErrorAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registration Error</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenErrorAlert(false)}>
              Close
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setOpenErrorAlert(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Alert Dialog */}
      <AlertDialog open={openSuccessAlert} onOpenChange={setOpenSuccessAlert}>
        {/* <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registration Successful</AlertDialogTitle>
            <AlertDialogDescription>
              Registration successful! Welcome aboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleSuccessClose}>
              Close
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSuccessClose}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent> */}
      </AlertDialog>
    </>
  );
};

export default Register;
