"use client";

import React, { useEffect, useState } from "react";
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
import { useAuthStore } from "@/app/Store/authStore";
import { jwtDecode } from "jwt-decode";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";

const LoginSchema = z.object({
  user_name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

interface JwtPayload {
  roles: string[];
}

const Login = () => {
  const router = useRouter();
  const { AUTH_LOGIN } = authRequest();
  const { isAuthenticated, setTokens, checkAuth } = useAuthStore();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      user_name: "",
      password: "",
    },
  });

  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: (payload: AuthLoginType) => AUTH_LOGIN(payload),
    onSuccess: (response) => {
      const data = response.data;

      if (data.accessToken && data.refreshToken) {
        const decoded = jwtDecode<JwtPayload>(data.accessToken);
        const roles = decoded.roles || [];
        setTokens(data.accessToken, data.refreshToken, roles);

        toast.success("Login successful! Welcome back.");
        setOpenSuccessAlert(true);
      } else {
        setErrorMessage("Login failed: Missing tokens in response.");
        setOpenErrorAlert(true);
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Wrong Email or Password";
      setErrorMessage(message);
      setOpenErrorAlert(true);
      toast.error(message);
    },
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    mutate(data);
  };

  const handleSuccessClose = () => {
    setOpenSuccessAlert(false);
    router.replace("/");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-orange-100 to-white px-4">
        <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-orange-600">Welcome Back!</h2>
            <p className="text-sm text-gray-600 mt-1">
              Don&apos;t have an account?{" "}
              <a
                href="/auth/Register"
                className="text-orange-500 font-medium hover:underline"
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
                    <FormMessage className="text-red-500 text-xs" />
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
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
                className={`w-full h-12 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-semibold transition ${
                  isPending ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Error Alert Dialog */}
      <AlertDialog open={openErrorAlert} onOpenChange={setOpenErrorAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Error</AlertDialogTitle>
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
          {/* <AlertDialogHeader>
            <AlertDialogTitle>Login Successful</AlertDialogTitle>
            <AlertDialogDescription>
              Login successful! Welcome back.
            </AlertDialogDescription>
          </AlertDialogHeader> */}
          {/* <AlertDialogFooter>
            <AlertDialogCancel onClick={handleSuccessClose}>
              Close
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSuccessClose}>OK</AlertDialogAction>
          </AlertDialogFooter> */}
        {/* </AlertDialogContent> */} 
      </AlertDialog>
    </>
  );
};

export default Login;
