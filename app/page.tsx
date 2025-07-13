"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { userRequest } from "@/lib/api/user-api";
import { User, Mail, LogOut } from "lucide-react";
// import { CardItem } from "@/types/card-type";
// import CorporateCard from "@/components/profile-card/corporate-card";

export default function Home() {
  const { PROFILE } = userRequest();
  const { data: me, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => PROFILE(),
  });
  if (isLoading) {
    return "loading...";
  }

  return (
    <div className="min-h-screen">
      <div className="p-4 items-center justify-center">
        {/* Header  */}
        <div className="w-full max-w-md mx-auto   shadow-lg border-0 rounded-t-2xl">
      <div className="bg-gradient-to-r from-blue-500 to-pink-500 relative rounded-t-2xl">
  {/* Logout Button Top-Right */}
  <div className="absolute top-2 left-[396px] transform -translate-x-1/2">
    <button
      // onClick={logout}
      className="flex items-center px-4 py-1.5 rounded-l-full bg-white/90 text-gray-800 font-medium hover:bg-white transition-shadow shadow hover:shadow-md"
    >
      <LogOut className="w-4 h-4 mr-1" />
      Logout
    </button>
  </div>
  <img
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSca37bB9I9ja8qwz6MXq84Gb4VR1zoxkwGLg&s"
    className="w-full h-32 object-cover"
    alt="header background"
  />
  <div className="absolute inset-0 bg-black/10"></div>
</div>
          <div className="relative px-6 pb-6">
            {/* Avatar  */}
            <div className="flex justify-center -mt-14 mb-4">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage src={me?.data?.avatar} alt="@evilrabbit" />
                  <AvatarFallback>{me?.data?.full_name}</AvatarFallback>
                </Avatar>

              </div>
              
            </div>

            {/* user info  */}
            <div className="text-center space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {me?.data?.full_name}
                </h1>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <User className="h-4 w-4" />@{me?.data?.user_name}
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />@{me?.data?.email}
              </div>
            </div>
          </div>
            <div className="flex justify-center gap-12 mt-4 text-gray-700 font-semibold">
    <div className="flex flex-col items-center">
      <span className="text-xl">256</span>
      <span className="text-sm text-gray-500">Followers</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-xl">128</span>
      <span className="text-sm text-gray-500">Likes</span>
    </div>
  </div>
          <div className="flex justify-center pb-2 gap-4 mt-6">
  <button
    // onClick={() => router.push("/profile/edit")}
    className="px-6 py-2 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-shadow shadow-md hover:shadow-lg"
  >
    Edit Profile
  </button>
  <button
    // onClick={() => router.push("/card/create")}
    className="px-6 py-2 rounded-full bg-white text-gray-900 font-semibold border border-gray-300 hover:bg-gray-100 transition-shadow shadow-md hover:shadow-lg"
  >
    Create Card
  </button>
</div>

        </div>
        <div className="w-full max-w-md mx-auto p-4">
          {/* <div className="grid grid-cols-1 gap-4">
            {me?.data?.idCard?.map((card: CardItem, idx: number) => {
              return (
                <div key={idx}>
                  {card.card_type === "Corporate" && (
                    <div>
                      <CorporateCard me={me} card={card} idx={idx} />
                    </div>
                  )}
                  {card.card_type === "Modern" && <div>test</div>}
                  {card.card_type === "Minimal" && <div>test</div>}
                </div>
              );
            })}
          </div> */}
        </div>
      </div>
    </div>
  );
}
