"use client";

import Image from "next/image";

export default function VolunteerHeader({ theme, toggleTheme, volunteerName }) {
  return (
    <header className="sticky top-0 z-10 bg-light-background/80 dark:bg-dark-background/80 
    backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 flex items-center 
    justify-between h-20 px-6 lg:px-10">

      <div className="flex items-center gap-4">
        <Image
          src="/images/SGT-Logo.png"
          width={48}
          height={48}
          alt="Logo"
          className="rounded-full"
        />

        <div>
          <h2 className="font-bold text-xl lg:text-2xl">
            Welcome, {volunteerName}
          </h2>
          <p className="text-sm text-gray-500">Event Volunteer – SGT University</p>
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
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
