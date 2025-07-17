"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Plus } from "lucide-react";
import { cardRequest } from "@/lib/api/card-api";
import { useMutation } from "@tanstack/react-query";
import { CreateCardType } from "@/app/types/card-type";

const formSchema = z.object({
  gender: z.enum(["male", "female"]),
  nationality: z.string().min(1),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  bio: z.string().min(1),
  web_site: z.string().min(1),
  job: z.string().min(1),
  address: z.string().min(1),
  company: z.string().min(1),
  phone: z.string().min(1),
  card_type: z.enum(["Modern", "Minimal", "Corporate"]),
  social: z.array(z.object({
    platform: z.string().min(1),
    icon: z.string().optional(),
    url: z.string().url(),
  })),
});

type ProfileFormType = z.infer<typeof formSchema>;

export default function ProfileForm() {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [socialIcons, setSocialIcons] = useState<Record<number, File | null>>({});
  const [iconPreviews, setIconPreviews] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { CREATE_CARD } = cardRequest();

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "male",
      nationality: "Cambodian",
      dob: "",
      address: "",
      phone: "",
      card_type: "Minimal",
      web_site: "",
      bio: "",
      company: "",
      job: "",
      social: [{ platform: "", icon: "", url: "" }],
    },
  });

  const { control, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "social",
  });

  const isValidImage = (file: File) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    return allowed.includes(file.type) && file.size <= 2 * 1024 * 1024;
  };

  const createCardMutation = useMutation({
    mutationFn: (payload: CreateCardType) => CREATE_CARD(payload),
    onSuccess: () => {
      form.reset();
      setAvatarFile(null);
      setAvatarPreview(null);
      setSocialIcons({});
      setIconPreviews({});
      router.push("/");
    },
  });

  const onSubmit = async (values: ProfileFormType) => {
    setIsSubmitting(true);
    let avatarUrl = avatarPreview ?? "";

    if (avatarFile) {
      const formData = new FormData();
      formData.append("image", avatarFile);
      const res = await fetch("http://localhost:8000/api/v1/upload/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      avatarUrl = data.url;
    }

    const updatedSocial = await Promise.all(
      values.social.map(async (item, index) => {
        const file = socialIcons[index];
        if (file) {
          const formData = new FormData();
          formData.append("image", file);
          const res = await fetch("http://localhost:8000/api/v1/upload/upload-image", {
            method: "POST",
            body: formData,
          });
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

    createCardMutation.mutate(finalPayload);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-xl mx-auto">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-2">
              <label htmlFor="avatarUpload" className="cursor-pointer relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border bg-gray-100">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">+ Avatar</div>
                  )}
                </div>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarFile(null);
                      setAvatarPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs shadow"
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
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && isValidImage(file)) {
                    setAvatarFile(file);
                    setAvatarPreview(URL.createObjectURL(file));
                  } else {
                    alert("Avatar must be an image under 2MB");
                  }
                }}
              />
            </div>

            {/* Form Fields */}
            {([
              ["gender", "Gender"],
              ["nationality", "Nationality"],
              ["dob", "Date of Birth"],
              ["job", "Job"],
              ["company", "Company"],
              ["web_site", "Website"],
              ["bio", "Bio"],
              ["address", "Address"],
              ["phone", "Phone"]
            ] as const).map(([name, label]) => {
              if (name === "gender") {
                return (
                  <FormField
                    key={name}
                    control={control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }

              return (
                <FormField
                  key={name}
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={label} type={name === "dob" ? "date" : "text"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}

            {/* Card Type */}
            <FormField
              control={control}
              name="card_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Card Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Modern">Modern</SelectItem>
                      <SelectItem value="Minimal">Minimal</SelectItem>
                      <SelectItem value="Corporate">Corporate</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Social Media Links</h3>
              {fields.map((fieldItem, index) => (
                <div key={fieldItem.id} className="border p-4 rounded-md space-y-3 relative">
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
                  <div className="flex items-center space-x-4">
                    <label htmlFor={`icon-upload-${index}`} className="cursor-pointer relative">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                        <Avatar>
                          <AvatarImage src={iconPreviews[index]} alt="icon" />
                          <AvatarFallback>IC</AvatarFallback>
                        </Avatar>
                      </div>
                      {iconPreviews[index] && (
                        <button
                          type="button"
                          onClick={() => {
                            setSocialIcons((prev) => ({ ...prev, [index]: null }));
                            setIconPreviews((prev) => {
                              const newPreview = { ...prev };
                              delete newPreview[index];
                              return newPreview;
                            });
                          }}
                          className="absolute -top-1 -right-1 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </label>
                    <Input
                      id={`icon-upload-${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && isValidImage(file)) {
                          setSocialIcons((prev) => ({ ...prev, [index]: file }));
                          setIconPreviews((prev) => ({ ...prev, [index]: URL.createObjectURL(file) }));
                        } else {
                          alert("Icon must be an image under 2MB");
                        }
                      }}
                    />
                  </div>

                  {/* Platform & URL Inputs */}
                  {(["platform", "url"] as const).map((fieldKey) => {
                    const name = `social.${index}.${fieldKey}` as
                      | `social.${number}.platform`
                      | `social.${number}.url`;

                    return (
                      <FormField
                        key={fieldKey}
                        control={control}
                        name={name}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{fieldKey === "platform" ? "Platform" : "URL"}</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder={fieldKey === "url" ? "https://..." : "Platform"} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  })}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => append({ platform: "", icon: "", url: "" })}>
                <Plus className="w-4 h-4 mr-2" /> Add Social Link
              </Button>
            </div>

            <Button type="submit" disabled={isSubmitting || createCardMutation.isPending} className="w-full">
              {isSubmitting || createCardMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
