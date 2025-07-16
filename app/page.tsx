"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userRequest } from "@/lib/api/user-api";
import { authRequest } from "@/lib/api/auth-api";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
  const { PROFILE, updateProfile } = userRequest();
  const { AUTH_LOGOUT } = authRequest();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);

  // Fetch profile typed as IUser
  const { data: me, isLoading } = useQuery<IUser>({
    queryKey: ["profile"],
    queryFn: PROFILE,
  });

  // Form data type: pick editable fields from UserData
  type ProfileFormData = Pick<UserData, "full_name" | "user_name" | "email">;

  const { register, handleSubmit, reset } = useForm<ProfileFormData>({
    defaultValues: {
      full_name: "",
      user_name: "",
      email: "",
    },
  });

  // Sync form when me loads
  useEffect(() => {
    if (me?.data) {
      reset({
        full_name: me.data.full_name || "",
        user_name: me.data.user_name || "",
        email: me.data.email || "",
      });
    }
  }, [me, reset]);

  // Mutation for profile update
  const mutation = useMutation({
    mutationFn: (data: Partial<UserData>) => updateProfile(data),
    onSuccess: () => {
      setEditMode(false);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
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

  if (isLoading) return "Loading...";

 return (
  <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 py-10 px-4 sm:px-6">
    <div className="w-full max-w-2xl mx-auto bg-white/80 shadow-lg backdrop-blur rounded-3xl overflow-hidden mb-8 border border-pink-200">
      {/* Header Banner */}
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
          className="absolute top-3 right-3 text-gray-800 hover:bg-red-100"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Avatar & Profile */}
      <div className="px-6 pb-6 -mt-12 relative text-center">
        <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-md">
          <AvatarImage src={me?.data?.avatar} alt="@user" />
          <AvatarFallback className="bg-pink-300 text-white font-bold text-lg">
            {me?.data?.full_name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="mt-4 space-y-2">
          {editMode ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <input
                {...register("full_name")}
                placeholder="Full Name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-center bg-white"
              />
              <input
                {...register("user_name")}
                placeholder="Username"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-center bg-white"
              />
              <input
                {...register("email")}
                placeholder="Email"
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-center bg-white"
              />

              <div className="flex justify-center gap-2 pt-3">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditMode(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">
                {me?.data?.full_name}
              </h1>
              <div className="text-gray-600 flex justify-center items-center gap-1">
                <User className="w-4 h-4" />
                <span>@{me?.data?.user_name}</span>
              </div>
              <div className="text-gray-600 flex justify-center items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{me?.data?.email}</span>
              </div>
            </>
          )}
        </div>

        {!editMode && (
          <div className="mt-6 flex flex-col-12 sm:flex-row justify-center gap-3 text-sm">
            <Button
              variant="outline"
              className="bg-pink-100 hover:bg-pink-200"
              onClick={() => setEditMode(true)}
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit Profile
            </Button>
            <Link href="/auth/Form-create">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                <Plus className="w-4 h-4 mr-1" />
                Create Card
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>

    {/* ID Cards Section */}
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {me?.data?.idCard?.length === 0 ? (
        <div className="text-center text-gray-500">No cards found. Create one!</div>
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
