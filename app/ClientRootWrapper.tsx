// // app/ClientRootWrapper.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import Cookies from "js-cookie";

// const protectedRoutes = ["/", ]; // ✅ Add more protected routes here

// export default function ClientRootWrapper({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [loading, setLoading] = useState(true);
//   const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {
//     const token = Cookies.get("token"); // 🔐 check cookie

//     const isProtected = protectedRoutes.some((route) =>
//       pathname === route || pathname.startsWith(route + "/")
//     );

//     if (!token && isProtected) {
//       router.push("/auth/Login"); // 🔐 redirect
//     } else {
//       setAuthenticated(true);
//     }

//     setLoading(false);
//   }, [pathname, router]);

//   if (loading) {
//   }

//   if (!authenticated) return null;

//   return <>{children}</>;
// }
