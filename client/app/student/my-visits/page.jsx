"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

import StudentSidebar from "@/components/student/StudentSidebar";
import StudentHeader from "@/components/student/StudentHeader";
import StudentMobileNav from "@/components/student/StudentMobileNav";

export default function MyVisitsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);

  const [visits, setVisits] = useState([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [remainingFeedbacks, setRemainingFeedbacks] = useState(0);

  // ---------------------- THEME ----------------------
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

  // ---------------------- LOGOUT ----------------------
  const handleLogout = () => {
    api
      .post(
        "/student/logout",
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .finally(() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  };

  // ---------------------- API LOAD ----------------------
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/student/my-visits", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (res.data?.success) {
          setTotalVisits(res.data.data.total_visits);
          setRemainingFeedbacks(res.data.data.remaining_feedbacks);
          setVisits(res.data.data.visits || []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex bg-soft-background font-sans text-dark-text antialiased">

      {/* ---------------- FIXED SIDEBAR ---------------- */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-64">
        <StudentSidebar onLogout={handleLogout} />
      </div>

      {/* ---------------- RIGHT CONTENT AREA ---------------- */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* FIXED HEADER */}
        <div className="sticky top-0 z-40">
          <StudentHeader theme={theme} toggleTheme={toggleTheme} />
        </div>

        {/* ONLY MAIN CONTENT SCROLLS */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* PAGE TITLE */}
            <h1 className="text-3xl text-center font-display font-bold tracking-tight">
              My Visits
            </h1>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <SummaryCard
                title="Total Visits"
                value={totalVisits}
                icon="event_available"
                iconColor="text-primary"
                bgColor="bg-blue-100"
              />

              <SummaryCard
                title="Pending Feedback"
                value={remainingFeedbacks}
                icon="rate_review"
                iconColor="text-yellow-600"
                bgColor="bg-yellow-100"
              />

            </div>

            {/* VISITS LIST */}
            <div className="space-y-4">
              {visits.length === 0 && (
                <p className="text-gray-500 text-lg">No visits yet.</p>
              )}

              {visits.map((stall, i) => (
                <VisitCard key={i} stall={stall} />
              ))}
            </div>

          </div>
        </main>

        {/* MOBILE NAV */}
        <StudentMobileNav />

      </div>
    </div>
  );
}

/* --------------------------------------------------------
   COMPONENTS
-------------------------------------------------------- */

function SummaryCard({ title, value, icon, iconColor, bgColor }) {
  return (
    <div className="bg-white border border-light-gray-border p-6 rounded-2xl shadow-soft hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-600 font-medium">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgColor}`}>
          <span className={`material-symbols-outlined text-3xl ${iconColor}`}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

function VisitCard({ stall }) {
  return (
    <div className="bg-white border border-light-gray-border rounded-2xl p-6 shadow-soft hover:shadow-md transition">

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{stall.stall_name}</h2>
          <p className="text-sm text-gray-500 mt-1">{stall.school_name}</p>
          <p className="text-sm text-primary font-semibold mt-1">
            Stall #{stall.stall_number}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`material-symbols-outlined ${
                i < stall.rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              star
            </span>
          ))}
        </div>
      </div>

      {stall.comment && (
        <p className="text-gray-700 mt-4 italic">“{stall.comment}”</p>
      )}

      <p className="text-xs text-gray-500 mt-3">
        Visited at: {new Date(stall.visited_at).toLocaleString()}
      </p>
    </div>
  );
}
