"use client";

import React from "react";
import {
  Badge,
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

const CorporateCard = ({
  me,
  card,
  idx,
}: {
  me: IUser;
  card: CardItem;
  idx: number;
}) => {
  return (
    <div className="max-w-sm mx-auto space-y-4 relative">
      <Card className="relative bg-gradient-to-br from-pink-100 to-purple-100 border border-pink-200 shadow-xl rounded-3xl">
        {/* ✅ Edit Button */}
        <Link href={`/update-card/${card.id}`}>
          <Button
            size="sm"
            variant="outline"
            className="absolute top-3 right-3 z-10 border-pink-400 text-pink-600 bg-white hover:bg-pink-100 font-medium"
          >
            Edit
          </Button>
        </Link>

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
            <h1 className="text-2xl font-bold text-pink-700">
              {me?.data.full_name}
            </h1>
            <p className="text-sm text-white bg-pink-400/90 px-4 py-1 rounded-full inline-block mt-1 font-medium">
              {card.job}
            </p>
          </div>

          {/* Company */}
          <div className="text-center">
            <Badge className="bg-yellow-200 text-yellow-800 border-0 px-3 py-1 rounded-full text-sm shadow-sm">
              {card.company}
            </Badge>
          </div>

          {/* Bio */}
          <p className="text-center text-sm text-gray-700 bg-white/60 p-4 rounded-xl border border-pink-200 shadow-inner">
            {card.bio}
          </p>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-3">
            <InfoBox
              icon={<Phone className="text-pink-500" />}
              label="Phone"
              value={card.phone}
            />
            <InfoBox
              icon={<Mail className="text-purple-500" />}
              label="Email"
              value={me?.data?.email}
            />
            <InfoBox
              icon={<Globe className="text-blue-500" />}
              label="Website"
              value={card.web_site}
            />
            <InfoBox
              icon={<MapPin className="text-green-500" />}
              label="Address"
              value={card.address}
            />
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button
              onClick={async () => {
                const toBase64 = async (url: string) => {
                  const response = await fetch(url);
                  const blob = await response.blob();
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
                link.download = `${(me?.data.full_name ?? "Unnamed_User").replace(
                  " ",
                  "_"
                )}_${idx + 1}.vcf`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              }}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold shadow-md transition-all"
            >
              <Download className="w-4 h-4 mr-2" />
              Save Contact
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-500 hover:bg-blue-100 font-medium"
              >
                <Linkedin className="w-4 h-4 mr-1" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-300 text-purple-500 hover:bg-purple-100 font-medium"
              >
                <Github className="w-4 h-4 mr-1" />
                GitHub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InfoBox = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="bg-white/80 p-3 rounded-xl border border-pink-100 shadow-sm text-sm">
    <div className="flex items-center gap-2 text-gray-500 mb-1">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    <p className="text-gray-800 break-words font-medium">{value}</p>
  </div>
);

export default CorporateCard;
