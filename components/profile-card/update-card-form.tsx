"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useQuery, useMutation } from "@tanstack/react-query";

import { cardRequest } from "@/lib/api/card-api";
import { CreateCardType, CardItem } from "@/app/types/card-type";

const formSchema = z.object({
  gender: z.enum(["male", "female"]),
  nationality: z.string().min(1, "Nationality is required"),
  dob: z.string().min(1, "Date of birth is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  bio: z.string().min(1, "Bio is required"),
  web_site: z.string().url().optional().or(z.literal("")),
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

type FormValues = z.infer<typeof formSchema>;

interface UpdateCardFormProps {
  params: { id: string };
}

export default function UpdateCardForm({ params }: UpdateCardFormProps) {
  const router = useRouter();
  const { id } = params;

  const { GET_CARD, UPDATE_CARD } = cardRequest();

  const { data: cardData, isLoading, isError } = useQuery<CardItem>({
    queryKey: ["card", id],
    queryFn: () => GET_CARD(id),
    enabled: !!id,
  });

  const updateCardMutation = useMutation({
    mutationFn: (payload: CreateCardType) => UPDATE_CARD(id, payload),
    onSuccess: () => {
      router.push("/");
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "male",
      nationality: "",
      dob: "",
      address: "",
      phone: "",
      bio: "",
      web_site: "",
      job: "",
      company: "",
      card_type: "Minimal",
      social: [{ platform: "", icon: "", url: "" }],
    },
  });

  const { control, handleSubmit, reset, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "social",
  });

  const [socialIcons, setSocialIcons] = useState<Record<number, File | null>>({});
  const [iconPreviews, setIconPreviews] = useState<Record<number, string>>({});

  useEffect(() => {
    if (cardData) {
      let formattedDob = "";
      if (cardData.dob) {
        const dateObj = new Date(cardData.dob);
        if (!isNaN(dateObj.getTime())) {
          formattedDob = dateObj.toISOString().slice(0, 10);
        }
      }

      reset({
        gender: cardData.gender || "male",
        nationality: cardData.nationality || "",
        dob: formattedDob,
        address: cardData.address || "",
        phone: cardData.phone || "",
        bio: cardData.bio || "",
        web_site: cardData.web_site || "",
        job: cardData.job || "",
        company: cardData.company || "",
        card_type: cardData.card_type || "Minimal",
        social:
          Array.isArray(cardData.socialLinks) && cardData.socialLinks.length > 0
            ? cardData.socialLinks.map((s) => ({
                id: s.id,
                platform: s.platform,
                icon: s.icon,
                url: s.url,
              }))
            : [{ platform: "", icon: "", url: "" }],
      });

      const previews: Record<number, string> = {};
      if (Array.isArray(cardData.socialLinks)) {
        cardData.socialLinks.forEach((link, idx) => {
          if (link.icon) previews[idx] = link.icon;
        });
      }
      setIconPreviews(previews);
    }
  }, [cardData, reset]);

  const isValidImage = (file: File) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const maxSize = 2 * 1024 * 1024; // 2MB
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  };

  const uploadIcon = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:8000/api/v1/upload/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Image upload failed");
    }

    const data = await res.json();
    return data.url;
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (!cardData) return;

      const mergedPayload: CreateCardType = {
        gender: values.gender || cardData.gender,
        nationality: values.nationality.trim() || cardData.nationality,
        dob: values.dob || cardData.dob,
        address: values.address.trim() || cardData.address,
        phone: values.phone.trim() || cardData.phone,
        bio: values.bio.trim() || cardData.bio,
        web_site: values.web_site?.trim() || cardData.web_site,
        job: values.job?.trim() || cardData.job,
        company: values.company?.trim() || cardData.company,
        card_type: values.card_type || cardData.card_type,
        social: [],
        avatar: cardData.avatar || "",
      };

      mergedPayload.social = await Promise.all(
        values.social.map(async (item, idx) => {
          const file = socialIcons[idx];
          if (file) {
            const iconUrl = await uploadIcon(file);
            return {
              id: item.id || "",
              platform: item.platform.trim(),
              url: item.url.trim(),
              icon: iconUrl,
            };
          }
          return {
            id: item.id || "",
            platform:
              item.platform.trim() ||
              (cardData.socialLinks?.[idx]?.platform || ""),
            url: item.url.trim() || (cardData.socialLinks?.[idx]?.url || ""),
            icon: iconPreviews[idx] || (cardData.socialLinks?.[idx]?.icon || ""),
          };
        })
      );

      updateCardMutation.mutate(mergedPayload);
    } catch (err) {
      alert("Failed to upload images");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading card data</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6">
         <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-pink-300">
           <h1 className="text-3xl font-extrabold mb-8 text-center text-pink-600 tracking-wide">
             Create Your Card
           </h1>
   
           <Form {...form}>
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
               {/* Card Type & Gender */}
               <div className="grid grid-cols-2 gap-6">
                 <FormField
                   control={control}
                   name="card_type"
                   render={({ field }) => (
                     <FormItem className="flex flex-col">
                       <FormLabel className="text-sm font-semibold text-pink-700">
                         Card Type
                       </FormLabel>
                       <FormControl>
                         <Select
                           value={field.value}
                           onValueChange={field.onChange}
                         >
                           <SelectTrigger className="w-full py-2 px-3 rounded-lg border border-pink-300 text-pink-800 shadow-sm bg-pink-50 hover:bg-pink-100 focus:ring-2 focus:ring-pink-400">
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
                       <FormLabel className="text-sm font-semibold text-pink-700">
                         Gender
                       </FormLabel>
                       <FormControl>
                         <Select
                           value={field.value}
                           onValueChange={field.onChange}
                         >
                           <SelectTrigger className="w-full py-2 px-3 rounded-lg border border-pink-300 text-pink-800 shadow-sm bg-pink-50 hover:bg-pink-100 focus:ring-2 focus:ring-pink-400">
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
   
               {/* Nationality & DOB */}
               <div className="grid grid-cols-2 gap-6">
                 <FormField
                   control={control}
                   name="nationality"
                   render={({ field }) => (
                     <FormItem className="flex flex-col">
                       <FormLabel className="text-sm font-semibold text-pink-700">
                         Nationality
                       </FormLabel>
                       <FormControl>
                         <Input
                           {...field}
                           placeholder="e.g. American"
                           className="rounded-lg border border-pink-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
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
                       <FormLabel className="text-sm font-semibold text-pink-700">
                         Date of Birth
                       </FormLabel>
                       <FormControl>
                         <Input
                           type="date"
                           {...field}
                           className="rounded-lg border border-pink-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                         />
                       </FormControl>
                       <FormMessage className="text-xs text-red-500 mt-1" />
                     </FormItem>
                   )}
                 />
               </div>
   
               {/* Address & Phone */}
               <div className="grid grid-cols-2 gap-6">
                 <FormField
                   control={control}
                   name="address"
                   render={({ field }) => (
                     <FormItem className="flex flex-col">
                       <FormLabel className="text-sm font-semibold text-pink-700">
                         Address
                       </FormLabel>
                       <FormControl>
                         <Input
                           {...field}
                           placeholder="Your address"
                           className="rounded-lg border border-pink-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
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
                       <FormLabel className="text-sm font-semibold text-pink-700">
                         Phone
                       </FormLabel>
                       <FormControl>
                         <Input
                           {...field}
                           placeholder="+1 123 456 7890"
                           className="rounded-lg border border-pink-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                         />
                       </FormControl>
                       <FormMessage className="text-xs text-red-500 mt-1" />
                     </FormItem>
                   )}
                 />
               </div>
   
               {/* Bio */}
               <FormField
                 control={control}
                 name="bio"
                 render={({ field }) => (
                   <FormItem className="flex flex-col">
                     <FormLabel className="text-sm font-semibold text-pink-700">
                       Bio
                     </FormLabel>
                     <FormControl>
                       <Input
                         {...field}
                         placeholder="Tell us about yourself"
                         className="rounded-lg border border-pink-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                       />
                     </FormControl>
                     <FormMessage className="text-xs text-red-500 mt-1" />
                   </FormItem>
                 )}
               />
   
               {/* Job & Company */}
               <div className="grid grid-cols-2 gap-6">
                 <FormField
                   control={control}
                   name="job"
                   render={({ field }) => (
                     <FormItem className="flex flex-col">
                       <FormLabel className="text-sm font-semibold text-pink-700">
                         Job
                       </FormLabel>
                       <FormControl>
                         <Input
                           {...field}
                           placeholder="Your job title"
                           className="rounded-lg border border-pink-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                         />
                       </FormControl>
                       <FormMessage className="text-xs text-red-500 mt-1" />
                     </FormItem>
                   )}
                 />
   
                 <FormField
                   control={control}
                   name="company"
                   render={({ field }) => (
                     <FormItem className="flex flex-col">
                       <FormLabel className="text-sm font-semibold text-pink-700">
                         Company
                       </FormLabel>
                       <FormControl>
                         <Input
                           {...field}
                           placeholder="Your company"
                           className="rounded-lg border border-pink-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                         />
                       </FormControl>
                       <FormMessage className="text-xs text-red-500 mt-1" />
                     </FormItem>
                   )}
                 />
               </div>
   
               {/* Website */}
               <FormField
                 control={control}
                 name="web_site"
                 render={({ field }) => (
                   <FormItem className="flex flex-col">
                     <FormLabel className="text-sm font-semibold text-pink-700">
                       Website
                     </FormLabel>
                     <FormControl>
                       <Input
                         {...field}
                         placeholder="https://example.com"
                         className="rounded-lg border border-pink-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                       />
                     </FormControl>
                     <FormMessage className="text-xs text-red-500 mt-1" />
                   </FormItem>
                 )}
               />
   
               {/* Social Links */}
               <div>
                 <h3 className="text-xl font-semibold mb-4 text-pink-600">
                   Social Media Links
                 </h3>
                 {fields.map((fieldItem, idx) => (
                   <div
                     key={fieldItem.id}
                     className="relative mb-6 p-5 border border-pink-200 rounded-xl shadow-sm bg-pink-50"
                   >
                     <Button
                       type="button"
                       variant="ghost"
                       size="icon"
                       className="absolute top-3 right-3"
                       onClick={() => {
                         remove(idx);
                         setIconPreviews((prev) => {
                           const copy = { ...prev };
                           delete copy[idx];
                           return copy;
                         });
                         setSocialIcons((prev) => {
                           const copy = { ...prev };
                           delete copy[idx];
                           return copy;
                         });
                       }}
                     >
                       <Trash2 className="w-5 h-5 text-pink-600" />
                     </Button>
   
                     {/* Icon Upload */}
                     <label
                       htmlFor={`icon-upload-${idx}`}
                       className="cursor-pointer mb-4 flex items-center space-x-4"
                     >
                       <Avatar className="w-14 h-14 ring-2 ring-pink-400 rounded-full">
                         {iconPreviews[idx] ? (
                           <AvatarImage src={iconPreviews[idx]} alt="Icon" />
                         ) : (
                           <AvatarFallback>
                             {watch(`social.${idx}.platform`)?.[0]?.toUpperCase() || "?"}
                           </AvatarFallback>
                         )}
                       </Avatar>
                       <span className="text-sm text-pink-600 underline font-semibold">
                       </span>
                     </label>
                     <input
                       type="file"
                       id={`icon-upload-${idx}`}
                       accept="image/png, image/jpeg, image/jpg, image/webp"
                       className="hidden"
                       onChange={(e) => {
                         const file = e.target.files?.[0];
                         if (file && isValidImage(file)) {
                           setSocialIcons((prev) => ({ ...prev, [idx]: file }));
                           setIconPreviews((prev) => ({
                             ...prev,
                             [idx]: URL.createObjectURL(file),
                           }));
                         } else {
                           alert("Invalid image or too large (max 2MB)");
                         }
                       }}
                     />
   
                     {/* Platform */}
                     <FormField
                       control={control}
                       name={`social.${idx}.platform`}
                       render={({ field }) => (
                         <FormItem className="flex flex-col mb-3">
                           <FormLabel className="text-sm font-semibold text-pink-700">
                             Platform
                           </FormLabel>
                           <FormControl>
                             <Input
                               {...field}
                               placeholder="Platform name"
                               className="rounded-lg border border-pink-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                             />
                           </FormControl>
                           <FormMessage className="text-xs text-red-500 mt-1" />
                         </FormItem>
                       )}
                     />
   
                     {/* URL */}
                     <FormField
                       control={control}
                       name={`social.${idx}.url`}
                       render={({ field }) => (
                         <FormItem className="flex flex-col">
                           <FormLabel className="text-sm font-semibold text-pink-700">
                             URL
                           </FormLabel>
                           <FormControl>
                             <Input
                               {...field}
                               placeholder="https://..."
                               className="rounded-lg border border-pink-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
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
                   variant="outline"
                   onClick={() => append({ platform: "", icon: "", url: "" })}
                   className="flex items-center space-x-2 border-pink-400 text-pink-600 hover:bg-pink-100"
                 >
                   <Plus className="w-5 h-5" />
                   <span>Add Social Link</span>
                 </Button>
               </div>
   
               {/* Submit */}
   <div className="flex flex-col-12 sm:flex-row rounded-xl justify-center gap-4 pt-4">
              <Button type="submit" className="w-full rounded-xl" disabled={updateCardMutation.isPending}>
              {updateCardMutation.isPending ? "Updating..." : "Update Card"}
            </Button>
     
     <Button
       type="button"
       variant="outline"
       className="w-40 sm:w-40 border-pink-400 text-pink-600 hover:bg-pink-100 font-semibold py-3 rounded-xl shadow"
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
