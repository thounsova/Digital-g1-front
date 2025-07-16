"use client";

import React, { useState } from "react";

const ProfileCard = () => {
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [cardType, setCardType] = useState("Standard");
  const [themeColor, setThemeColor] = useState("#4f46e5");
  const [socialLinks, setSocialLinks] = useState<string[]>([""]);

  const handleSocialChange = (value: string, index: number) => {
    const updated = [...socialLinks];
    updated[index] = value;
    setSocialLinks(updated);
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, ""]);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = {
      gender,
      dob,
      address,
      phone,
      nationality,
      cardType,
      themeColor,
      socialLinks: socialLinks.filter((link) => link.trim() !== ""),
    };
    console.log("Submitted Profile:", profile);
    alert("Profile Submitted!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Digital Profile Card
        </h1>

        <div className="space-y-4">
          {/* Gender dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              placeholder="e.g. Phnom Penh, Cambodia"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              placeholder="e.g. +85512345678"
            />
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nationality
            </label>
            <input
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              placeholder="e.g. Cambodian"
            />
          </div>

          {/* Card Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Card Type
            </label>
            <select
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          {/* Theme Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Theme Color
            </label>
            <input
              type="color"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="w-full h-10 rounded-md cursor-pointer border"
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Social Links
            </label>
            {socialLinks.map((link, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => handleSocialChange(e.target.value, index)}
                  placeholder="https://social.com/username"
                  className="flex-1 border rounded-md px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSocialLink}
              className="text-blue-600 hover:underline text-sm"
            >
              + Add Social Link
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg py-2 mt-2 hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProfileCard;
