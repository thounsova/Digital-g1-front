"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Helper to get cookie by name
function getCookie(name: string) {
  const matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export default function ClientRootWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getCookie("token");
    const path = window.location.pathname;
    const isAuthPage = path.startsWith("/auth");

    if (!token && !isAuthPage) {
      // router.replace("/auth/Login");
    }

    if (token && isAuthPage) {
      router.replace("/");
    }

    setChecked(true); // allow rendering after check
  }, [router]);

  if (!checked) return null; // prevent flickering while checking

  return <>{children}</>;
}
