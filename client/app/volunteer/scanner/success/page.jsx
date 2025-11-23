"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import VolunteerSidebar from "@/components/volunteer/VolunteerSidebar";
import VolunteerHeader from "@/components/volunteer/VolunteerHeader";
import VolunteerMobileNav from "@/components/volunteer/VolunteerMobileNav";

export default function ScanSuccessPage() {
  const router = useRouter();
  const params = useSearchParams();

  const name = params.get("name");
  const reg = params.get("reg");
  const type = params.get("type");

  const [theme, setTheme] = useState("light");
  const [isIn, setIsIn] = useState(true);

  useEffect(() => {
    setIsIn(type === "IN");
  }, [type]);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };


const handleLogout = () => {
  api.post("/volunteer/logout", {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  }).finally(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("volunteer_name");

    window.location.href = "/";
  });
};


  return (
    <div className="flex min-h-screen bg-light-background dark:bg-dark-background">

      {/* LEFT SIDEBAR */}
      <VolunteerSidebar onLogout={handleLogout} />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <VolunteerHeader
          theme={theme}
          toggleTheme={toggleTheme}
          volunteerName={"Volunteer"}
        />

        {/* MAIN CONTENT */}
        <main className="flex flex-col items-center justify-center px-6 py-24 text-center">

          {/* <div
            className={`w-36 h-36 rounded-full flex items-center justify-center shadow-xl mb-8 
            ${isIn ? "bg-green-100" : "bg-red-100"}`}
          >
            <span
              className={`material-symbols-outlined text-9xl 
              ${isIn ? "text-green-600" : "text-red-600"}`}
            >
              check_circle
            </span>
          </div> */}

          {/* BIG TICK ICON */}


<div
  className={`w-40 h-40 rounded-full flex items-center justify-center shadow-xl mb-8 
  ${isIn ? "bg-green-100" : "bg-red-100"}`}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`${isIn ? "text-green-600" : "text-red-600"} w-22 h-22`}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
    10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4.5-4.5 
    1.41-1.41L10 13.17l7.09-7.09L18.5 7.5 10 16.5z" />
  </svg>
</div>

          {/* TITLE */}
          <h1 className="text-4xl font-bold mb-3">
            {isIn ? "Check-In Successful!" : "Check-Out Successful!"}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
            Attendance has been marked for:
          </p>

          {/* STUDENT CARD */}
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-lg w-full max-w-md text-left">
            <p className="text-xl font-semibold">{name}</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Reg No: {reg}</p>

            <p className={`mt-3 text-sm font-medium 
              ${isIn ? "text-green-600" : "text-red-500"}`}>
              {isIn ? "Status: Checked-In" : "Status: Checked-Out"}
            </p>
          </div>

          {/* NEXT SCAN BUTTON */}
          <button
            onClick={() => router.push("/volunteer/scanner")}
            className="mt-10 px-10 py-4 bg-primary text-white rounded-2xl 
            text-lg font-semibold hover:scale-105 active:scale-95 transition"
          >
            Scan Next QR
          </button>
        </main>
      </div>

      {/* MOBILE NAV */}
      <VolunteerMobileNav />
    </div>
  );
}
