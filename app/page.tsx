"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { userRequest } from "@/lib/api/user-api";
import { authRequest } from "@/lib/api/auth-api"; // ⬅️ import logout
import { useRouter } from "next/navigation";

import { User, Mail, Plus, Pencil, LogOut } from "lucide-react";
import { CardItem } from "@/app/types/card-type";
import CorporateCard from "@/components/profile-card/corporate-card";
import ModernCard from "@/components/profile-card/modern-card";
import MinimalCard from "@/components/profile-card/minimal-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { PROFILE } = userRequest();
  const { AUTH_LOGOUT } = authRequest();
  const router = useRouter();

  const { data: me, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => PROFILE(),
  });

  const handleLogout = async () => {
    try {
      await AUTH_LOGOUT();
    } catch (err) {
      console.error("Logout failed:", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/Login");
  };

  if (isLoading) return "Loading...";

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-100 to-slate-200 py-8">
      {/* Profile Header */}
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mb-6 relative">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-pink-500 relative rounded-t-2xl">
          <img src="https://i.imgur.com/MHWLac7.gif" className="h-32 w-full object-cover" alt="" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="relative px-6 pb-6">
          <div className="flex justify-center -mt-14 mb-4">
            <Avatar className="w-24 h-24 border-4 border-white shadow-md">
              <AvatarImage src={me?.data?.avatar} alt="@user" />
              <AvatarFallback>{me?.data?.full_name}</AvatarFallback>
            </Avatar>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">{me?.data?.full_name}</h1>
            <div className="flex justify-center items-center gap-2 text-gray-600 text-sm">
              <User className="w-4 h-4" />
              @{me?.data?.user_name}
            </div>
            <div className="flex justify-center items-center gap-2 text-gray-600 text-sm">
              <Mail className="w-4 h-4" />
              {me?.data?.email}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-center flex-wrap gap-4">
            <Link href="/update-profile">
              <Button variant="outline" className="gap-2 shadow-sm">
                <Pencil className="w-4 h-4" />
                Edit Profile
              </Button>
            </Link>

            <Link href="/create-card">
              <Button className="gap-2 shadow-sm">
                <Plus className="w-4 h-4" />
                Create Card
              </Button>
            </Link>

            <Button
              variant="destructive"
              className="gap-2 shadow-sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="w-full max-w-md mx-auto px-4 space-y-6">
        {me?.data?.idCard?.length === 0 && (
          <div className="text-center text-gray-500">No cards found. Create one!</div>
        )}

        {me?.data?.idCard?.map((card: CardItem, idx: number) => (
          <div key={idx} className="hover:scale-[1.01] transition-all duration-300">
            {card.card_type === "Corporate" && <CorporateCard me={me} card={card} idx={idx} />}
            {card.card_type === "Modern" && <ModernCard me={me} card={card} idx={idx} />}
            {card.card_type === "Minimal" && <MinimalCard me={me} card={card} idx={idx} />}
          </div>
        ))}
      </div>
    </div>
  );
}
