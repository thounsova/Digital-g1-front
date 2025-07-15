"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientRootWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/Login");
 // Redirect to login if no token
    } else {
      router.replace("/"); // or "/"
    }
  }, [router]);

  return <>{children}</>;
}
