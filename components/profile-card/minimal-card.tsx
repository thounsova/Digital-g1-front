"use client";

import React from "react";
import {
  Download,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CardItem } from "@/app/types/card-type";
import { IUser } from "@/app/types/user-typ";

const ModernCard = ({
  me,
  card,
  idx,
}: {
  me: IUser;
  card: CardItem;
  idx: number;
}) => {
  return (
    <div className="max-w-sm mx-auto">
      <Card
        className="relative shadow-lg rounded-2xl overflow-hidden transition-all duration-300 border-2 border-blue-600"
        style={{
          backgroundImage: `url('https://i.pinimg.com/originals/69/e1/e9/69e1e9e87f45e37f68bdddd23990f9a5.gif')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none rounded-2xl" />

        <div className="relative z-10">
          {/* Edit Button */}
          <Link href={`/update-card/${card.id}`}>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-3 right-3 z-20 border-white/40 text-black hover:bg-white/10"
            >
              Edit
            </Button>
          </Link>

          <CardContent className="p-6 space-y-6 text-slate-100">
            {/* Avatar & Name */}
            <div className="flex flex-col items-center text-center space-y-2">
              <Avatar className="w-24 h-24 border-4 border-yellow-500 shadow-md">
                <AvatarImage src={me?.data?.avatar} alt={me?.data?.user_name} />
                <AvatarFallback className="text-2xl font-semibold bg-slate-700 text-white">
                  {me?.data?.user_name}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{me?.data.full_name}</h2>
              <span className="text-sm font-medium bg-indigo-500 bg-opacity-70 px-3 py-1 rounded-full">
                {card.job}
              </span>
            </div>

            {/* Company */}
            <div className="text-center">
              <span className="inline-block text-xs font-semibold bg-cyan-600 bg-opacity-60 px-3 py-1 rounded-full">
                {card.company}
              </span>
            </div>

            {/* Bio */}
            <p className="text-center text-sm text-gray-100 bg-white/10 p-4 rounded-xl border border-pink-200 shadow-inner">
              {card.bio}
            </p>
            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <InfoCard
                icon={<Phone size={16} />}
                label="Call Me"
                value={card.phone}
              />
              <InfoCard
                icon={<Mail size={16} />}
                label="Email Me"
                value={me?.data?.email}
              />
              <InfoCard
                icon={<Globe size={16} />}
                label="Website"
                value={card.web_site}
              />
              <InfoCard
                icon={<MapPin size={16} />}
                label="Address"
                value={card.address}
              />
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Button
                onClick={async () => {
                  const toBase64 = async (url: string) => {
                    const res = await fetch(url);
                    const blob = await res.blob();
                    return new Promise<string>((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onloadend = () =>
                        resolve(reader.result?.toString().split(",")[1] || "");
                      reader.onerror = reject;
                      reader.readAsDataURL(blob);
                    });
                  };

                  const avatarBase64 = me?.data.avatar
                    ? await toBase64(me?.data.avatar)
                    : "";

                  const vcard = [
                    "BEGIN:VCARD",
                    "VERSION:3.0",
                    `FN:${me?.data.full_name}`,
                    `N:${me?.data.full_name};;;;`,
                    `ORG:${card.company}`,
                    `TITLE:${card.job}`,
                    `TEL;TYPE=WORK,VOICE:${card.phone}`,
                    `EMAIL;TYPE=PREF,INTERNET:${me?.data.email}`,
                    avatarBase64
                      ? `PHOTO;ENCODING=b;TYPE=JPEG:${avatarBase64}`
                      : "",
                    `URL:${card.web_site}`,
                    `ADR;TYPE=WORK:;;${card.address};;;;`,
                    `NOTE:${card.bio}`,
                    "END:VCARD",
                  ]
                    .filter(Boolean)
                    .join("\r\n");

                  const blob = new Blob([vcard], {
                    type: "text/vcard;charset=utf-8",
                  });

                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `${(
                    me?.data.full_name ?? "Unnamed_User"
                  ).replace(" ", "_")}_${idx + 1}.vcf`;

                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow"
              >
                <Download className="w-4 h-4 mr-2" /> Save Contact
              </Button>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/40 text-black hover:bg-white/10"
                >
                  <Linkedin className="w-4 h-4 mr-1" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/40 text-black hover:bg-white/10"
                >
                  <Github className="w-4 h-4 mr-1" />
                  GitHub
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

// InfoCard component
const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="bg-white/10 p-3 rounded-lg border border-white/20">
    <div className="flex items-center space-x-2 mb-1 text-white/90">
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </div>
    <p className="text-sm text-white break-words">{value}</p>
  </div>
);

export default ModernCard;
