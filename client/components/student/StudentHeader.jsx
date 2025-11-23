"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function StudentHeader({ theme, toggleTheme }) {
  const pathname = usePathname();

  const titles = {
    "/student": "Welcome, Student!",
    "/student/qr": "My QR Code",
    "/student/profile": "My Profile",
    "/student/my-visits": "My Visits",
    "/student/feedback": "Stall Feedback",
    "/student/ranking": "Stall Ranking",
  };

  const pageTitle = titles[pathname] || "Student Panel";

  return (
    <header className="sticky top-0 z-10 bg-light-background/80 dark:bg-dark-background/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 flex items-center justify-between h-20 px-6 lg:px-10">

      {/* LEFT: LOGO + TITLE */}
      <div className="flex items-center text-center gap-4">
        <Image
          src="/images/SGT-Logo.png"
          alt="SGT"
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
       
      </div>

       <h2 className="font-display font-bold text-xl lg:text-2xl">
          {pageTitle}
        </h2>

      {/* RIGHT: THEME TOGGLE */}
      <button
        onClick={toggleTheme}
        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:opacity-80 transition"
      >
        {theme === "light" ? (
          <span className="material-symbols-outlined">dark_mode</span>
        ) : (
          <span className="material-symbols-outlined">light_mode</span>
        )}
      </button>
    </header>
  );
}
