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
  const [qrOpen, setQrOpen] = useState(false);
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

  const InfoBox = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <div className="bg-white p-4 rounded-xl border border-sky-200 shadow-md text-sm flex flex-col">
      <div className="flex items-center gap-2 text-sky-700 mb-1 font-semibold">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-gray-900 break-words">{value}</p>
    </div>
  );

  const handleDownloadVCard = async () => {
    alert("vCard download not implemented.");
  };

  return (
    <div className="max-w-sm mx-auto relative">
      <Card
        className="relative border-2 border-sky-400 shadow-lg rounded-3xl overflow-hidden"
        style={{
          backgroundImage:
            "url('https://dl.glitter-graphics.com/pub/3726/3726241zrr27qexjc.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50/90 to-cyan-100/70 z-0" />

        {/* Edit Button */}
        <Link
          href={`/auth/update-card/${card.id}`}
          className="absolute top-3 right-3 z-20"
          aria-label="Edit card"
        >
          <Button
            size="icon"
            variant="outline"
            title="Edit"
            className="text-sky-600 border-sky-400 bg-white hover:bg-sky-100"
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
              className="bg-white border border-sky-400 hover:bg-sky-100 absolute top-3 left-3 z-20"
              title="Delete"
            >
              <Trash2 size={16} className="text-sky-400" />
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
                className="bg-pink-600 hover:bg-red-700 text-white"
              >
                លុបចោល / Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <CardContent className="p-8 space-y-8 relative z-10">
          {/* Avatar, Name, Job */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-sky-400 via-cyan-500 to-sky-600 rotate-12 flex items-center justify-center shadow-md">
              <Avatar className="w-28 h-28 border-4 border-white shadow-md rotate-[-12deg]">
                <AvatarImage src={me?.data?.avatar} alt={me?.data?.user_name} />
                <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-cyan-600 to-sky-700 text-white">
                  {me?.data?.user_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-3xl font-extrabold text-sky-700 text-center">
              {me?.data.full_name}
            </h1>
            <p className="text-sm text-white bg-cyan-500/90 px-6 py-2 rounded-full font-semibold tracking-wide text-center max-w-xs">
              {card.job}
            </p>
          </div>

          {/* Company */}
          <div className="flex justify-center">
            <Badge className="bg-cyan-200 text-cyan-900 border-0 px-4 py-2 rounded-full text-sm shadow-sm">
              {card.company}
            </Badge>
          </div>

          {/* Bio */}
          <p className="text-center text-sm text-gray-900 bg-white p-5 rounded-xl border border-sky-200 shadow-inner leading-relaxed">
            {card.bio}
          </p>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-5">
            <InfoBox
              icon={<Phone className="text-cyan-600" />}
              label="Phone"
              value={card.phone}
            />
            <InfoBox
              icon={<Mail className="text-cyan-600" />}
              label="Email"
              value={me?.data?.email}
            />
            <InfoBox
              icon={<Globe className="text-cyan-600" />}
              label="Website"
              value={card.web_site}
            />
            <InfoBox
              icon={<MapPin className="text-cyan-600" />}
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
            onClick={handleDownloadVCard}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
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
                  className="border-cyan-600 text-cyan-700 hover:bg-cyan-100 bg-transparent w-full"
                >
                  <Avatar className="w-6 h-6 mr-2">
                    <AvatarImage src={res.icon} alt={res.platform} />
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-cyan-600 to-sky-700 text-white">
                      {res.platform[0]}
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
