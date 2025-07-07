// "use client";

// import { useState } from "react";
// import { Menu, X, CreditCard } from "lucide-react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const pathname = usePathname();

//   const navItems = [
//     { path: "/", label: "Home" },
//     { path: "/about", label: "About" },
//     { path: "/login", label: "Login" },
//   ];

//   const isActive = (path: string) => pathname === path;

//   return (
//     <nav className="bg-white/95 backdrop-blur-md shadow-lg fixed w-full top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link href="/" className="flex items-center space-x-2">
//               <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
//                 <CreditCard className="h-6 w-6 text-white" />
//               </div>
//               <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 FlexiCard
//               </span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navItems.map((item) => (
//               <Link
//                 key={item.path}
//                 href={item.path}
//                 className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
//                   isActive(item.path)
//                     ? "text-blue-600"
//                     : "text-gray-700 hover:text-blue-600"
//                 }`}
//               >
//                 {item.label}
//               </Link>
//             ))}
//             <Link
//               href="/create-card"
//               className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
//             >
//               Create ID Card
//             </Link>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
//             >
//               {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isOpen && (
//           <div className="md:hidden">
//             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.path}
//                   href={item.path}
//                   className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
//                     isActive(item.path)
//                       ? "text-blue-600 bg-blue-50"
//                       : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
//                   }`}
//                   onClick={() => setIsOpen(false)}
//                 >
//                   {item.label}
//                 </Link>
//               ))}
//               <Link
//                 href="/create-card"
//                 className="block mx-3 mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-center hover:shadow-lg transition-all duration-200"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Create ID Card
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
