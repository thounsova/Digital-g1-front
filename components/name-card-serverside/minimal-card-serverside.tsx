"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Download,
  Phone,
  Mail,
  Globe,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ICard, User } from "@/app/types/card-type";

import QRCode from "react-qr-code";

const MinimalCardServerSide = ({
  me,
  card,
  idx,
}: {
  me: User;
  card: ICard;
  idx: number;
}) => {
  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setProfileUrl(
        `${window.location.origin}/profile/${me.user_name || me.email}`
      );
    }
  }, [me]);

  const handleDownloadVCard = async () => {
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

    const avatarBase64 = me?.avatar ? await toBase64(me.avatar) : "";

    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${me.full_name}`,
      `N:${me.full_name};;;;`,
      `ORG:${card.company}`,
      `TITLE:${card.job}`,
      `TEL;TYPE=WORK,VOICE:${card.phone}`,
      `EMAIL;TYPE=PREF,INTERNET:${me.email}`,
      avatarBase64 ? `PHOTO;ENCODING=b;TYPE=JPEG:${avatarBase64}` : "",
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
    link.download = `${(me.full_name ?? "Unnamed_User").replace(" ", "_")}_${
      idx + 1
    }.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-sm mx-auto relative">
      <Card
        className="relative border-2 border-sky-600 shadow-lg rounded-3xl overflow-hidden"
        style={{
          backgroundImage: `url('https://dl.glitter-graphics.com/pub/3726/3726241zrr27qexjc.gif')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50/90 to-sky-100/70 z-0" />

        <CardContent className="p-8 space-y-8 relative z-10">
          {/* Avatar, Name, Job */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-sky-400 via-cyan-500 to-sky-600 rotate-12 flex items-center justify-center shadow-md">
              <Avatar className="w-28 h-28 border-4 border-white shadow-md rotate-[-12deg]">
                <AvatarImage src={me.avatar} alt={me.user_name} />
                <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-cyan-600 to-sky-700 text-white">
                  {me.user_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-3xl font-extrabold text-sky-700 text-center">
              {me.full_name}
            </h1>
            <p className="text-sm text-white bg-sky-500/90 px-6 py-2 rounded-full font-semibold tracking-wide text-center max-w-xs">
              {card.job}
            </p>
          </div>

          {/* Company */}
          <div className="flex justify-center">
            <Badge className="bg-sky-200 text-sky-900 border-0 px-4 py-2 rounded-full text-sm shadow-sm">
              {card.company}
            </Badge>
          </div>

          {/* Bio */}
          <p className="text-center text-sm text-gray-900 bg-white p-5 rounded-xl border border-sky-200 shadow-inner leading-relaxed">
            {card.bio}
          </p>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-5">
            {[
              { icon: <Phone className="text-sky-600" />, label: "Phone", value: card.phone },
              { icon: <Mail className="text-sky-600" />, label: "Email", value: me.email },
              { icon: <Globe className="text-sky-600" />, label: "Website", value: card.web_site },
              { icon: <MapPin className="text-sky-600" />, label: "Address", value: card.address },
            ].map(({ icon, label, value }, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl border border-sky-200 shadow-md text-sm flex flex-col"
              >
                <div className="flex items-center gap-2 text-sky-700 mb-1 font-semibold">
                  {icon}
                  <span>{label}</span>
                </div>
                <p className="text-gray-900 break-words">{value}</p>
              </div>
            ))}
          </div>

          {/* QR Code */}
          {profileUrl && (
            <div className="flex justify-center bg-white p-4 rounded-xl shadow-md">
              <QRCode value={profileUrl} size={128} />
            </div>
          )}

          {/* Download vCard */}
          <Button
            onClick={handleDownloadVCard}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            Add to Address Book
          </Button>

          {/* Social Links */}
          <div>
            {card.socialLinks?.map((res, idx) => (
              <div key={idx} className="mt-2">
                <Button
                  variant="outline"
                  className="w-full border-sky-600 text-sky-700 hover:bg-sky-50 font-serif bg-transparent flex items-center"
                >
                  <Avatar className="w-6 h-6 mr-2">
                    <AvatarImage src={res.icon} alt={res.platform} />
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-cyan-500 to-sky-700 text-white">
                      {res.platform[0]}
                    </AvatarFallback>
                  </Avatar>
                  {res.platform}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MinimalCardServerSide;
