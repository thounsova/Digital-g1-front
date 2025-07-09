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
      <div className="flex items-center justify-center min-h-screen  bg-white">
        <img
          src="https://logodix.com/logo/467939.gif"
          alt="Legend Cinema"
          className="w-64 h-auto animate-pulse"
        />
      </div>
    );
  }

  return <Homepage />;
}
