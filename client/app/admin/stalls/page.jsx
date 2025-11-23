"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import api from "@/lib/api";

export default function AllStallsPage() {
  const [stalls, setStalls] = useState([]);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const name = localStorage.getItem("admin_name") || "Admin";
    setAdminName(name);
  }, []);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await api.get("/admin/stalls");
      if (res.data?.success) setStalls(res.data.data || []);
    } catch (error) {
      console.error("API Error:", error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    window.location.href = "/admin/login";
  };

  return (
    <div className="bg-soft-background min-h-screen">

      <AdminSidebar onLogout={handleLogout} />
      <AdminHeader adminName={adminName} />

      <main className="lg:ml-64 p-6">

        <h1 className="text-3xl font-bold mb-6">All Stalls</h1>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {stalls.map((s) => (
            <div
              key={s.id}
              className="
                p-6 rounded-2xl shadow-lg
                bg-white dark:bg-[#161b22]
                border border-gray-200 dark:border-gray-700
                hover:shadow-xl hover:-translate-y-1
                transition-all cursor-pointer select-none
              "
            >
              <h2 className="text-xl font-bold text-[#2B6CB0]">{s.stall_name}</h2>

              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Stall #{s.stall_number}  
              </p>

              <div className="mt-3 text-gray-600 dark:text-gray-300 text-sm">
                <strong>{s.school_name}</strong>
                <br />
                {s.location}
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
