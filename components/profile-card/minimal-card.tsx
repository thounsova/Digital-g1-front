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

  const InfoBox = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-md text-sm flex flex-col">
      <div className="flex items-center gap-2 text-indigo-700 mb-1 font-semibold">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-gray-900 break-words">{value}</p>
    </div>
  );

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

    toast.success("🎉 vCard បានទាញយក!", {
      description: "ទំនាក់ទំនងត្រូវបានរក្សាទុក",
      className: "bg-cyan-100 text-cyan-800 border border-cyan-300",
      duration: 4000,
    });
  };

  return (
    <div className="max-w-sm mx-auto relative">
      <Card className="relative bg-gradient-to-br border-2 border-blue-400 from-blue-50 to-indigo-50 shadow-lg rounded-3xl overflow-hidden">
        {/* Edit Button */}
        <Link
          href={`/update-card/${card.id}`}
          className="absolute top-3 right-3 z-20"
          aria-label="Edit card"
        >
          <Button
            size="icon"
            variant="outline"
            title="Edit"
            className="text-blue-600 border-blue-400 bg-white hover:bg-blue-100"
          >
            <Pencil size={16} />
          </Button>
        </Link>

        {/* Delete Button with AlertDialog */}
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className=" bg-white border-1 border-blue-400 hover:bg-blue-100  absolute
              top-3
              left-3
              z-20 "
              title="Delete"
            >
              <Trash2 size={16} className="text-blue-400" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>បញ្ចាក់ / Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                តើអ្នកពិតជាចង់លុបកាតនេះមែនទេ? វានឹងបាត់ទៅជាអចិន្ត្រៃយ៍។
                <br />
                Are you sure you want to delete this card? This action cannot be
                undone.
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

        <CardContent className="p-8 space-y-8">
          {/* Avatar, Name, Job */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rotate-12 flex items-center justify-center shadow-md">
              <Avatar className="w-28 h-28 border-4 border-white shadow-md rotate-[-12deg]">
                <AvatarImage src={me?.data?.avatar} alt={me?.data?.user_name} />
                <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                  {me?.data?.user_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-3xl font-extrabold text-indigo-700 text-center">
              {me?.data.full_name}
            </h1>
            <p className="text-sm text-white bg-indigo-500/90 px-6 py-2 rounded-full font-semibold tracking-wide text-center max-w-xs">
              {card.job}
            </p>
          </div>

          {/* Company */}
          <div className="flex justify-center">
            <Badge className="bg-indigo-200 text-indigo-900 border-0 px-4 py-2 rounded-full text-sm shadow-sm">
              {card.company}
            </Badge>
          </div>

          {/* Bio */}
          <p className="text-center text-sm text-gray-900 bg-white p-5 rounded-xl border border-blue-200 shadow-inner leading-relaxed">
            {card.bio}
          </p>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-5">
            <InfoBox
              icon={<Phone className="text-indigo-600" />}
              label="Phone"
              value={card.phone}
            />
            <InfoBox
              icon={<Mail className="text-indigo-600" />}
              label="Email"
              value={me?.data?.email}
            />
            <InfoBox
              icon={<Globe className="text-indigo-600" />}
              label="Website"
              value={card.web_site}
            />
            <InfoBox
              icon={<MapPin className="text-indigo-600" />}
              label="Address"
              value={card.address}
            />
          </div>

          {/* Download vCard */}
          <Button
            onClick={handleDownloadVCard}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            រក្សាទុកទំនាក់ទំនង
          </Button>

          {/* Social Links */}
          {card.socialLinks?.map((res, idx) => (
            <div key={idx}>
              <Link href={res.url} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-indigo-600 text-indigo-700 hover:bg-indigo-100 bg-transparent w-full"
                >
                  <Avatar className="w-6 h-6 mr-2">
                    <AvatarImage src={res.icon} alt={res.platform} />
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                      {res.platform}
                    </AvatarFallback>
                  </Avatar>
                  {res.platform}
                </Button>
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CorporateCard;
