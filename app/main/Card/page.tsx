"use client";
import { FaFacebookF, FaTelegramPlane } from "react-icons/fa";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";

export default function DigitalIdCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  const profile = {
    name: "Your Name",
    position: "Job Position",
    id: "00.112.22.333",
    dob: "02/06/2023",
    contact: "00.123.456.789",
    email: "your.name@mailll.com",
    issueDate: "14/07/23",
    expireDate: "12/07/26",
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div
        className="w-80 h-[420px] perspective cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={clsx(
            "relative w-full h-full duration-700 transform-style-preserve-3d",
            isFlipped && "rotate-y-180"
          )}
        >
          {/* Front Side */}
          <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-green-700 to-green-400 text-white rounded-xl p-5 shadow-xl">
            <div className="text-center mb-4">
              <h2 className="font-bold text-lg">Name Company</h2>
              <p className="text-sm">Your Tagline Here</p>
            </div>

            <div className="bg-white w-24 h-24 mx-auto rounded-full overflow-hidden mb-3">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8W8i8KmDcgKi_RueO2O3D3i786B-LfUPZKw&s"
                alt=""
              />
            </div>

            <div className="text-center mb-3">
              <h3 className="text-xl font-semibold">{profile.name}</h3>
              <p className="text-sm">{profile.position}</p>
            </div>

            <div className="text-sm space-y-1">
              <p>
                <strong>ID:</strong> {profile.id}
              </p>
              <p>
                <strong>DOB:</strong> {profile.dob}
              </p>
              <p>
                <strong>Contact:</strong> {profile.contact}
              </p>
              <p className="break-all">
                <strong>Email:</strong> {profile.email}
              </p>
            </div>

            <div className="bg-white h-10 mt-4 rounded flex justify-center items-center">
              <span className="text-black text-xs">[ Barcode ]</span>
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white text-gray-800 border border-gray-300 rounded-xl p-5 shadow-xl">
            <div className="text-center mb-4">
              <h2 className="font-bold text-green-700 text-lg">Name Company</h2>
              <p className="text-sm text-gray-500">Your Tagline Here</p>
            </div>

            <div className="text-sm mb-4 space-y-2">
              <p className="font-semibold">Terms and Conditions</p>
              <ul className="list-disc pl-5">
                <li>Use card while on duty</li>
                <li>Lost card = replacement fee</li>
                <li>Found card? Contact company</li>
              </ul>
            </div>

            <div className="text-sm space-y-1">
              <p>
                <strong>Issue Date:</strong> {profile.issueDate}
              </p>
              <p>
                <strong>Expire Date:</strong> {profile.expireDate}
              </p>
              <div className="mt-3">
                <strong>Signature:</strong>
                <div className="italic">Your signature</div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 w-14 h-14 rounded overflow-hidden">
              <img
                src="https://i.pinimg.com/736x/d8/11/10/d81110f74b45542aa26eddc290592ed8.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
