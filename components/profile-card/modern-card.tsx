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
  Pencil,
  Trash2,
} from "lucide-react";

import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CardItem } from "@/app/types/card-type";
import { IUser } from "@/app/types/user-typ";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cardRequest } from "@/lib/api/card-api";

const CorporateCard = ({
  me,
  card,
  idx,
  onDeleteSuccess,
}: {
  me: IUser;
  card: CardItem;
  idx: number;
  onDeleteSuccess: () => void;
}) => {
  const queryClient = useQueryClient();
  const { DELETE_CARD } = cardRequest();

  const deleteMutation = useMutation({
    mutationFn: () => DELETE_CARD(card.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      onDeleteSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to delete the card:", error);
    },
  });

  return (
    <div className="max-w-sm mx-auto relative">
      <Card className="relative bg-gradient-to-br border-2 border-pink-500 from-pink-100 to-purple-100 shadow-xl rounded-3xl overflow-hidden">
        {/* Edit Button */}
        <Link href={`/update-card/${card.id}`} className="absolute top-3 right-3 z-20">
          <Button
            size="icon"
            variant="outline"
            title="Edit"
            className="text-pink-600 border-pink-400 bg-white hover:bg-pink-100"
          >
            <Pencil size={16} />
          </Button>
        </Link>

        {/* Delete Button */}
        <Button
          size="icon"
          variant="destructive"
          title="Delete"
          className="absolute top-3 left-3 z-20 bg-white border-red-400 text-red-600 hover:bg-red-100"
          onClick={() => {
            if (confirm("Are you sure you want to delete this card?")) {
              deleteMutation.mutate();
            }
          }}
        >
          <Trash2 size={16} />
        </Button>

        <CardContent className="p-8 space-y-8">
          {/* Avatar, Name, Job */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 rotate-12 flex items-center justify-center shadow-lg">
              <Avatar className="w-28 h-28 border-4 border-white shadow-lg rotate-[-12deg]">
                <AvatarImage src={me?.data?.avatar} alt={me?.data?.user_name} />
                <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {me?.data?.user_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-3xl font-extrabold text-pink-700">{me?.data.full_name}</h1>
            <p className="text-sm text-white bg-pink-400/90 px-6 py-2 rounded-full font-semibold tracking-wide">
              {card.job}
            </p>
          </div>

          {/* Company */}
          <div className="flex justify-center">
            <Badge className="bg-yellow-200 text-yellow-800 border-0 px-4 py-2 rounded-full text-sm shadow-md">
              {card.company}
            </Badge>
          </div>

          {/* Bio */}
          <p className="text-center text-sm text-gray-800 bg-white/70 p-5 rounded-xl border border-pink-200 shadow-inner leading-relaxed">
            {card.bio}
          </p>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-5">
            <InfoBox icon={<Phone className="text-pink-500" />} label="Phone" value={card.phone} />
            <InfoBox icon={<Mail className="text-purple-500" />} label="Email" value={me?.data?.email} />
            <InfoBox icon={<Globe className="text-blue-500" />} label="Website" value={card.web_site} />
            <InfoBox icon={<MapPin className="text-green-500" />} label="Address" value={card.address} />
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
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
                link.download = `${(me?.data.full_name ?? "Unnamed_User").replace(" ", "_")}_${idx + 1}.vcf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              }}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Save Contact
            </Button>

            {/* Social Links */}
            {card.socialLinks.map((res, idx: number) => (
              <div key={idx}>
                <Link href={res.url} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent w-full"
                  >
                    <Avatar className="w-6 h-6 mr-2">
                      <AvatarImage src={res.icon} alt={res.platform} />
                      <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {res.platform}
                      </AvatarFallback>
                    </Avatar>
                    {res.platform}
                  </Button>
                </Link>
              </div>
            ))}
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
  <div className="bg-white/90 p-4 rounded-xl border border-pink-200 shadow-md text-sm">
    <div className="flex items-center gap-2 text-gray-500 mb-1 font-semibold">
      {icon}
      <span>{label}</span>
    </div>
    <p className="text-gray-800 break-words">{value}</p>
  </div>
);

export default CorporateCard;
