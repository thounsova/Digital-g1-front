"use client";

import { useState } from "react";
import clsx from "clsx";

const styles = ["Minimal", "Modern", "Dark"];

const profiles = {
  name: "Your Name",
  position: "Job Position",
  id: "00.112.22.333",
  dob: "02/06/2023",
  contact: "00.123.456.789",
  email: "your.name@mail.com",
  issueDate: "14/07/23",
  expireDate: "12/07/26",
};

export default function DigitalIdCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeStyle, setActiveStyle] = useState("Minimal");

  const styleClasses = {
    Minimal: {
      front: "bg-white text-gray-900 border border-gray-300 shadow-md",
      back: "bg-gray-100 text-gray-900 border border-gray-300 shadow-md",
      profileImgWrapper: "bg-gray-200",
      barcode: "bg-gray-300",
      companyTextColor: "text-gray-900",
    },
    Modern: {
      front: "bg-gradient-to-br from-purple-600 to-indigo-500 text-white shadow-lg",
      back: "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg",
      profileImgWrapper: "bg-white",
      barcode: "bg-white",
      companyTextColor: "text-white",
    },
    Dark: {
      front: "bg-gray-900 text-gray-200 border border-gray-700 shadow-xl",
      back: "bg-gray-800 text-gray-200 border border-gray-700 shadow-xl",
      profileImgWrapper: "bg-gray-700",
      barcode: "bg-gray-700",
      companyTextColor: "text-green-400",
    },
  };

  // Safe fallback to Minimal style if activeStyle is invalid
  const cls = styleClasses[activeStyle] || styleClasses.Minimal;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8 gap-6">
      {/* Style Tabs */}
      <div className="flex gap-4">
        {styles.map((style) => (
          <button
            key={style}
            onClick={() => setActiveStyle(style)}
            className={clsx(
              "px-4 py-2 rounded font-semibold",
              activeStyle === style
                ? "bg-purple-600 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-purple-400 hover:text-white transition"
            )}
          >
            {style}
          </button>
        ))}
      </div>

      {/* Card */}
      <div
        className="w-80 h-[420px] perspective cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={clsx(
            "relative w-full h-full duration-700 transform-style-preserve-3d",
            isFlipped && "rotate-y-180"
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Side */}
          <div
            className={clsx(
              "absolute w-full h-full backface-hidden rounded-xl p-5",
              cls.front
            )}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-center mb-4">
              <h2 className={clsx("font-bold text-lg", cls.companyTextColor)}>
                Name Company
              </h2>
              <p className="text-sm opacity-80">Your Tagline Here</p>
            </div>

            <div
              className={clsx(
                "w-24 h-24 mx-auto rounded-full overflow-hidden mb-3 flex justify-center items-center",
                cls.profileImgWrapper
              )}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8W8i8KmDcgKi_RueO2O3D3i786B-LfUPZKw&s"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center mb-3">
              <h3 className="text-xl font-semibold">{profiles.name}</h3>
              <p className="text-sm">{profiles.position}</p>
            </div>

            <div className="text-sm space-y-1">
              <p>
                <strong>ID:</strong> {profiles.id}
              </p>
              <p>
                <strong>DOB:</strong> {profiles.dob}
              </p>
              <p>
                <strong>Contact:</strong> {profiles.contact}
              </p>
              <p className="break-all">
                <strong>Email:</strong> {profiles.email}
              </p>
            </div>

            <div
              className={clsx(
                "h-10 mt-4 rounded flex justify-center items-center",
                cls.barcode
              )}
            >
              <span
                className={
                  activeStyle === "Minimal"
                    ? "text-black text-xs"
                    : "text-white text-xs"
                }
              >
                [ Barcode ]
              </span>
            </div>
          </div>

          {/* Back Side */}
          <div
            className={clsx(
              "absolute w-full h-full backface-hidden rotate-y-180 rounded-xl p-5",
              cls.back
            )}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="text-center mb-4">
              <h2 className={clsx("font-bold text-lg", cls.companyTextColor)}>
                Name Company
              </h2>
              <p className="text-sm opacity-80">Your Tagline Here</p>
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
                <strong>Issue Date:</strong> {profiles.issueDate}
              </p>
              <p>
                <strong>Expire Date:</strong> {profiles.expireDate}
              </p>
              <div className="mt-3">
                <strong>Signature:</strong>
                <div className="italic">Your signature</div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 w-14 h-14 rounded overflow-hidden">
              <img
                src="https://i.pinimg.com/736x/d8/11/10/d81110f74b45542aa26eddc290592ed8.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Click card to flip front/back. Select style above.
      </p>
    </div>
  );
}
