"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react"; // import icon
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { cardRequest } from "@/lib/api/card-api";
import { CreateCardType, SocialLink } from "@/app/types/card-type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Zod Schema
const formSchema = z.object({
  avatar: z.string().optional(),
  gender: z.enum(["male", "female"]),
  nationality: z.string().min(1, "Nationality is required"),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  bio: z.string().min(1, "Bio is required"),
  web_site: z.string().optional(),
  job: z.string().optional(),
  company: z.string().optional(),
  card_type: z.enum(["Modern", "Minimal", "Corporate"]),
  social: z.array(
    z.object({
      id: z.string().optional(),
      platform: z.string().min(1, "Platform is required"),
      icon: z.string().optional(),
      url: z.string().url("Invalid URL"),
    })
  ),
});

type ProfileFormType = z.infer<typeof formSchema>;

export default function ProfileForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = React.use(params);
  const { GET_CARD, UPDATE_CARD } = cardRequest();

  const {
    data: cardData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["card", id],
    queryFn: async () => GET_CARD(id),
    enabled: !!id,
  });

  const updateCardMutation = useMutation({
    mutationKey: ["update_card"],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: CreateCardType;
    }) => UPDATE_CARD(id, payload),
    onSuccess: () => {
      router.push("/");
    },
  });

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: "",
      gender: "male",
      nationality: "CAMBODIAN",
      dob: "",
      address: "",
      phone: "",
      card_type: "Minimal",
      bio: "",
      job: "",
      web_site: "",
      company: "",
      social: [{ platform: "", icon: "", url: "" }],
    },
  });

  const { control, handleSubmit, reset, setValue } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "social",
  });

  const [socialIcons, setSocialIcons] = useState<Record<number, File | null>>(
    {}
  );
  const [iconPreviews, setIconPreviews] = useState<Record<number, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const isValidImage = (file: File) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const maxSize = 2 * 1024 * 1024;
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  };

  useEffect(() => {
    if (cardData) {
      const social = Array.isArray(cardData.card.socialLinks)
        ? cardData.card.socialLinks.map((item: SocialLink) => ({
            id: item.id,
            platform: item.platform,
            icon: item.icon,
            url: item.url,
          }))
        : [{ platform: "", icon: "", url: "" }];

      reset({
        gender: cardData.card.gender,
        job: cardData.card.job,
        web_site: cardData.card.web_site || "",
        bio: cardData.card.bio,
        nationality: cardData.card.nationality || "USA",
        dob: cardData.card.dob || "",
        address: cardData.card.address || "",
        phone: cardData.card.phone || "",
        card_type: cardData.card.card_type || "Minimal",
        company: cardData.card.company || "",
        social,
      });

      const previews: Record<number, string> = {};
      if (Array.isArray(cardData.card.socialLinks)) {
        cardData.card.socialLinks.forEach((item: SocialLink, index: number) => {
          if (item.icon) previews[index] = item.icon;
        });
      }
      setIconPreviews(previews);
    }
  }, [cardData, reset]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading card data</div>;

  const onSubmit = async (values: ProfileFormType) => {
    let avatarUrl = values.avatar || "";
    if (avatarPreview.startsWith("blob:")) {
      const formData = new FormData();
      const blob = await fetch(avatarPreview).then((r) => r.blob());
      formData.append("image", blob);
      const res = await fetch(
        "http://localhost:8000/api/v1/upload/upload-image",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      avatarUrl = data.url;
    }

    const updatedSocial = await Promise.all(
      values.social.map(async (item, index) => {
        const file = socialIcons[index];
        if (file) {
          const formData = new FormData();
          formData.append("image", file);
          const res = await fetch(
            "http://localhost:8000/api/v1/upload/upload-image",
            {
              method: "POST",
              body: formData,
            }
          );
          const data = await res.json();
          return { ...item, icon: data.url };
        }
        return { ...item, icon: iconPreviews[index] || "" };
      })
    );

    const finalPayload: CreateCardType = {
      ...values,
      avatar: avatarUrl,
      social: updatedSocial,
    };

    updateCardMutation.mutate({ id, payload: finalPayload });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Card Type */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={control}
                name="card_type"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-semibold text-orange-700">
                      Card Type
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full py-2 px-3 rounded-lg border border-orange-300 text-orange-800 shadow-sm bg-orange-50 hover:bg-orange-100 focus:ring-2 focus:ring-orange-400">
                          <SelectValue placeholder="Select Card Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Modern">Modern</SelectItem>
                          <SelectItem value="Minimal">Minimal</SelectItem>
                          <SelectItem value="Corporate">Corporate</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-semibold text-orange-700">
                      Gender
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full py-2 px-3 rounded-lg border border-orange-300 text-orange-800 shadow-sm bg-orange-50 hover:bg-orange-100 focus:ring-2 focus:ring-orange-400">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />
            </div>

            {/* Nationality, DOB, Address, Bio, Company, Job, Website, Phone */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={control}
                name="nationality"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-semibold text-orange-700">
                      Nationality
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. American"
                        className="rounded-lg border border-orange-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-semibold text-orange-700">
                      Date of Birth
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="rounded-lg border border-orange-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-semibold text-orange-700">
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your address"
                        className="rounded-lg border border-orange-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-semibold text-orange-700">
                      Phone
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="+1 123 456 7890"
                        className="rounded-lg border border-orange-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-semibold text-orange-700">
                      Bio
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Tell us about yourself"
                        className="rounded-lg border border-orange-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              {/* Job & Company */}
              <FormField
                control={control}
                name="job"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-semibold text-orange-700">
                      Job
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your job title"
                        className="rounded-lg border border-orange-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="company"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm font-semibold text-orange-700">
                    Company
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your company"
                      className="rounded-lg border border-orange-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="web_site"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm font-semibold text-orange-700">
                    Website
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com"
                      className="rounded-lg border border-orange-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 mt-1" />
                </FormItem>
              )}
            />

            {/* Social Media Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-600">
                Social Media Links
              </h3>
              {fields.map((fieldItem, index) => (
                <div
                  key={fieldItem.id}
                  className="border border-orange-200 bg-orange-50 p-4 rounded-xl space-y-3 relative shadow-sm"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>

                  {/* Icon Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-orange-600">
                      Icon
                    </label>
                    <div className="flex items-center space-x-4">
                      <label
                        htmlFor={`icon-upload-${index}`}
                        className="cursor-pointer"
                      >
                        <Avatar className="w-10 h-10 ring-2 ring-orange-300 hover:ring-orange-500 transition">
                          {iconPreviews[index] ? (
                            <AvatarImage src={iconPreviews[index]} alt="Icon" />
                          ) : (
                            <AvatarFallback>
                              {fieldItem.platform?.[0]?.toUpperCase() || "?"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <input
                          type="file"
                          id={`icon-upload-${index}`}
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && isValidImage(file)) {
                              setSocialIcons((prev) => ({
                                ...prev,
                                [index]: file,
                              }));
                              setIconPreviews((prev) => ({
                                ...prev,
                                [index]: URL.createObjectURL(file),
                              }));
                            } else {
                              alert(
                                "Invalid image type or file size too large (max 2MB)."
                              );
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Platform Input */}
                  <FormField
                    control={control}
                    name={`social.${index}.platform`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col mb-3">
                        <FormLabel className="text-sm font-semibold text-orange-700">
                          Platform
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Facebook, Twitter"
                            className="rounded-lg border border-orange-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500 mt-1" />
                      </FormItem>
                    )}
                  />

                  {/* URL Input */}
                  <FormField
                    control={control}
                    name={`social.${index}.url`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col mb-3">
                        <FormLabel className="text-sm font-semibold text-orange-700">
                          URL
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://social.com/yourprofile"
                            className="rounded-lg border border-orange-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500 mt-1" />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              <Button
                type="button"
                onClick={() => append({ platform: "", icon: "", url: "" })}
                variant="outline"
                className="flex items-center space-x-2 text-orange-600 hover:bg-orange-100"
              >
                <Plus className="w-4 h-4" />
                <span>Add Social Link</span>
              </Button>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col-12 sm:flex-row justify-center gap-4 pt-4">
              <Button
                type="submit"
                className="w-40 bg-orange-600 hover:bg-orange-700 focus:ring-4 rounded-xl focus:ring-orange-400 font-semibold transition"
                disabled={updateCardMutation.isPending}
              >
                {updateCardMutation.isPending ? "Updating..." : "Update Card"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-40 sm:w-40 border-orange-400 text-orange-600 hover:bg-orange-200 font-semibold py-3 rounded-xl shadow"
                onClick={() => router.back()}
              >
                Back
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
