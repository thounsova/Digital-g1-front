import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Badge,
  Download,
  Globe,
  Mail,
  MapPin,
  Phone,
  QrCode,
} from "lucide-react";
import { Button } from "../ui/button";
import { User, ICard } from "@/app/types/card-type";
import QRCode from "react-qr-code";

const CorporateCardService = ({
  me,
  card,
  idx,
}: {
  me: User;
  card: ICard;
  idx: number;
}) => {
  const [profileUrl, setProfileUrl] = useState("");
  const [showQR, setShowQR] = useState(false); // for modal toggle

  useEffect(() => {
    if (typeof window !== "undefined") {
      setProfileUrl(`${window.location.origin}/profile/${me.user_name}`);
    }
  }, [me.user_name]);

  return (
    <div className="max-w-sm mx-auto px-4 py-6">
      <Card
        className="relative rounded-2xl border border-orange-400 shadow-xl overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/originals/f6/24/43/f624433ba377e1410da5dc346e7669c0.gif')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-orange-800/70 to-yellow-700/60 z-0 rounded-2xl" />
        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 p-6">
            <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-red-700 via-orange-500 to-yellow-400 rotate-12 flex items-center justify-center shadow-xl">
              <Avatar className="w-24 h-24 border-4 border-white shadow-md rotate-[-12deg]">
                <AvatarImage src={me?.avatar} alt={me?.user_name} />
                <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-yellow-600 to-red-700 text-white">
                  {me?.user_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-2xl font-extrabold text-white text-center drop-shadow-md">
              {me?.full_name}
            </h1>
            <p className="text-sm text-white bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 px-4 py-1 rounded-full font-semibold tracking-wide text-center max-w-xs drop-shadow">
              {card.job}
            </p>
          </div>

          {/* Company Badge */}
          <div className="text-center mb-4">
            <Badge className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 text-white px-3 py-1 rounded-full shadow">
              {card.company}
            </Badge>
          </div>

          {/* Bio */}
          <div className="px-6 mb-5">
            <div className="bg-white/10 p-3 rounded-lg text-sm text-white text-center shadow-sm">
              {card.bio}
            </div>
          </div>

          {/* Contact Grid */}
          <div className="px-6 grid grid-cols-2 gap-4 text-sm font-medium text-white mb-6">
            <ContactBox
              icon={<Phone className="text-yellow-400" />}
              label="Phone"
              value={card.phone}
            />
            <ContactBox
              icon={<Mail className="text-orange-400" />}
              label="Email"
              value={me?.email}
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

          {/* Action Buttons */}
          <div className="px-6 mb-6 space-y-3">
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

                const avatarBase64 = me?.avatar
                  ? await toBase64(me.avatar)
                  : "";

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
                link.download = `${(me?.full_name ?? "Unnamed_User").replace(
                  " ",
                  "_"
                )}_${idx + 1}.vcf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              }}
              className="w-full bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 hover:scale-105 transition-transform text-white font-semibold shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Save My Contact
            </Button>

            {/* QR Button */}
            <Button
              variant="outline"
              onClick={() => setShowQR(true)}
              className="w-full text-white bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 hover:scale-105 transition-transform shadow"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Scan QR Code
            </Button>

            {/* Social Buttons */}
            {card.socialLinks?.length > 0 && (
              <div className="space-y-2">
                {card.socialLinks.map((res, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 hover:scale-105 transition-transform text-white w-full shadow"
                  >
                    <Avatar className="w-6 h-6 mr-2">
                      <AvatarImage src={res.icon} alt={res.platform} />
                      <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-yellow-600 to-red-700 text-white">
                        {res.platform[0]}
                      </AvatarFallback>
                    </Avatar>
                    {res.platform}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white w-[90%] max-w-sm p-6 rounded-2xl shadow-xl flex flex-col items-center">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold"
              aria-label="Close QR Modal"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Scan this QR Code
            </h2>
            <div className="p-4 bg-white border border-gray-200 rounded-xl">
              <QRCode value={profileUrl} size={160} />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Point your camera to scan this card
            </p>
          </div>
        </div>
      )}
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
  <div className="bg-white/10 p-3 rounded-md backdrop-blur-sm shadow-sm">
    <div className="flex items-center gap-2 mb-1 text-white">
      {icon}
      <span>{label}</span>
    </div>
    <div className="text-white break-words">{value || "-"}</div>
  </div>
);

export default CorporateCardService;
