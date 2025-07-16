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
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-100 to-slate-200 py-8 px-4 sm:px-6">
      <div className="w-full max-w-xl mx-auto bg-white shadow-md overflow-hidden mb-8 relative rounded-2xl">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-pink-500 relative rounded-t-2xl">
          <img
            src="https://i.imgur.com/MHWLac7.gif"
            className="h-32 w-full object-cover rounded-t-2xl"
            alt="Banner"
          />
          <div className="absolute inset-0 bg-black/10 rounded-t-2xl" />
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="absolute top-2 right-0 rounded-l-full text-gray-950 bg-blue-200 hover:bg-blue-500"
          >
            <LogOut />
          </Button>
        </div>

        <div className="relative px-6 pb-6">
          <div className="flex justify-center -mt-14 mb-4">
            <Avatar className="w-24 h-24 border-4 border-white shadow-md">
              <AvatarImage src={me?.data?.avatar} alt="@user" />
              <AvatarFallback>
                {me?.data?.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="text-center space-y-2">
            {editMode ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <input
                  type="text"
                  {...register("full_name")}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border rounded text-center"
                  required
                />
                <input
                  type="text"
                  {...register("user_name")}
                  placeholder="Username"
                  className="w-full px-3 py-2 border rounded text-center"
                  required
                />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Email"
                  className="w-full px-3 py-2 border rounded text-center"
                  required
                />
                <div className="flex justify-center gap-2 pt-2">
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    type="button"
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
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {me?.data?.full_name}
                </h1>
                <div className="flex justify-center items-center gap-1 text-gray-600 text-sm flex-wrap">
                  <User className="w-4 h-4" />
                  <span className="truncate">@{me?.data?.user_name}</span>
                </div>
                <div className="flex justify-center items-center gap-1 text-gray-600 text-sm flex-wrap">
                  <Mail className="w-4 h-4" />
                  <span className="break-all">{me?.data?.email}</span>
                </div>
              </>
            )}
          </div>

          {!editMode && (
            <div className="mt-6 flex flex-col-12 sm:flex-row items-center justify-center gap-3 sm:gap-4 text-sm text-center">
              <Button
                variant="outline"
                className="gap-2 w-36 sm:w-auto sm:min-w-[140px] justify-center"
                onClick={() => setEditMode(true)}
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </Button>

              <Link
                href="/create-card"
                className="w-full sm:w-auto sm:min-w-[140px]"
              >
                <Button className="gap-2 w-36 bg-blue-700 justify-center">
                  <Plus className="w-4 h-4" />
                  Create Card
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-xl mx-auto space-y-6">
        {me?.data?.idCard?.length === 0 && (
          <div className="text-center text-gray-500">
            No cards found. Create one!
          </div>
        )}

        {me?.data?.idCard?.map((card: CardItem, idx: number) => (
          <div
            key={idx}
            className="hover:scale-[1.01] transition-all duration-300"
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
        ))}
      </div>
    </div>
  );
}
