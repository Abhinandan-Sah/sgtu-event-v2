"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminMobileNav from "@/components/admin/AdminMobileNav";
import api from "@/lib/api";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit] = useState(50);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchStudents();
  }, [offset]);

  async function fetchStudents() {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await api.get(`/admin/students?limit=${limit}&offset=${offset}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) setStudents(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }

  return (
    <div className="flex min-h-screen bg-soft-background">
      <AdminSidebar onLogout={() => { localStorage.removeItem("admin_token"); location.href = "/admin/login"; }} />
      <div className="flex-1 flex flex-col">
        <AdminHeader adminName={localStorage.getItem("admin_name")} />
        {/* <main className="p-6 max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">All Students</h1>
          {loading ? <div>Loading…</div> : (
            <div className="space-y-3">
              {students.map(s => (
                <div key={s.id} className="p-4 bg-card-background border rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{s.full_name}</div>
                    <div className="text-sm text-gray-500">{s.school_name} • {s.registration_no}</div>
                  </div>
                  <div className="text-sm">
                    <div className={s.is_inside_event ? "text-green-600" : "text-gray-500"}>
                      {s.is_inside_event ? "Inside" : "Outside"}
                    </div>
                    <div className="text-xs text-gray-400">{s.feedback_count} feedbacks</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main> */}


        <main className="p-6 max-w-7xl mx-auto">

  <h1 className="text-3xl font-bold mb-8 text-dark-text">All Students</h1>

  <div className="bg-white dark:bg-card-dark shadow-soft border border-light-gray-border rounded-2xl overflow-hidden">

    {/* TABLE HEADER */}
    <div className="grid grid-cols-6 bg-gray-50 dark:bg-gray-800 px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">
      <div>TIMESTAMP</div>
      <div>STUDENT NAME</div>
      <div>REG. NO</div>
      <div>FEEDBACK</div>
      <div>STATUS</div>
      <div className="text-right">ACTIONS</div>
    </div>

    {/* DATA ROWS */}
    {students.map((s, i) => (
      <div
        key={s.id}
        className={`grid grid-cols-6 px-6 py-4 text-sm items-center 
        ${i % 2 === 0 ? "bg-white dark:bg-card-dark" : "bg-gray-50 dark:bg-gray-900"}
        hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition`}
      >

        {/* TIMESTAMP */}
        <div className="text-gray-600 dark:text-gray-400">
          {new Date().toLocaleString()} {/* Replace when API gives date */}
        </div>

        {/* NAME */}
        <div className="font-semibold text-dark-text dark:text-gray-200">
          {s.full_name}
        </div>

        {/* REGISTRATION */}
        <div className="text-gray-600 dark:text-gray-400">
          {s.registration_no}
        </div>

        {/* FEEDBACK COUNT */}
        <div className="font-medium text-primary">
          {s.feedback_count}
        </div>

        {/* STATUS BADGE */}
        <div>
          {s.is_inside_event ? (
            <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 font-semibold">
              Checked-In
            </span>
          ) : (
            <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600 font-semibold">
              Checked-Out
            </span>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3 justify-end">

          <button className="text-gray-500 hover:text-primary transition">
            <span className="material-symbols-outlined text-base">visibility</span>
          </button>

          <button className="text-gray-500 hover:text-red-500 transition">
            <span className="material-symbols-outlined text-base">delete</span>
          </button>

        </div>

      </div>
    ))}

  </div>

</main>

      </div>
      <AdminMobileNav />
    </div>
  );
}
