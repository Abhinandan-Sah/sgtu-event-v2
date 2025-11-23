"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminMobileNav from "@/components/admin/AdminMobileNav";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AdminHome() {
  const [theme, setTheme] = useState("light");
  const [adminName, setAdminName] = useState("Admin");
  const router = useRouter();

  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "light");
    setAdminName(localStorage.getItem("admin_name") || "Admin");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const handleLogout = async () => {
    try {
      await api.post("/admin/logout", {}, { headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` } });
    } catch(e){}
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    router.replace("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-soft-background dark:bg-dark-background">
      <AdminSidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <AdminHeader theme={theme} toggleTheme={toggleTheme} adminName={adminName} />

        <main className="p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Volunteers" value="—" icon="group"/>
            <Card title="Students" value="—" icon="school"/>
            <Card title="Stalls" value="—" icon="store"/>
            <Card title="Scans Today" value="—" icon="qr_code_scanner"/>
          </div>

          <section className="mt-8 bg-white dark:bg-card-dark p-6 rounded-2xl border border-light-gray-border shadow-soft">
            <h3 className="text-lg font-semibold mb-2">Quick actions</h3>
            <div className="flex gap-3">
              <button onClick={() => router.push('/admin/students')} className="px-4 py-2 rounded bg-primary text-white">View Students</button>
              <button onClick={() => router.push('/admin/top-stalls')} className="px-4 py-2 rounded bg-blue-100">Top Stalls</button>
            </div>
          </section>
        </main>
      </div>
      <AdminMobileNav />
    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="p-5 rounded-2xl border border-light-gray-border bg-card-background shadow-soft">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-2xl font-bold mt-2">{value}</h2>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">{icon}</span>
        </div>
      </div>
    </div>
  );
}
