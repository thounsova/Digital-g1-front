"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userRequest } from "@/lib/api/user-api";

const formSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  user_name: z.string().min(1, "Username is required"),
  avatar: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

type Props = {
  user: {
    full_name?: string;
    email?: string;
    user_name?: string;
    avatar?: string;
  };
  onSave: (data: FormValues) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function UpdateUserDialog({
  user,
  onSave,
  open,
  setOpen,
}: Props) {
  const queryClient = useQueryClient();
  const { UPDATE_USER } = userRequest();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user?.full_name || "",
      email: user?.email || "",
      user_name: user?.user_name || "",
      avatar: user?.avatar || "",
    },
  });

  // Reset form and avatar preview when user changes or dialog opens
  useEffect(() => {
    form.reset({
      full_name: user?.full_name || "",
      email: user?.email || "",
      user_name: user?.user_name || "",
      avatar: user?.avatar || "",
    });
    setAvatarFile(null);
    setAvatarPreview(user?.avatar || null);

    // Make sure avatar field is synced
    form.setValue("avatar", user?.avatar || "");
  }, [user, open, form]);

  // Validate image type and size (max 2MB)
  const isValidImage = (file: File) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const maxSize = 2 * 1024 * 1024;
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  };

  // Handle avatar file selection & preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidImage(file)) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      form.setValue("avatar", previewUrl); // Temporary preview in form
    } else if (file) {
      alert("Avatar must be an image under 2MB");
      e.target.value = "";
    }
  };

  // Remove avatar file and preview
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    form.setValue("avatar", "");
    // Reset file input element if present
    const fileInput = document.getElementById("avatarUpload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // Mutation for updating user profile
  const updateUserProfileMutation = useMutation({
    mutationKey: ["update-user-profile", "me"],
    mutationFn: (payload: FormValues) => UPDATE_USER(payload),
    onSuccess: () => {
      form.reset();
      setAvatarFile(null);
      setAvatarPreview(null);
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  // Form submit handler with avatar upload
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    let avatarUrl = data.avatar || "";

    // Upload avatar file if new one selected
    if (avatarFile) {
      try {
        const formData = new FormData();
        formData.append("image", avatarFile);
        const res = await fetch(`http://localhost:8000/api/v1/upload/upload-image`, {
          method: "POST",
          body: formData,
        });
        const uploadData = await res.json();
        avatarUrl = uploadData.url;
      } catch (error) {
        console.error("Error uploading avatar:", error);
        avatarUrl = avatarPreview || data.avatar || "";
      }
    } else if (avatarPreview) {
      avatarUrl = avatarPreview;
    }

    const finalPayload: FormValues = {
      ...data,
      avatar: avatarUrl,
    };

    onSave(finalPayload);
    updateUserProfileMutation.mutate(finalPayload);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-2">
              <label htmlFor="avatarUpload" className="cursor-pointer relative group">
                <div className="w-24 h-24 rounded-full border overflow-hidden bg-gray-700">
                  {avatarPreview ? (
                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                      <AvatarImage src={avatarPreview} alt="User Avatar" />
                      <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {user?.full_name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      + Avatar
                    </div>
                  )}
                </div>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs shadow border"
                    aria-label="Remove avatar"
                  >
                    ✕
                  </button>
                )}
              </label>
              <Input
                id="avatarUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Label
                htmlFor="avatarUpload"
                className="text-sm font-medium cursor-pointer text-gray-600"
              >
                Click to change avatar
              </Label>
            </div>

            {/* Hidden avatar form field */}
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full Name */}
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username */}
            <FormField
              control={form.control}
              name="user_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-300"
                disabled={isSubmitting || updateUserProfileMutation.isPending}
              >
                {isSubmitting || updateUserProfileMutation.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
