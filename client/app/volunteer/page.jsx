"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import api from "@/lib/api";

// SHARED COMPONENTS
import VolunteerSidebar from "@/components/volunteer/VolunteerSidebar";
import VolunteerHeader from "@/components/volunteer/VolunteerHeader";
import VolunteerMobileNav from "@/components/volunteer/VolunteerMobileNav";

export default function VolunteerDashboard() {
  const router = useRouter();

  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);
  const [volunteerName, setVolunteerName] = useState("Volunteer");

  const [totalScans, setTotalScans] = useState(0);
  const [history, setHistory] = useState([]);

  // ------------------ FETCH HISTORY ------------------
  async function loadHistory() {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.get("/volunteer/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data;

      if (data) {
        setVolunteerName(data.volunteer_name);
        setTotalScans(data.total_scans);
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error("History error → ", err);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadHistory();
  }, []);

  // ------------------ LOAD THEME ------------------
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

  // ------------------ LOGOUT ------------------

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
    <div className="flex min-h-screen bg-soft-background dark:bg-dark-background">

      {/* LEFT SIDEBAR */}
      <VolunteerSidebar onLogout={handleLogout} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOP HEADER */}
        <VolunteerHeader
          theme={theme}
          toggleTheme={toggleTheme}
          volunteerName={volunteerName}
        />

        {/* MAIN BODY */}
        {/* <main className="p-6 lg:p-10 max-w-7xl mx-auto"> */}
        <main className="p-6 lg:p-10 max-w-7xl">

          {/* ---------- STATS SECTION ---------- */}
          <section id="stats-section">
            <h3 className="font-display text-2xl text-center font-bold mb-6">
              Today's Activity Stats
            </h3>

            {loading ? (
              <div className="text-gray-500 dark:text-gray-400">Loading stats...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <StatCard
                  title="Total Scans"
                  value={totalScans}
                  icon="qr_code_scanner"
                  color="blue"
                />
                <StatCard
                  title="Check-ins"
                  value={history.filter(h => h.type === "in").length}
                  icon="login"
                  color="green"
                />
                <StatCard
                  title="Check-outs"
                  value={history.filter(h => h.type === "out").length}
                  icon="logout"
                  color="yellow"
                />
              </div>
            )}
          </section>

          {/* ---------- SCAN BUTTON ---------- */}
          <section id="scan-section" className="mt-12 text-center">
            <button
              onClick={() => router.push("/volunteer/scanner")}
              className="inline-flex items-center justify-center gap-3 px-12 py-5 
              bg-gradient-to-br from-[#1E6AD6] via-[#2B79E3] to-[#3F8AF0] text-white 
              font-bold text-xl rounded-2xl shadow-button-premium 
              hover:scale-105 active:scale-100 transition"
            >
              <span className="material-symbols-outlined !text-3xl">
                qr_code_scanner
              </span>
              Open QR Scanner
            </button>
          </section>

          {/* ---------- HISTORY SECTION ---------- */}
          <section id="history-section" className="mt-12">
            <h3 className="font-display text-center text-2xl font-bold mb-6">Your Past Scan Log</h3>

            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-soft overflow-hidden">

              {loading ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  Loading history...
                </div>
              ) : history.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  No scans yet.
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                  {history.map((item, idx) => (
                    <HistoryItem
                      key={idx}
                      name={item.student_name}
                      type={item.type}
                      reg={item.registration_no}
                      time={item.time}
                    />
                  ))}
                </ul>
              )}

            </div>
          </section>

        </main>
      </div>

      {/* MOBILE NAV */}
      <VolunteerMobileNav />
    </div>
  );
}

/* ---------------------------------------------
            SMALL COMPONENTS
--------------------------------------------- */

function StatCard({ title, value, icon, color }) {
  const bg = {
    blue: "bg-blue-100 dark:bg-blue-900/40",
    green: "bg-green-100 dark:bg-green-900/40",
    yellow: "bg-yellow-100 dark:bg-yellow-900/40",
  }[color];

  const text = {
    blue: "text-blue-600 dark:text-blue-300",
    green: "text-green-600 dark:text-green-300",
    yellow: "text-yellow-600 dark:text-yellow-300",
  }[color];

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-soft hover:-translate-y-1 transition">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">{title}</h4>
        <div className={`p-2 rounded-lg ${bg}`}>
          <span className={`material-symbols-outlined ${text}`}>{icon}</span>
        </div>
      </div>
      <p className="text-5xl font-extrabold">{value}</p>
    </div>
  );
}

function HistoryItem({ name, type, reg, time }) {
  const isIn = type === "in";

  return (
    <li className="p-5 flex items-center justify-between">
      <div className="flex items-center gap-4">

        <div className={`p-3 rounded-full ${isIn ? "bg-green-100 dark:bg-green-900/40" : "bg-yellow-100 dark:bg-yellow-900/40"}`}>
          <span className={`material-symbols-outlined ${isIn ? "text-green-600" : "text-yellow-600"}`}>
            {isIn ? "login" : "logout"}
          </span>
        </div>

        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-500">
            {isIn ? "Checked In" : "Checked Out"} — {reg}
          </p>
        </div>

      </div>

      <p className="text-sm text-gray-500">{time}</p>
    </li>
  );
}


