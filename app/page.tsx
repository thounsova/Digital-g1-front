"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userRequest } from "@/lib/api/user-api";
import { authRequest } from "@/lib/api/auth-api";
import { useState, useEffect } from "react";
import { User } from "lucide-react";

import { useRouter } from "next/navigation";

import UpdateUserDialog from "@/components/profile-card/update-user-dialog";

import { Plus, Pencil, LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardItem } from "@/app/types/card-type";
import CorporateCard from "@/components/profile-card/corporate-card";
import ModernCard from "@/components/profile-card/modern-card";
import MinimalCard from "@/components/profile-card/minimal-card";
import { IUser } from "@/app/types/user-typ";

export default function ProfilePage() {
  const { PROFILE } = userRequest();
  const { AUTH_LOGOUT } = authRequest();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [openDialog, setOpenDialog] = useState(false);
  const [cards, setCards] = useState<CardItem[]>([]);

  // Fetch current user data with cards
  const { data: me, isLoading } = useQuery<IUser>({
    queryKey: ["me"],
    queryFn: PROFILE,
  });

  // State to keep spinner visible at least 2 seconds
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 3000); // minimum 2 seconds loading spinner
      return () => clearTimeout(timer);
    } else {
      setShowLoading(true);
    }
  }, [isLoading]);

  // Update local cards state when user data changes
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/Login");
  };

  // Remove card from local state and refetch user profile query (cache) after delete
  const handleRemoveCard = (deletedCardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== deletedCardId));
    queryClient.invalidateQueries({ queryKey: ["me"] });
  };

  if (showLoading)
    return (
      <div className="flex justify-center mt-64 items-center py-20">
        <div className="w-96 h-96 ">
          <img
            src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/21618192445957.5e4bc54becda4.gif"
            alt="Loading"
          />
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 ">
      <div className="w-full max-w-sm mx-auto bg-white/80 shadow-lg backdrop-blur overflow-hidden mb-8 border border-pink-200">
        {/* Header */}
        <div className="relative h-36 bg-gradient-to-r from-pink-300 to-purple-400 ">
          <img
            src="https://design4users.com/wp-content/uploads/2021/05/mastercard-logo-concept.gif"
            alt="Banner"
            className="h-full w-full object-cover "
          />
          <div className="absolute inset-0 bg-black/10 " />
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="absolute top-3 right-3 text-pink-500 bg-white/90 p-4 rounded-xl border border-pink-400 hover:bg-red-100"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Avatar and Profile Info */}
        <div className="px-6 pb-6 -mt-12 relative text-center max-w-md mx-auto">
          <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-md">
            <AvatarImage src={me?.data?.avatar} alt="@user" />
            <AvatarFallback className="bg-pink-500 text-white font-bold text-lg">
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
              className="bg-white hover:bg-pink-500 text-gray-950 hover:text-white flex items-center justify-center w-40 sm:w-auto px-6 py-2 rounded-lg shadow-md transition"
            >
              <Pencil className="w-5 h-5 mr-2" />
              Edit Profile
            </Button>

            <Link href="/auth/create-card" passHref>
              <Button className="bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center w-40 sm:w-auto px-6 py-2 rounded-lg shadow-md transition">
                <Plus className="w-5 h-5 mr-2" />
                Create Card
              </Button>
            </Link>
          </div>

          {/* UpdateUserDialog */}
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
        {/* Vertical line spanning entire container height */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-pink-600 translate-x-[-50%]" />

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
                {/* Dot on the line aligned with each card */}
                <div className="absolute left-1/2 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white translate-x-[-50%]" />

                {/* Card with some left margin to avoid overlapping line */}
                <div className=" w-full">
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
