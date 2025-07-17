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
import { toast } from "sonner";

const ModernCard = ({
  me,
  card,
  idx,
}: {
  me: IUser;
  card: CardItem;
  idx: number;
}) => {
  const queryClient = useQueryClient();
  const { DELETE_CARD } = cardRequest();

  const { mutate: deleteCard, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => DELETE_CARD(id),
    onSuccess: () => {
      toast.success("✅ Card deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
    onError: () => {
      toast.error("❌ Failed to delete card.");
    },
  });

  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this card?");
    if (confirmDelete) {
      deleteCard(card.id);
    }
  };

  const handleDownloadVCard = async () => {
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
    link.download = `${(me?.data.full_name ?? "User")
      .replace(" ", "_")}_${idx + 1}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-sm mx-auto px-4">
      <Card
        className="relative shadow-lg rounded-2xl overflow-hidden border-2 border-blue-600"
        style={{
          backgroundImage: `url('https://i.pinimg.com/originals/69/e1/e9/69e1e9e87f45e37f68bdddd23990f9a5.gif')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60 rounded-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="absolute top-3 right-3 z-20 flex gap-2">
            <Link href={`/update-card/${card.id}`}>
              <Button
                size="icon"
                variant="outline"
                className="border-white/40 text-amber-400 hover:bg-cyan-300"
                aria-label="Edit"
              >
                <Pencil size={16} />
              </Button>
            </Link>

            <Button
              size="icon"
              variant="outline"
              className="border-white/40 text-red-500 hover:bg-red-600/40"
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label="Delete"
            >
              {isDeleting ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Trash2 size={16} />
              )}
            </Button>
          </div>

          <CardContent className="p-6 space-y-6 text-white">
            {/* Avatar & Name */}
            <div className="flex flex-col items-center text-center space-y-2">
              <Avatar className="w-24 h-24 border-4 border-yellow-500 shadow-lg">
                <AvatarImage src={me?.data?.avatar} alt={me?.data?.user_name} />
                <AvatarFallback className="bg-slate-700 text-white text-2xl font-semibold">
                  {me?.data?.user_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{me?.data.full_name}</h2>
              <span className="text-sm bg-indigo-600 bg-opacity-70 px-3 py-1 rounded-full font-medium">
                {card.job}
              </span>
            </div>

            {/* Company */}
            <div className="text-center">
              <span className="inline-block text-xs font-semibold bg-cyan-700 bg-opacity-60 px-3 py-1 rounded-full">
                {card.company}
              </span>
            </div>

            {/* Bio */}
            <p className="text-center text-sm bg-white/10 p-4 rounded-xl border border-pink-200">
              {card.bio}
            </p>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <InfoCard icon={<Phone size={16} />} label="Call Me" value={card.phone} />
              <InfoCard icon={<Mail size={16} />} label="Email Me" value={me?.data?.email} />
              <InfoCard icon={<Globe size={16} />} label="Website" value={card.web_site} />
              <InfoCard icon={<MapPin size={16} />} label="Address" value={card.address} />
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleDownloadVCard}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-serif"
              >
                <Download className="w-4 h-4 mr-2" />
                Add to Address Book
              </Button>

              {card.socialLinks?.length > 0 && (
                <div className="space-y-2">
                  {card.socialLinks.map((res, index) => (
                    <Link key={index} href={res.url || "#"} target="_blank">
                      <Button
                        variant="outline"
                        className="w-full border-amber-600 text-gray-950 hover:bg-amber-600/20 font-serif"
                      >
                        <Avatar className="w-6 h-6 mr-2">
                          <AvatarImage src={res.icon} alt={res.platform} />
                          <AvatarFallback className="bg-blue-500 text-white">
                            {res.platform.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        {res.platform}
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

// Reusable Info Card
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
    <p className="text-sm break-words">{value || "-"}</p>
  </div>
);

export default ModernCard;
