// "use client";

// import { useRouter, usePathname } from "next/navigation";

// export default function StudentSidebar({ onLogout }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const links = [
//     { label: "Home", icon: "home", path: "/student" },
//     { label: "My Visits", icon: "confirmation_number", path: "/student/my-visits" },
//     { label: "Stall Feedback", icon: "rate_review", path: "/student/feedback" },
//     { label: "Stall Ranking", icon: "emoji_events", path: "/student/ranking" },
//     { label: "My QR Code", icon: "qr_code_2", path: "/student/qr" },
//     { label: "Profile", icon: "person", path: "/student/profile" },
//   ];

//   return (
//     <aside className="hidden lg:flex flex-col w-64 bg-card-background border-r border-[#e2e8f0]">

//       <div className="h-20 flex items-center justify-center px-6">
//         <h1 className="text-xl font-bold text-primary">SGT Event Portal</h1>
//       </div>

//       <nav className="flex-1 px-4 py-4 space-y-2 ">
//         {links.map((l, i) => (
//           <button
//             key={i}
//             onClick={() => router.push(l.path)}
//             className={`flex w-full items-center px-4 py-3 rounded-xl text-sm cursor-pointer transition 
//               ${
//                 pathname === l.path
//                   ? "bg-blue-100 text-primary font-semibold"
//                   : "text-gray-600 hover:bg-gray-100"
//               }
//             `}
//           >
//             <span className="material-symbols-outlined mr-4">{l.icon}</span>
//             {l.label}
//           </button>
//         ))}
//       </nav>

//       {/* Logout */}
//       <div className="px-4 py-4 mt-auto">
//         <button
//           onClick={onLogout}
//           className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-500 
//           hover:bg-gray-100 rounded-xl transition"
//         >
//           <span className="material-symbols-outlined mr-4">logout</span>
//           Logout
//         </button>
//       </div>

//     </aside>
//   );
// }






"use client";

import { useRouter, usePathname } from "next/navigation";

export default function StudentSidebar({ onLogout }) {
  const router = useRouter();
  const pathname = usePathname();

  const links = [
    { label: "Home", icon: "home", path: "/student" },
    { label: "My Visits", icon: "confirmation_number", path: "/student/my-visits" },
    { label: "Stall Feedback", icon: "rate_review", path: "/student/feedback" },
    { label: "Stall Ranking", icon: "emoji_events", path: "/student/ranking" },
    { label: "My QR Code", icon: "qr_code_2", path: "/student/qr" },
    { label: "Profile", icon: "person", path: "/student/profile" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-card-background border-r border-[#e2e8f0]">

      {/* TOP BRAND */}
      <div className="h-20 flex items-center justify-center px-6">
        <h1 className="text-xl font-bold text-primary">SGT Event Portal</h1>
      </div>

      {/* MIDDLE NAV LINKS */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {links.map((l, i) => (
          <button
            key={i}
            onClick={() => router.push(l.path)}
            className={`flex w-full items-center px-4 py-3 rounded-xl text-sm cursor-pointer transition 
              ${
                pathname === l.path
                  ? "bg-blue-100 text-primary font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            <span className="material-symbols-outlined mr-4">{l.icon}</span>
            {l.label}
          </button>
        ))}
      </nav>

      {/* BOTTOM LOGOUT FIXED  */}
      <div className="px-4 py-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-500 
          hover:bg-gray-100 rounded-xl transition"
        >
          <span className="material-symbols-outlined mr-4">logout</span>
          Logout
        </button>
      </div>

    </aside>
  );
}
