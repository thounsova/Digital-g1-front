"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

import { CardItem } from "@/app/types/card-type";
import { IUser } from "@/app/types/user-typ";
import { cardRequest } from "@/lib/api/card-api";

import QRCode from "react-qr-code";

type CorporateCardProps = {
  me: IUser;
  card: CardItem;
  idx: number;
  onDeleteSuccess?: () => void;
};

const CorporateCard = ({
  me,
  card,
  idx,
  onDeleteSuccess = () => {},
}: CorporateCardProps) => {
  const { DELETE_CARD } = cardRequest();
  const [open, setOpen] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setProfileUrl(
        `${window.location.origin}/profile/${me?.data.user_name || me?.data.id}`
      );
    }
  }, [me]);

  const deleteCardMutation = useMutation({
    mutationFn: (id: string) => DELETE_CARD(id),
    onSuccess: () => {
      toast.success("លុបបានជោគជ័យ! / Card deleted successfully.");
      onDeleteSuccess();
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error("បរាជ័យក្នុងការលុប! / Failed to delete.", {
        description: error?.message || "Unknown error.",
      });
    },
  });

  const handleDownloadVCard = async () => {
    const toBase64 = async (url: string): Promise<string> => {
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () =>
          resolve(reader.result?.toString().split(",")[1] || "");
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };

    let avatarBase64 = "";
    if (me?.data.avatar) {
      try {
        avatarBase64 = await toBase64(me.data.avatar);
      } catch {}
    }

    const vcard = [
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
    ]
      .filter(Boolean)
      .join("\r\n");

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${me?.data.full_name?.replace(/\s+/g, "_")}_${idx + 1}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("🎉 vCard បានទាញយក!", {
      description: "ទំនាក់ទំនងត្រូវបានរក្សាទុក",
      className: "bg-cyan-100 text-cyan-800 border border-cyan-300",
      duration: 4000,
    });
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-6">
      <Card
        className="relative border border-yellow-400 shadow-2xl overflow-hidden bg-cover bg-center rounded-xl"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/originals/f6/24/43/f624433ba377e1410da5dc346e7669c0.gif')",
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-800/90 via-orange-700/80 to-yellow-600/70 z-0" />

        <div className="relative z-10">
          <div className="absolute top-1 right-4 flex gap-2 z-20">
            <Link href={`/auth/update-card/${card.id}`}>
              <Button
                size="icon"
                variant="ghost"
                className="text-white border border-white/50 hover:bg-white/20"
                title="Edit"
              >
                <Pencil size={18} />
              </Button>
            </Link>

            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white border border-white/50 hover:bg-white/20"
                  title="Delete"
                >
                  <Trash2 size={18} className="text-red-400" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>បញ្ចាក់ / Confirm Deletion</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm leading-relaxed">
                    តើអ្នកពិតជាចង់លុបកាតនេះមែនទេ? វានឹងបាត់ទៅជាអចិន្ត្រៃយ៍។
                    <br />
                    Are you sure you want to delete this card? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>បោះបង់ / Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={deleteCardMutation.isPending}
                    onClick={() => deleteCardMutation.mutate(card.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    លុបចោល / Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <CardContent className="p-6 space-y-6 text-white">
            <div className="flex flex-col items-center gap-5">
              <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-red-700 via-orange-500 to-yellow-400 rotate-12 flex items-center justify-center shadow-xl">
                <Avatar className="w-28 h-28 border-4 border-white shadow-lg rotate-[-12deg]">
                  <AvatarImage src={me?.data?.avatar} alt={me?.data?.user_name} />
                  <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-orange-600 to-red-700 text-white">
                    {me?.data?.user_name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h1 className="text-3xl font-extrabold text-white text-center leading-tight drop-shadow-lg">
                {me?.data.full_name}
              </h1>
              <p className="text-sm bg-orange-500/95 px-8 py-2 rounded-full font-semibold tracking-wide text-center max-w-xs drop-shadow-md">
                {card.job}
              </p>
            </div>

            <div className="text-center">
              <Badge className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 text-white px-4 py-1 rounded-full shadow-md inline-block">
                {card.company}
              </Badge>
            </div>

            <div className="bg-white/20 p-4 rounded-lg text-sm text-white text-center font-light tracking-wide leading-relaxed drop-shadow-md">
              {card.bio}
            </div>

            <div className="px-4 grid grid-cols-2 gap-4 text-sm font-medium text-white mb-6">
              <ContactBox
                icon={<Phone className="text-yellow-400" />}
                label="Phone"
                value={card.phone}
              />
              <ContactBox
                icon={<Mail className="text-orange-400" />}
                label="Email"
                value={me?.data.email}
              />
              <ContactBox
                icon={<Globe className="text-red-400" />}
                label="Website"
                value={card.web_site}
              />
              <ContactBox
                icon={<MapPin className="text-yellow-500" />}
                label="Address"
                value={card.address}
              />
            </div>

            {/* QR Code Section */}
            {profileUrl && (
              <div className="flex justify-center my-6  p-4 rounded-lg shadow-md">
                <QRCode value={profileUrl} size={128} />
              </div>
            )}

            <Button
              onClick={handleDownloadVCard}
              className="w-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 hover:scale-105 transition-transform text-white shadow-lg font-semibold"
            >
              <Download className="w-5 h-5 mr-2" />
              Save My Contact
            </Button>

            <div className="mt-4 space-y-2">
              {card.socialLinks?.map((res, idx) => (
                <Link
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 hover:scale-105 transition-transform text-white w-full shadow"
                  >
                    <Avatar className="w-6 h-6 mr-2">
                      <AvatarImage src={res.icon} alt={res.platform} />
                      <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                        {res.platform[0]}
                      </AvatarFallback>
                    </Avatar>
                    {res.platform}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
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
  <div className="bg-gradient-to-r from-orange-500/20 via-red-500/20 to-yellow-500/20 p-3 rounded-lg backdrop-blur-sm shadow-md">
    <div className="flex items-center gap-2 mb-1 text-white font-semibold">
      {icon}
      <span>{label}</span>
    </div>
    <div className="text-white break-words text-sm font-light">{value || "-"}</div>
  </div>
);

export default CorporateCard;
