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
  cover_image: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

type Props = {
  user: {
    full_name?: string;
    email?: string;
    user_name?: string;
    avatar?: string;
    cover_image?: string;
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
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user?.full_name || "",
      email: user?.email || "",
      user_name: user?.user_name || "",
      avatar: user?.avatar || "",
      cover_image: user?.cover_image || "",
    },
  });

  useEffect(() => {
    form.reset({
      full_name: user?.full_name || "",
      email: user?.email || "",
      user_name: user?.user_name || "",
      avatar: user?.avatar || "",
      cover_image: user?.cover_image || "",
    });

    setAvatarFile(null);
    setAvatarPreview(user?.avatar || null);
    setCoverImageFile(null);
    setCoverImagePreview(user?.cover_image || null);
    form.setValue("avatar", user?.avatar || "");
    form.setValue("cover_image", user?.cover_image || "");
  }, [user, open, form]);

  const isValidImage = (file: File) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const maxSize = 2 * 1024 * 1024;
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidImage(file)) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      form.setValue("avatar", previewUrl);
    } else if (file) {
      alert("Avatar must be an image under 2MB");
      e.target.value = "";
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    form.setValue("avatar", "");
    const fileInput = document.getElementById(
      "avatarUpload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidImage(file)) {
      setCoverImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverImagePreview(previewUrl);
      form.setValue("cover_image", previewUrl);
    } else if (file) {
      alert("Cover image must be an image under 2MB");
      e.target.value = "";
    }
  };

  const handleRemoveCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
    form.setValue("cover_image", "");
    const fileInput = document.getElementById(
      "coverImageUpload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const updateUserProfileMutation = useMutation({
    mutationKey: ["update-user-profile", "me"],
    mutationFn: (payload: FormValues) => UPDATE_USER(payload),
    onSuccess: () => {
      form.reset();
      setAvatarFile(null);
      setAvatarPreview(null);
      setCoverImageFile(null);
      setCoverImagePreview(null);
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    let avatarUrl = data.avatar || "";
    let coverImageUrl = data.cover_image || "";

    try {
      if (avatarFile) {
        const formData = new FormData();
        formData.append("image", avatarFile);
        const res = await fetch(
          `http://localhost:8000/api/v1/upload/upload-image`,
          {
            method: "POST",
            body: formData,
          }
        );
        const uploadData = await res.json();
        avatarUrl = uploadData.url;
      }

      if (coverImageFile) {
        const formData = new FormData();
        formData.append("image", coverImageFile);
        const res = await fetch(
          `http://localhost:8000/api/v1/upload/upload-image`,
          {
            method: "POST",
            body: formData,
          }
        );
        const uploadData = await res.json();
        coverImageUrl = uploadData.url;
      }
    } catch (error) {
      console.error("Upload error:", error);
    }

    const finalPayload: FormValues = {
      ...data,
      avatar: avatarUrl,
      cover_image: coverImageUrl,
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            {/* Cover Image Upload (clickable area) */}
            <div className="w-full">
              <label
                htmlFor="coverImageUpload"
                className="relative w-full h-32 rounded-md overflow-hidden bg-gray-200 mb-2 block cursor-pointer"
              >
                {coverImagePreview ? (
                  <>
                    <img
                      src={coverImagePreview}
                      alt="Cover"
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCoverImage();
                      }}
                      className="absolute top-2 right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow border"
                      aria-label="Remove cover"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    + Cover Image
                  </div>
                )}
                <input
                  id="coverImageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Hidden Cover Field */}
            <FormField
              control={form.control}
              name="cover_image"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-2">
              <label
                htmlFor="avatarUpload"
                className="cursor-pointer relative group"
              >
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
            </div>

            {/* Hidden Avatar Field */}
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
                className="w-full bg-orange-500 hover:bg-orange-400"
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
