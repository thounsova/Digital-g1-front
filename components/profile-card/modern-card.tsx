"use client";

import React, { useState, useEffect } from "react";
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

import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CardItem } from "@/app/types/card-type";
import { IUser } from "@/app/types/user-typ";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cardRequest } from "@/lib/api/card-api";
import { toast } from "sonner";
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

import QRCode from "react-qr-code";

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
  const [showDialog, setShowDialog] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/profile/${
        me?.data.user_name || me?.data.id
      }`;
      console.log("QR Code URL:", url);
      setProfileUrl(url);
    }
  }, [me]);

  const deleteCardMutation = useMutation({
    mutationFn: (id: string) => DELETE_CARD(id),
    onSuccess: () => {
      toast.success("លុបបានជោគជ័យ!");
      onDeleteSuccess();
      setShowDialog(false);
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
    onError: (error: any) => {
      toast.error("បរាជ័យក្នុងការលុប: " + (error?.message || "មិនស្គាល់បញ្ហា"));
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
    <div className="bg-white/90 p-4 rounded-xl border border-pink-200 shadow-md text-sm flex flex-col">
      <div className="flex items-center gap-2 text-gray-600 mb-1 font-semibold">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-gray-800 break-words">{value}</p>
    </div>
  );

  // Helper: convert avatar URL to base64 for vCard photo
  const toBase64 = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () =>
          resolve(reader.result?.toString().split(",")[1] || "");
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto  relative">
      <Card
        className="relative border-2  border-pink-500 shadow-xl rounded-3xl overflow-hidden bg-fit bg-center"
        style={{
          backgroundImage: `url('https://i.pinimg.com/originals/b8/26/1f/b8261f0163fff2cc01c5cb1159d4767b.gif')`,
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-pink-100/60 to-purple-100/70 z-0" />

        <div className="relative z-10">
          {/* Edit Button */}
          <Link
            href={`/auth/update-card/${card.id}`}
            className="absolute  right-3 z-20"
            aria-label="Edit card"
          >
            <Button
              size="icon"
              variant="outline"
              title="Edit"
              className="text-pink-600 border-pink-400 bg-white hover:bg-pink-100"
            >
              <Pencil size={16} />
            </Button>
          </Link>

          {/* Delete Button with AlertDialog */}
          <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="text-pink-600 border-pink-400 absolute  left-3 z-20 bg-white hover:bg-pink-100"
                title="Delete card"
                aria-label="Delete card"
              >
                <Trash2 size={18} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg text-red-600">
                  បញ្ញាក់ច្បាស់ / Confirm Deletion
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-700">
                  តើអ្នកពិតជាចង់លុបកាតនេះមែនទេ?
                  <br />
                  Are you sure you want to delete this card? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="mr-2">
                  បោះបង់ / Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteCardMutation.mutate(card.id)}
                  disabled={deleteCardMutation.isPending}
                  className="bg-pink-600 hover:bg-red-700 text-white"
                >
                  បាទ/ចាស លុប! / Yes, Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <CardContent className="p-8 space-y-8">
            {/* Avatar, Name, Job */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 rotate-12 flex items-center justify-center shadow-lg">
                <Avatar className="w-28 h-28 border-4 border-white shadow-lg rotate-[-12deg]">
                  <AvatarImage
                    src={me?.data?.avatar}
                    alt={me?.data?.user_name}
                  />
                  <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {me?.data?.user_name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h1 className="text-3xl font-extrabold text-pink-700 text-center">
                {me?.data.full_name}
              </h1>
              <p className="text-sm text-white bg-pink-400/90 px-6 py-2 rounded-full font-semibold tracking-wide text-center max-w-xs">
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

            {/* Scan QR Code Button with modal */}
            <AlertDialog open={qrOpen} onOpenChange={setQrOpen}>
              <AlertDialogTrigger asChild>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold">
                  ស្កេន QR Code / Scan QR Code
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="flex flex-col items-center justify-center space-y-4">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center">
                    QR Code សម្រាប់ពាក់ព័ន្ធ / QR Code for Contact
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center text-sm">
                    ស្កេន QR Code នេះដើម្បីទាញយកពត៌មានបន្ថែម។
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="bg-white p-4 rounded-xl shadow-md flex justify-center">
                  {profileUrl && <QRCode value={profileUrl} size={180} />}
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>បិទ / Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Download vCard */}
            <Button
              onClick={async () => {
                let avatarBase64 = "";
                if (me?.data.avatar) {
                  avatarBase64 = await toBase64(me.data.avatar);
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
                ).replace(/\s+/g, "_")}_${idx + 1}.vcf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                toast.success("🎉 vCard បានទាញយក!", {
                  description: "ទំនាក់ទំនងត្រូវបានរក្សាទុក",
                  className: "bg-cyan-100 text-cyan-800 border border-cyan-300",
                  duration: 4000,
                });
              }}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
            >
              <Download className="w-4 h-4 mr-2" />
              រក្សាទំនាក់ទំនង
            </Button>

            {/* Social Links */}
            {card.socialLinks?.map((res, idx: number) => (
              <div key={idx}>
                <Link href={res.url} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-500 hover:bg-slate-700 bg-transparent w-full"
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
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default CorporateCard;
