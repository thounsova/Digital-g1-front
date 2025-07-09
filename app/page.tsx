"use client";

import { useEffect, useState } from "react";
import Homepage from "./auth/Login/page";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen  bg-amber-400">
        <img
          src="https://i.pinimg.com/originals/4e/f0/6f/4ef06fe341c30c1d090165b007bbd1cc.gif"
          alt="Legend Cinema"
          className="w-64 h-auto animate-pulse"
        />
      </div>
    );
  }

  return <Homepage />;
}
