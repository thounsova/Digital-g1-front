"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/app/Store/authStore";
import { userRequest } from "@/lib/api/user-api";
import { authRequest } from "@/lib/api/auth-api";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpdateUserDialog from "@/components/profile-card/update-user-dialog";

import CorporateCard from "@/components/profile-card/corporate-card";
import ModernCard from "@/components/profile-card/modern-card";
import MinimalCard from "@/components/profile-card/minimal-card";

import { Plus, Pencil, LogOut } from "lucide-react";
import Link from "next/link";
import { User } from "lucide-react";

import { CardItem } from "@/app/types/card-type";
import { IUser } from "@/app/types/user-typ";

export default function ProfilePage() {
  const { isAuthenticated, checkAuth, logout } = useAuthStore();
  const { PROFILE } = userRequest();
  const { AUTH_LOGOUT } = authRequest();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [openDialog, setOpenDialog] = useState(false);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [showLoading, setShowLoading] = useState(true);

  // On mount, check auth
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect to login if NOT authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/Login");
    }
  }, [isAuthenticated, router]);

  // Fetch user profile (only runs if authenticated)
  const { data: me, isLoading } = useQuery<IUser>({
    queryKey: ["me"],
    queryFn: PROFILE,
    enabled: isAuthenticated, // only fetch if logged in
  });

  // Loading indicator for profile fetch
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShowLoading(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(true);
    }
  }, [isLoading]);

  // Set cards when user data loads
  useEffect(() => {
    if (me?.data?.idCard) {
      setCards(me.data.idCard);
    }
  }, [me]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await AUTH_LOGOUT();
    } catch (err) {
      console.error("Logout failed:", err);
    }
    logout(); // clears Zustand state and cookies
    router.push("/auth/Login");
  };

  // Remove card locally + invalidate profile query
  const handleRemoveCard = (deletedCardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== deletedCardId));
    queryClient.invalidateQueries({ queryKey: ["me"] });
  };

  if (showLoading) {
    return (
      <div className="flex justify-center mt-36 items-center py-20">
        <div className="w-96 h-52">
          <img
            src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/21618192445957.5e4bc54becda4.gif"
            alt="Loading"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-200">
      <div className="w-full max-w-sm mx-auto bg-white/80 shadow-lg backdrop-blur overflow-hidden mb-8 border border-orange-200">
        {/* Header */}
        <div className="relative h-36 bg-gradient-to-r from-orange-300 to-yellow-400">
          {me?.data?.cover_image ? (
            <img
              src={me.data.cover_image}
              alt="Cover"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-orange-300 to-yellow-400" />
          )}
          <div className="absolute inset-0 bg-black/10" />
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="absolute top-3 right-3 text-orange-600 bg-white/90 p-4 rounded-xl border border-orange-300 hover:bg-red-100"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Avatar and Profile Info */}
        <div className="px-6 pb-6 -mt-12 relative text-center max-w-md mx-auto">
          <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-md">
            <AvatarImage src={me?.data?.avatar} alt="@user" />
            <AvatarFallback className="bg-orange-500 text-white font-bold text-lg">
              {me?.data?.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <h2 className="mt-3 text-2xl font-semibold text-gray-900">
            {me?.data?.full_name}
          </h2>

          <div className="flex items-center justify-center gap-2 text-gray-600">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">@{me?.data?.user_name}</span>
          </div>

          <p className="text-sm text-gray-600">{me?.data?.email}</p>

          <div className="mt-6 flex flex-col-12 sm:flex-row justify-center gap-4 max-w-xs mx-auto">
            <Button
              onClick={() => setOpenDialog(true)}
              className="bg-white hover:bg-orange-500 text-gray-950 hover:text-white flex items-center justify-center w-40 sm:w-auto px-6 py-2 rounded-lg shadow-md transition"
            >
              <Pencil className="w-5 h-5 mr-2" />
              Edit Profile
            </Button>

            <Link href="/auth/create-card" passHref>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center w-40 sm:w-auto px-6 py-2 rounded-lg shadow-md transition">
                <Plus className="w-5 h-5 mr-2" />
                Create Card
              </Button>
            </Link>
          </div>

          {me?.data && (
            <UpdateUserDialog
              open={openDialog}
              setOpen={setOpenDialog}
              user={me.data}
              onSave={() => {
                queryClient.invalidateQueries({ queryKey: ["me"] });
                setOpenDialog(false);
              }}
            />
          )}
        </div>
      </div>

      {/* Cards List */}
      <div className="relative w-full max-w-3xl mx-auto">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-orange-500 translate-x-[-50%]" />

        <div className="space-y-12">
          {cards.length === 0 ? (
            <div className="text-center text-gray-500">
              No cards found. Create one!
            </div>
          ) : (
            cards.map((card: CardItem, idx: number) => (
              <div
                key={card.id}
                className="relative flex items-center hover:scale-[1.01] transition-transform duration-300"
              >
                <div className="absolute left-1/2 w-4 h-4 bg-amber-500 rounded-full border-4 border-white translate-x-[-50%]" />

                <div className="w-full">
                  {card.card_type === "Corporate" && (
                    <CorporateCard
                      me={me!}
                      card={card}
                      idx={idx}
                      onDeleteSuccess={() => handleRemoveCard(card.id)}
                    />
                  )}
                  {card.card_type === "Modern" && (
                    <ModernCard
                      me={me!}
                      card={card}
                      idx={idx}
                      onDeleteSuccess={() => handleRemoveCard(card.id)}
                    />
                  )}
                  {card.card_type === "Minimal" && (
                    <MinimalCard
                      me={me!}
                      card={card}
                      idx={idx}
                      onDeleteSuccess={() => handleRemoveCard(card.id)}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
