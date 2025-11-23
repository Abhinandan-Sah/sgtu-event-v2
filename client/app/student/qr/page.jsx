"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

// ---- SHARED COMPONENTS ----
import StudentSidebar from "@/components/student/StudentSidebar";
import StudentHeader from "@/components/student/StudentHeader";
import StudentMobileNav from "@/components/student/StudentMobileNav";

export default function StudentQRPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState(null);
  const [theme, setTheme] = useState("light");
  const [timeLeft, setTimeLeft] = useState(30);

  // ------------------ FETCH QR ------------------
  async function fetchQR() {
    try {
      setLoading(true);

      const res = await api.get("/student/qr-code");
      const qr = res.data?.data;
      if (!qr) throw new Error("Invalid QR response");

      setQrData({
        full_name: "Student",
        registration_no: qr.registration_no,
        qr_code: qr.qr_code,
      });

      setTimeLeft(30); // ⭐ Reset the countdown

    } catch (err) {
      console.error(err);
      alert("Failed to load QR Code");
    }

    setLoading(false);
  }

  // Load first time
  useEffect(() => {
    fetchQR();
  }, []);

  // Auto refresh every 30 sec
  useEffect(() => {
    const interval = setInterval(fetchQR, 30000);
    return () => clearInterval(interval);
  }, []);

  // ------------------ COUNTDOWN TIMER ------------------
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => (t <= 1 ? 30 : t - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ------------------ THEME ------------------
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
  api.post("/student/logout", {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  }).finally(() => {
    localStorage.removeItem("token");

    window.location.href = "/";
  });
};

  return (
    <div className="bg-soft-background font-sans text-dark-text antialiased min-h-screen flex">

      {/* LEFT SIDEBAR */}
      <StudentSidebar 
        onLogout={handleLogout}/>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <StudentHeader 
          theme={theme} 
          toggleTheme={toggleTheme} 
          title="My QR Code!"
        />

        {/* ------- CONTENT ------- */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">

            <div className="bg-white dark:bg-[#1a1f2b] border border-light-gray-border dark:border-gray-700 rounded-3xl p-8 shadow-soft">

              {loading ? (
                <div className="py-20 flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
                  <p className="mt-4 text-gray-600 dark:text-gray-300">Loading QR...</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center">

                    <div className="w-56 h-56 bg-white p-3 rounded-2xl shadow-md hover:shadow-xl transition">
                      <img src={qrData.qr_code} alt="QR" className="w-full h-full object-contain" />
                    </div>

                    <h2 className="mt-6 text-xl font-bold">{qrData.full_name}</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {qrData.registration_no}
                    </p>
                  </div>

                  {/* ⭐ COUNTDOWN TIMER */}
                  <div className="mt-5 text-center">
                    <div className="inline-block px-4 py-2 rounded-full 
                        bg-gradient-to-r from-[#2B6CB0] to-[#1E3A8A] 
                        text-white font-semibold shadow-md text-sm tracking-wide">
                      Refreshing in {timeLeft}s
                    </div>
                  </div>

                  {/* REFRESH BUTTON */}
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={fetchQR}
                      className="px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-md"
                      style={{ backgroundColor: "#2B6CB0" }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = "#1E3A8A")}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = "#2B6CB0")}
                    >
                      Refresh QR
                    </button>
                  </div>
                </>
              )}

            </div>

            <p className="mt-10 text-center text-gray-600 dark:text-gray-300 text-sm">
              Your QR code is unique. <br />
              Show it at entry to record your visit.
            </p>

          </div>
        </main>
      </div>

      {/* MOBILE NAV */}
      <StudentMobileNav active="qr" />

    </div>
  );
}
