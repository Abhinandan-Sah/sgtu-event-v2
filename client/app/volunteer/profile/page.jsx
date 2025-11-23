"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

import VolunteerSidebar from "@/components/volunteer/VolunteerSidebar";
import VolunteerMobileNav from "@/components/volunteer/VolunteerMobileNav";
import VolunteerHeader from "@/components/volunteer/VolunteerHeader";

export default function VolunteerProfilePage() {
  const router = useRouter();

  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);
  const [volunteer, setVolunteer] = useState("Volunteer");

  /* FETCH PROFILE */
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/volunteer/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setVolunteer(res.data?.data || {});
      } catch (err) {
        alert("Failed to load profile");
      }
      setLoading(false);
    }
    load();
  }, []);

  /* THEME LOADING */
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
    <div className="flex min-h-screen bg-soft-background dark:bg-dark-background">

      {/* Sidebar */}
      <VolunteerSidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        {/* <VolunteerHeader theme={theme} toggleTheme={toggleTheme} /> */}
        <VolunteerHeader
  theme={theme}
  toggleTheme={toggleTheme}
  volunteerName={volunteer?.full_name || "Volunteer"}
/>

        

        {/* Content */}
        <main className="p-6 max-w-5xl mx-auto">

          {loading ? (
            <LoadingBlock />
          ) : (
            <>
              {/* TOP HERO CARD */}
              <ProfileHero volunteer={volunteer} />

              {/* DETAILS GRID */}
              <div className="mt-10 mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                <DetailCard
                  title="Full Name"
                  value={volunteer?.full_name}
                  icon="person"
                />
                <DetailCard
                  title="Email"
                  value={volunteer?.email}
                  icon="mail"
                />
                <DetailCard
                  title="Phone"
                  value={volunteer?.phone}
                  icon="call"
                />
                <DetailCard
                  title="Assigned Location"
                  value={volunteer?.assigned_location}
                  icon="location_on"
                />
                <DetailCard
                  title="Total Scans Performed"
                  value={volunteer?.total_scans_performed}
                  icon="qr_code_scanner"
                />
                <DetailCard
                  title="Joined On"
                  value={volunteer?.created_at?.split("T")[0]}
                  icon="calendar_today"
                />

              </div>
            </>
          )}

        </main>
      </div>

      {/* Mobile Nav */}
      <VolunteerMobileNav />

      {/* ------------------ MOBILE FLOATING LOGOUT BUTTON ------------------ */}
<button
  onClick={handleLogout}
  className="
    lg:hidden 
    fixed bottom-20 right-4 
    px-4 py-3 rounded-full 
    bg-white text-red-500 
    shadow-soft border border-light-gray-border 
    flex items-center gap-2 
    active:scale-95 transition
  "
>
  <span className="material-symbols-outlined">logout</span>
</button>

    </div>
  );
}

/* ----------------------------------------------
      Loading Block
---------------------------------------------- */
function LoadingBlock() {
  return (
    <div className="flex flex-col items-center mt-20">
      <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      <p className="text-gray-600 dark:text-gray-300 mt-4">Loading profile...</p>
    </div>
  );
}

/* ----------------------------------------------
      HERO CARD
---------------------------------------------- */
function ProfileHero({ volunteer }) {
  return (
    <div className="bg-gradient-to-br from-[#2B6CB0] to-[#1E3A8A] 
      p-10 rounded-3xl shadow-soft text-white relative overflow-hidden">

      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, rgba(255,255,255,0.4), transparent 60%), radial-gradient(circle at bottom right, rgba(255,255,255,0.15), transparent 70%)",
        }}
      />

      <div className="relative flex flex-col md:flex-row items-center gap-8">
        
        <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md 
          flex items-center justify-center text-4xl font-bold shadow-xl border border-white/30">
          {volunteer?.full_name?.[0]}
        </div>

        <div>
          <h2 className="text-3xl font-bold">{volunteer?.full_name}</h2>
          <p className="text-blue-200 mt-1">{volunteer?.email}</p>
          <p className="text-blue-200 text-sm">
            Assigned: {volunteer?.assigned_location}
          </p>
        </div>

      </div>
    </div>
  );
}

/* ----------------------------------------------
      DETAIL CARD
---------------------------------------------- */
function DetailCard({ title, value, icon }) {
  return (
    <div className="bg-card-background dark:bg-[#1a1f2b] border border-light-gray-border 
      dark:border-gray-700 rounded-2xl p-6 shadow-soft hover:shadow-md transition-all 
      flex items-start gap-4">

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
