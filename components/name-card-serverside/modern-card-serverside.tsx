import { Download, Globe, Mail, MapPin, Phone } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { ICard, User } from "@/app/types/card-type";
import QRCode from "react-qr-code";

const ModernCardServerSide = ({
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
        `${window.location.origin}/profile/${me?.user_name || me?.id}`
      );
    }
  }, [me]);

  return (
    <div className="max-w-sm mx-auto relative mt-10">
      <Card
        className="relative border-2 border-pink-500 shadow-xl rounded-3xl overflow-hidden bg-fit bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/originals/b8/26/1f/b8261f0163fff2cc01c5cb1159d4767b.gif')",
        }}
      >
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-pink-100/60 to-purple-100/70 z-0" />

        <CardContent className="relative z-10 p-8 space-y-8">
          {/* Avatar, Name, Job */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 rotate-12 flex items-center justify-center shadow-lg">
              <Avatar className="w-28 h-28 border-4 border-white shadow-lg rotate-[-12deg]">
                <AvatarImage src={me?.avatar} alt={me?.user_name} />
                <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {me?.user_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-3xl font-extrabold text-pink-700 text-center">
              {me?.full_name}
            </h1>
            <p className="text-sm text-white bg-pink-400/90 px-6 py-2 rounded-full font-semibold tracking-wide text-center max-w-xs">
              {card.job}
            </p>
          </div>

          {/* Company Badge */}
          <div className="flex justify-center">
            <div className="bg-yellow-200 text-yellow-800 border-0 px-4 py-2 rounded-full text-sm shadow-md">
              {card.company || "N/A"}
            </div>
          </div>

          {/* Bio */}
          <p className="text-center text-sm text-gray-800 bg-white/70 p-5 rounded-xl border border-pink-200 shadow-inner leading-relaxed">
            {card.bio || "No bio provided."}
          </p>

          {/* Contact Info Grid */}
          <div className="grid grid-cols-2 gap-5">
            {[
              {
                icon: <Phone className="text-pink-500" />,
                label: "Phone",
                value: card.phone,
              },
              {
                icon: <Mail className="text-purple-500" />,
                label: "Email",
                value: me?.email,
              },
              {
                icon: <Globe className="text-blue-500" />,
                label: "Website",
                value: card.web_site,
              },
              {
                icon: <MapPin className="text-green-500" />,
                label: "Location",
                value: card.address,
              },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="bg-white/90 p-4 rounded-xl border border-pink-200 shadow-md text-sm flex flex-col"
              >
                <div className="flex items-center gap-2 text-gray-600 mb-1 font-semibold">
                  {icon}
                  <span>{label}</span>
                </div>
                <p className="text-gray-800 break-words">{value || "N/A"}</p>
              </div>
            ))}
          </div>

          {/* QR Code Section */}
          {profileUrl && (
            <div className="flex flex-col items-center mt-6">
              <div className="bg-white p-2 rounded-md shadow-md">
                <QRCode value={profileUrl} size={128} />
              </div>
              <p className="mt-2 text-gray-700 text-sm select-none">
                Scan to view profile
              </p>
            </div>
          )}

          {/* Download vCard Button */}
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

              const avatarBase64 = me?.avatar ? await toBase64(me.avatar) : "";

              const vcard = [
                "BEGIN:VCARD",
                "VERSION:3.0",
                `FN:${me?.full_name}`,
                `N:${me?.full_name};;;;`,
                `ORG:${card.company}`,
                `TITLE:${card.job}`,
                `TEL;TYPE=WORK,VOICE:${card.phone}`,
                `EMAIL;TYPE=PREF,INTERNET:${me?.email}`,
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
              link.download = `${(me?.full_name ?? "Unnamed_User")
                .replace(/\s+/g, "_")
                }_${idx + 1}.vcf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            Save Contact
          </Button>

          {/* Social Links */}
          {card.socialLinks?.map((res, idx) => (
            <div key={idx}>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-500 hover:bg-slate-700 bg-transparent w-full"
              >
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src={res.icon} alt={res.platform} />
                  <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {res.platform.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {res.platform}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernCardServerSide;
