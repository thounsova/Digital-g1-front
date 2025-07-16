"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardItem } from "@/app/types/card-type";
import { IUser } from "@/app/types/user-typ";

type FormData = {
  full_name: string;
  user_name: string;
  email: string;
  job: string;
  company: string;
  phone: string;
  web_site: string;
  address: string;
  bio: string;
  linkedin?: string;
  github?: string;
};

const CorporateCardForm = ({
  me,
  card,
  idx,
  onSubmit,
}: {
  me: IUser;
  card: CardItem;
  idx: number;
  onSubmit: (data: FormData) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      full_name: me?.data.full_name || "",
      user_name: me?.data.user_name || "",
      email: me?.data.email || "",
      job: card.job || "",
      company: card.company || "",
      phone: card.phone || "",
      web_site: card.web_site || "",
      address: card.address || "",
      bio: card.bio || "",
      linkedin: "",
      github: "",
    },
  });

  return (
    <div className="max-w-sm mx-auto space-y-4 relative">
      <Card className="relative bg-gradient-to-br border-2 border-pink-500 from-pink-100 to-purple-100 shadow-xl rounded-3xl">
        <CardContent className="p-6 space-y-6">
          {/* Avatar + Name */}
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 rounded-2xl rotate-12 flex items-center justify-center shadow-lg">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={me?.data?.avatar}
                    alt={me?.data?.user_name}
                  />
                  <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {me?.data?.user_name}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <input
              {...register("full_name", { required: "Full name required" })}
              className="text-2xl font-bold text-pink-700 text-center w-full bg-transparent border-b-2 border-pink-300 focus:outline-none focus:border-pink-600"
            />
            {errors.full_name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.full_name.message}
              </p>
            )}

            <input
              {...register("job")}
              placeholder="Job Title"
              className="text-sm text-white bg-pink-400/90 px-4 py-1 rounded-full inline-block mt-1 font-medium w-full text-center"
            />
          </div>

          {/* Company */}
          <div className="text-center">
            <input
              {...register("company")}
              placeholder="Company"
              className="bg-yellow-200 text-yellow-800 border-0 px-3 py-1 rounded-full text-sm shadow-sm text-center font-semibold"
            />
          </div>

          {/* Bio */}
          <textarea
            {...register("bio")}
            placeholder="Bio"
            rows={4}
            className="text-center text-sm text-gray-700 bg-white/60 p-4 rounded-xl border border-pink-200 shadow-inner w-full resize-none"
          />

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-3">
            <InputInfoBox
              icon={<Phone className="text-pink-500" />}
              label="Phone"
              {...register("phone")}
              placeholder="Phone number"
            />
            <InputInfoBox
              icon={<Mail className="text-purple-500" />}
              label="Email"
              {...register("email")}
              placeholder="Email address"
              type="email"
            />
            <InputInfoBox
              icon={<Globe className="text-blue-500" />}
              label="Website"
              {...register("web_site")}
              placeholder="Website URL"
            />
            <InputInfoBox
              icon={<MapPin className="text-green-500" />}
              label="Address"
              {...register("address")}
              placeholder="Address"
            />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-2 gap-2">
            <InputInfoBox
              icon={<Linkedin className="text-blue-600" />}
              label="LinkedIn"
              {...register("linkedin")}
              placeholder="LinkedIn URL"
            />
            <InputInfoBox
              icon={<Github className="text-gray-800" />}
              label="GitHub"
              {...register("github")}
              placeholder="GitHub URL"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold shadow-md transition-all"
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const InputInfoBox = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & {
    icon: React.ReactNode;
    label: string;
  }
>(({ icon, label, ...inputProps }, ref) => (
  <div className="bg-white/80 p-3 rounded-xl border border-pink-100 shadow-sm text-sm">
    <div className="flex items-center gap-2 text-gray-500 mb-1">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    <input
      {...inputProps}
      ref={ref}
      className="text-gray-800 break-words font-medium w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-pink-500"
    />
  </div>
));

InputInfoBox.displayName = "InputInfoBox";

export default CorporateCardForm;
