"use client";
import Card from "../Card/page";

import { useState } from "react";

const userData = {
  email: "arain@gmail.com",
  password: "reach123",
  user_name: "monjk",
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Categories");

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-800 to-purple-500 h-48 relative flex items-center justify-center">
        <div className="absolute  text-white font-semibold text-sm">
          <img
            src="https://i.pinimg.com/736x/2a/53/a9/2a53a919196eadda665db1ad0e075e50.jpg"
            alt=""
          />{" "}
        </div>

        {/* Profile Image */}
        <div className="absolute bottom-[-32px] w-24 h-24 rounded-full overflow-hidden border-4 border-white">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8W8i8KmDcgKi_RueO2O3D3i786B-LfUPZKw&s"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Info */}
      <div className="mt-16 text-center px-4">
        <h2 className="text-lg font-bold">Jody Wisternoff</h2>
        <p className="text-sm text-gray-500">
          Experimental electronic music pioneer. Half of duo Way Out West. Boss
          at Anjunadeep.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button className=" cursor-pointer hover:border-blue-500 bg-purple-300 px-6 py-2 rounded-full text-sm">
            Edit Profile
          </button>
          <a href="/auth/CreateForm">
            <button className="border cursor-pointer border-gray-400 bg-purple-600 px-6 py-2 text-white rounded-full text-sm">
              Create ID Card
            </button>
          </a>
        </div>

        {/* Stats */}
        <div className="flex justify-between text-center mt-6 px-6 text-sm text-gray-600">
          <div>
            <div className="font-bold text-black">236</div>
            <div>Records</div>
          </div>
          <div>
            <div className="font-bold text-black">23.6k</div>
            <div>Ratings</div>
          </div>
          <div>
            <div className="font-bold text-black">2.8k</div>
            <div>Followers</div>
          </div>
        </div>

        {/* User Account Info */}
        <div className="mt-6 text-left text-sm text-gray-700 bg-gray-100 p-4 rounded-xl">
          <div className="mb-2">
            <span className="font-medium">Email:</span> {userData.email}
          </div>
          <div className="mb-2">
            <span className="font-medium">Username:</span> {userData.user_name}
          </div>
          <div>
            <span className="font-medium">Password:</span> {userData.password}
          </div>
        </div>
      </div>
      
      <div className="mt-2 grid grid-cols-2 gap-4 px-4 "></div>
      <Card />
    </div>
  );
}
