// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { z } from "zod";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";

// const FormSchema = z.object({
//   user_name: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
//   email: z.string().email({
//     message: "Please enter a valid email address.",
//   }),
//   password: z.string().min(8, {
//     message: "Password must be at least 8 characters.",
//   }),
// });

// export function InputForm() {
//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       user_name: "",
//       email: "",
//       password: "",
//     },
//   });

//   function onSubmit(data: z.infer<typeof FormSchema>) {
//     console.log(data);
//     toast("You submitted the following values", {
//       description: (
//         <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       ),
//     });
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
//         <FormField
//           control={form.control}
//           name="username"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Username</FormLabel>
//               <FormControl>
//                 <Input placeholder="shadcn" {...field} />
//               </FormControl>
//               <FormDescription>
//                 This is your public display name.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input type="email" placeholder="shadcn" {...field} />
//               </FormControl>
//               <FormDescription>
//                 This is your public display name.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Password</FormLabel>
//               <FormControl>
//                 <Input type="password" placeholder="••••••••" {...field} />
//               </FormControl>
//               <FormDescription>
//                 Use at least 8 characters for security.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <Button type="submit">Submit</Button>
//       </form>
//     </Form>
//   );
// }

// // ✅ Default export required by Next.js App Router
// export default InputForm;
"use client";
import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // You can replace this with your real API call
    console.log("Requesting password reset for:", email);
    setSuccessMessage("Password reset link sent! Check your email.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-inter">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-800 text-white text-center p-6 rounded-b-full">
          <h2 className="text-xl font-bold">Forgot Your Password?</h2>
          <p className="text-sm">Enter your email to reset it</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-xl font-semibold text-center mb-6 text-gray-500">
            Reset Password
          </h3>

          <div className="mb-4 relative">
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setSuccessMessage("");
              }}
              className={`w-full px-8 py-2 border rounded-full focus:outline-none focus:ring-2 ${
                error ? "border-red-500" : "focus:ring-blue-300"
              }`}
            />
            <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-3 rounded-full hover:bg-blue-600 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Send Reset Link
          </button>

          {successMessage && (
            <p className="text-green-600 text-center mt-4 text-sm">
              {successMessage}
            </p>
          )}

          <div className="text-center mt-6">
            <a
              href="/auth/Login"
              className="text-blue-500 hover:underline text-sm"
            >
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
