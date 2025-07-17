"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userRequest } from "@/lib/api/user-api";
import { authRequest } from "@/lib/api/auth-api";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import UpdateUserDialog from "@/components/profile-card/update-user-dialog";

import { User, Mail, Plus, Pencil, LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardItem } from "@/app/types/card-type";
import CorporateCard from "@/components/profile-card/corporate-card";
import ModernCard from "@/components/profile-card/modern-card";
import MinimalCard from "@/components/profile-card/minimal-card";
import { IUser, UserData } from "@/app/types/user-typ";

export default function Home() {
  const { PROFILE, UPDATE_USER } = userRequest();
  const { AUTH_LOGOUT } = authRequest();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { data: me, isLoading } = useQuery<IUser>({
    queryKey: ["me"],
    queryFn: PROFILE,
  });

  type ProfileFormData = Pick<UserData, "full_name" | "user_name" | "email">;

  const { register, handleSubmit, reset } = useForm<ProfileFormData>({
    defaultValues: {
      full_name: "",
      user_name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (me?.data) {
      reset({
        full_name: me.data.full_name || "",
        user_name: me.data.user_name || "",
        email: me.data.email || "",
      });
    }
  }, [me, reset]);

  const mutation = useMutation({
    mutationFn: (data: Partial<UserData>) => UPDATE_USER(data),
    onSuccess: () => {
      setEditMode(false);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error: any) => {
      console.error("Update profile failed:", error);
      alert("Failed to update profile. Please try again.");
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    mutation.mutate(data);
  };

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

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 py-10 px-4 sm:px-6">
      <div className="w-full max-w-sm mx-auto bg-white/80 shadow-lg backdrop-blur rounded-3xl overflow-hidden mb-8 border border-pink-200">
        {/* Header */}
        <div className="relative h-36 bg-gradient-to-r from-pink-300 to-purple-400 rounded-t-3xl">
          <img
            src="https://i.imgur.com/MHWLac7.gif"
            alt="Banner"
            className="h-full w-full object-cover rounded-t-3xl"
          />
          <div className="absolute inset-0 bg-black/10 rounded-t-3xl" />
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="absolute top-3 right-3 text-pink-300 hover:bg-red-100"
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
          <p className="text-sm text-gray-600">{me?.data?.email}</p>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 max-w-xs mx-auto">
            <Button
              onClick={() => setOpenDialog(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center w-full sm:w-auto px-6 py-2 rounded-lg shadow-md transition"
            >
              <Pencil className="w-5 h-5 mr-2" />
              Edit Profile
            </Button>

            <Link href="/auth/Form-create" passHref>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center w-full sm:w-auto px-6 py-2 rounded-lg shadow-md transition">
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
      <div className="w-full max-w-3xl mx-auto space-y-6">
        {me?.data?.idCard?.length === 0 ? (
          <div className="text-center text-gray-500">
            No cards found. Create one!
          </div>
        ) : (
          me?.data?.idCard?.map((card: CardItem, idx: number) => (
            <div
              key={idx}
              className="hover:scale-[1.01] transition-transform duration-300"
            >
              {card.card_type === "Corporate" && (
                <CorporateCard me={me} card={card} idx={idx} />
              )}
              {card.card_type === "Modern" && (
                <ModernCard me={me} card={card} idx={idx} />
              )}
              {card.card_type === "Minimal" && (
                <MinimalCard me={me} card={card} idx={idx} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
