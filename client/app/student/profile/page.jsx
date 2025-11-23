"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

import StudentSidebar from "@/components/student/StudentSidebar";
import StudentHeader from "@/components/student/StudentHeader";
import StudentMobileNav from "@/components/student/StudentMobileNav";

export default function StudentProfilePage() {
  const router = useRouter();

  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);

  // ------------------ FETCH STUDENT PROFILE ------------------
  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/student/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudent(res.data?.data || {});
      } catch (err) {
        console.error(err);
        alert("Failed to load profile.");
      }
      setLoading(false);
    }

    fetchProfile();
  }, []);

  // ------------------ THEME HANDLING ------------------
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

  const goTo = (path) => router.push(path);

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

      {/* ------------------ LEFT SIDEBAR ------------------ */}
      <StudentSidebar onLogout={handleLogout} />

      {/* ------------------ MAIN CONTENT AREA ------------------ */}
      <div className="flex-1 flex flex-col">

        {/* ------------------ HEADER (with dynamic title) ------------------ */}
        <StudentHeader 
          theme={theme} 
          toggleTheme={toggleTheme} 
          title="My Profile!"
        />

        {/* ------------------ MAIN BODY ------------------ */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">

            {loading ? (
              <LoadingBlock />
            ) : (
              <>
                {/* ---------- BIG PROFILE CARD ---------- */}
                <ProfileHero student={student} />

                {/* ---------- STUDENT DETAILS GRID ---------- */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <DetailCard title="Registration No" value={student?.registration_no} icon="badge" />
                  <DetailCard title="Department" value={student?.department} icon="school" />
                  <DetailCard title="Year" value={student?.year} icon="calendar_today" />
                  <DetailCard title="Email" value={student?.email} icon="mail" />
                  <DetailCard title="Phone" value={student?.phone} icon="call" />
                  <DetailCard title="Total Visits" value={student?.total_visits || 0} icon="pin_drop" />
                </div>

                {/* ---------- CTA BUTTON ---------- */}
                <div className="mt-10 mb-20 flex justify-center">
                  <button
                    onClick={() => goTo("/student/qr")}
                    className="px-8 py-3 rounded-xl bg-primary text-white font-semibold inline-flex items-center gap-2 shadow-soft hover:bg-primary-dark transition"
                  >
                    <span className="material-symbols-outlined">qr_code_2</span>
                    View My QR
                  </button>
                </div>
              </>
            )}

          </div>
        </main>

      </div>

      {/* ------------------ MOBILE NAV ------------------ */}
      <StudentMobileNav active="profile" />

    </div>
  );
}

/* ============================================================
    SMALL COMPONENTS
============================================================ */

function LoadingBlock() {
  return (
    <div className="flex flex-col items-center mt-20">
      <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      <p className="text-gray-600 dark:text-gray-300 mt-4">Loading profile...</p>
    </div>
  );
}

function ProfileHero({ student }) {
  return (
    <div className="
      bg-gradient-to-br from-[#2B6CB0] to-[#1E3A8A] 
      p-10 rounded-3xl shadow-soft text-white relative overflow-hidden
    ">
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, rgba(255,255,255,0.4), transparent 60%), radial-gradient(circle at bottom right, rgba(255,255,255,0.15), transparent 70%)",
        }}
      />

      <div className="relative flex flex-col md:flex-row items-center gap-8">
        
        <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-bold shadow-xl border border-white/30">
          {student?.full_name?.[0] || "S"}
        </div>

        <div>
          <h2 className="text-3xl font-bold">{student?.full_name}</h2>
          <p className="text-blue-200 mt-1">{student?.email}</p>
          <p className="text-blue-200 text-sm">Reg No: {student?.registration_no}</p>
        </div>

      </div>
    </div>
  );
}

function DetailCard({ title, value, icon }) {
  return (
    <div className="
      bg-card-background 
      border border-light-gray-border 
      rounded-2xl p-6 shadow-soft 
      hover:shadow-md transition-all
      flex items-start gap-4
    ">
      <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
        <span className="material-symbols-outlined text-primary">{icon}</span>
      </div>

      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-1">{value || "—"}</p>
      </div>
    </div>
  );
}
