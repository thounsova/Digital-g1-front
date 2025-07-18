"use client";

import React, { useState } from "react";
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
import { useRouter } from "next/navigation";

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
    link.download = `${me?.data.full_name?.replace(/\s+/g, "_")}_${
      idx + 1
    }.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-6">
      <Card className="relative bg-gradient-to-br from-purple-800 to-pink-800 border border-amber-300 shadow-lg overflow-hidden">
        {/* Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 z-20">
          <Link href={`/update-card/${card.id}`}>
            <Button
              size="icon"
              variant="ghost"
              className="text-white border border-white/40 hover:bg-white/10"
              title="Edit"
            >
              <Pencil size={16} />
            </Button>
          </Link>

          {/* Confirm Delete Dialog */}
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="text-white border border-white/40 hover:bg-white/10"
                title="Delete"
              >
                <Trash2 size={16} className="text-red-300" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>បញ្ចាក់ / Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription className="text-sm">
                  តើអ្នកពិតជាចង់លុបកាតនេះមែនទេ? វានឹងបាត់ទៅជាអចិន្ត្រៃយ៍។
                  <br />
                  Are you sure you want to delete this card? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>បោះបង់ / Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={deleteCardMutation.isPending}
                  onClick={() => deleteCardMutation.mutate(card.id)}
                >
                  លុបចោល / Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Card Content */}
        <CardContent className="p-6 space-y-6 text-white">
          {/* Avatar, Name, Job */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-red-500 via-red-400 to-yellow-400 rotate-12 flex items-center justify-center shadow-md">
              <Avatar className="w-28 h-28 border-4 border-white shadow-md rotate-[-12deg]">
                <AvatarImage src={me?.data?.avatar} alt={me?.data?.user_name} />
                <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-pink-600 to-red-700 text-white">
                  {me?.data?.user_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-3xl font-extrabold text-white text-center">
              {me?.data.full_name}
            </h1>
            <p className="text-sm text-white bg-indigo-500/90 px-6 py-2 rounded-full font-semibold tracking-wide text-center max-w-xs">
              {card.job}
            </p>
          </div>

          <div className="text-center">
            <Badge className="bg-blue-500 text-white px-3 py-1 rounded-full">
              {card.company}
            </Badge>
          </div>

          <div className="bg-white/10 p-3 rounded-lg text-sm text-white text-center">
            {card.bio}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm font-medium">
            <ContactBox icon={<Phone />} label="Phone" value={card.phone} />
            <ContactBox icon={<Mail />} label="Email" value={me?.data.email} />
            <ContactBox
              icon={<Globe />}
              label="Website"
              value={card.web_site}
            />
            <ContactBox
              icon={<MapPin />}
              label="Address"
              value={card.address}
            />
          </div>

          <Button
            onClick={handleDownloadVCard}
            className="w-full bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 hover:scale-105 transition-transform text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Save My Contact
          </Button>
        </CardContent>
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
  <div className="bg-white/5 p-3 rounded-md backdrop-blur-sm">
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <span>{label}</span>
    </div>
    <div className="text-white break-words">{value || "-"}</div>
  </div>
);

export default CorporateCard;
