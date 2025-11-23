"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// NEW COMPONENTS
import StudentSidebar from "@/components/student/StudentSidebar";
import StudentHeader from "@/components/student/StudentHeader";
import StudentMobileNav from "@/components/student/StudentMobileNav";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  const handleLogout = () => {
  api.post("/student/logout", {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  }).finally(() => {
    localStorage.removeItem("token");

    window.location.href = "/";
  });
};

  const goTo = (path) => router.push(path);

  return (
    <div className="bg-soft-background font-sans text-dark-text antialiased min-h-screen flex">

      {/* LEFT SIDEBAR */}
      <StudentSidebar onLogout={handleLogout} />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOP HEADER */}
        <StudentHeader theme={theme} toggleTheme={toggleTheme} />

        {/* BODY CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* 🌟 GRADIENT HERO */}
            <section className="relative flex flex-col items-stretch justify-start rounded-3xl overflow-hidden shadow-soft text-white">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2B6CB0] to-[#1E3A8A]"></div>

              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent 50%), radial-gradient(circle at bottom left, rgba(236,201,75,0.15), transparent 60%)",
                }}
              />

              <div className="relative p-8 flex flex-col items-start gap-5">

                <div className="flex items-center gap-4">
                  <div className="flex w-14 h-14 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                    <span
                      className="material-symbols-outlined text-[#ECC94B]"
                      style={{ fontSize: "40px", fontVariationSettings: "'FILL' 1, 'wght' 500" }}
                    >
                      military_tech
                    </span>
                  </div>

                  <div>
                    <h2 className="font-display text-3xl font-bold tracking-[-0.02em]">
                      Contest Rules
                    </h2>
                    <p className="text-sm text-blue-200 opacity-90">
                      How to be eligible for prizes
                    </p>
                  </div>
                </div>

                <ul className="text-blue-100/90 text-sm font-medium space-y-3 mt-4">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#ECC94B] mt-0.5">check_circle</span>
                    <span>Visit a minimum of 10 stalls and get your QR code scanned.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#ECC94B] mt-0.5">check_circle</span>
                    <span>Submit feedback for at least 5 stalls you visited.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#ECC94B] mt-0.5">check_circle</span>
                    <span>Rank your top 3 favorite stalls before the event ends.</span>
                  </li>
                </ul>

              </div>
            </section>

            {/* 🎴 CARDS */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              <div className="bg-card-background border border-light-gray-border rounded-2xl p-8 shadow-soft hover:shadow-md hover:-translate-y-1 transition">
                <div className="flex items-center gap-5">
                  <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary !text-3xl">rate_review</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">Stall Feedback</h3>
                    <p className="text-gray-500 mt-1">Share your experience about the stalls you visited.</p>
                  </div>
                </div>

                <button
                  onClick={() => goTo("/student/feedback")}
                  className="mt-8 w-full text-white font-semibold py-3 px-6 rounded-xl"
                  style={{ backgroundColor: "#2B6CB0" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#1E3A8A")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#2B6CB0")}
                >
                  Give Feedback
                </button>
              </div>

              <div className="bg-card-background border border-light-gray-border rounded-2xl p-8 shadow-soft hover:shadow-md hover:-translate-y-1 transition">
                <div className="flex items-center gap-5">
                  <div className="bg-yellow-100 w-14 h-14 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-yellow-600 !text-3xl">emoji_events</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">Stall Ranking</h3>
                    <p className="text-gray-500 mt-1">Vote for your favorite stalls to help them win.</p>
                  </div>
                </div>

                <button
                  onClick={() => goTo("/student/ranking")}
                  className="mt-8 w-full bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-800 transition"
                >
                  Start Ranking
                </button>
              </div>

            </section>
          </div>
        </main>
      </div>

      {/* 📱 MOBILE NAV */}
      <StudentMobileNav />

    </div>
  );
}
