"use client";

import React from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  Badge,
  Download,
  Phone,
  Mail,
  Globe,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { CardItem } from "@/app/types/card-type";
import { IUser } from "@/app/types/user-typ";
import { cardRequest } from "@/lib/api/card-api";

type CorporateCardProps = {
  me: IUser;
  card: CardItem;
  idx: number;
  onDeleteSuccess?: () => void; // made optional
};

const CorporateCard = ({
  me,
  card,
  idx,
  onDeleteSuccess = () => {}, // default no-op function
}: CorporateCardProps) => {
  const router = useRouter();
  const { DELETE_CARD } = cardRequest();

  const deleteCardMutation = useMutation({
    mutationFn: (id: string) => DELETE_CARD(id),
    onSuccess: () => {
      alert("Card deleted successfully!");
      onDeleteSuccess();
    },
    onError: (error: any) => {
      console.error("Delete card error:", error);
      alert("Failed to delete the card: " + (error?.message || "Unknown error"));
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      deleteCardMutation.mutate(card.id);
    }
  };

  const toBase64 = async (url: string): Promise<string> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result?.toString().split(",")[1] || "");
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleDownloadVCard = async () => {
    let avatarBase64 = "";
    if (me?.data.avatar) {
      try {
        avatarBase64 = await toBase64(me.data.avatar);
      } catch {
        avatarBase64 = "";
      }
    }

    const vcardLines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${me?.data.full_name}`,
      `N:${me?.data.full_name};;;;`,
      `ORG:${card.company}`,
      `TITLE:${card.job}`,
      `TEL;TYPE=WORK,VOICE:${card.phone}`,
      `EMAIL;TYPE=PREF,INTERNET:${me?.data.email}`,
      avatarBase64 ? `PHOTO;ENCODING=b;TYPE=JPEG:${avatarBase64}` : "",
      `URL:${card.web_site}`,
      `ADR;TYPE=WORK:;;${card.address};;;;`,
      `NOTE:${card.bio}`,
      "END:VCARD",
    ].filter(Boolean);

    const vcard = vcardLines.join("\r\n");

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${(me?.data.full_name ?? "User").replace(/\s+/g, "_")}_${idx + 1}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const ContactBox = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value?: string;
  }) => (
    <div className="bg-white/5 p-3 rounded-lg border border-white/10 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-white break-words">{value || "-"}</div>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto px-4 py-6">
      <Card className="bg-gradient-to-br from-purple-800 to-pink-800 border border-amber-300 shadow-lg relative overflow-hidden">
        {/* Edit Button */}
        <Link href={`/update-card/${card.id}`} className="absolute top-3 right-12 z-20">
          <Button
            size="icon"
            variant="ghost"
            className="text-white border border-white/40 hover:bg-white/10"
            title="Edit"
          >
            <Pencil size={16} />
          </Button>
        </Link>

        {/* Delete Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-2 text-white border border-white/40 hover:bg-white/10 z-20"
          title="Delete"
          onClick={handleDelete}
          disabled={deleteCardMutation.isPending}
        >
          <Trash2 size={16} className="text-red-300" />
        </Button>

        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-400/20 rounded-full" />
          <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-blue-400/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-green-400/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        <CardContent className="relative z-10 p-6 space-y-6">
          {/* Avatar & Name */}
          <div className="text-center">
            <div className="mx-auto mb-3 relative w-24 h-24">
              <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                <AvatarImage src={me?.data.avatar} alt={me?.data.user_name} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {me?.data.user_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full animate-pulse border-2 border-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{me?.data.full_name}</h2>
            <div className="text-sm font-semibold bg-pink-500 text-white px-3 py-1 rounded-full inline-block rotate-1">
              {card.job}
            </div>
          </div>

          {/* Company Badge */}
          <div className="text-center">
            <Badge className="bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded-full border-0 rotate-1">
              {card.company}
            </Badge>
          </div>

          {/* Bio */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg text-center text-white text-sm">
            {card.bio}
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-3 text-white text-xs font-medium">
            <ContactBox icon={<Phone className="text-yellow-400" />} label="Call Me" value={card.phone} />
            <ContactBox icon={<Mail className="text-cyan-400" />} label="Email Me" value={me?.data.email} />
            <ContactBox icon={<Globe className="text-green-400" />} label="Website" value={card.web_site} />
            <ContactBox icon={<MapPin className="text-orange-400" />} label="Address" value={card.address} />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleDownloadVCard}
              className="w-full bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 text-white font-bold hover:scale-105 transition-transform"
            >
              <Download className="w-4 h-4 mr-2" />
              Save My Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CorporateCard;
