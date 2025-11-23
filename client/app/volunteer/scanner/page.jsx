"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

import VolunteerSidebar from "@/components/volunteer/VolunteerSidebar";
import VolunteerHeader from "@/components/volunteer/VolunteerHeader";
import VolunteerMobileNav from "@/components/volunteer/VolunteerMobileNav";

export default function VolunteerScannerPage() {
  const router = useRouter();
  const pathname = usePathname();
  const readerRef = useRef(null);

  const [status, setStatus] = useState("initializing");
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("light");
  const [volunteerName, setVolunteerName] = useState("Volunteer");

  /* LOAD THEME + VOLUNTEER NAME */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    const savedName = localStorage.getItem("volunteer_name");
    if (savedName) setVolunteerName(savedName);
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

  /* INITIALIZE QR SCANNER */
  useEffect(() => {
    let html5Qr;
    let mounted = true;

    async function initScanner() {
      try {
        if (!window.Html5Qrcode) {
          await loadScript(
            "https://cdn.jsdelivr.net/npm/html5-qrcode/minified/html5-qrcode.min.js"
          );
        }

        if (!mounted) return;

        const Html5Qrcode = window.Html5Qrcode;
        html5Qr = new Html5Qrcode("html5qr-reader");

        const cameras = await Html5Qrcode.getCameras();

        if (!cameras.length) {
          setError("No camera found");
          setStatus("error");
          return;
        }

        setStatus("scanning");

        await html5Qr.start(
          cameras[0].id,
          { fps: 10, qrbox: { width: 280, height: 280 } },
          (decoded) => {
            html5Qr.stop();
            processScan(decoded);
          }
        );
      } catch (err) {
        setError(err.message);
        setStatus("error");
      }
    }

    initScanner();

    return () => {
      mounted = false;
      if (html5Qr) html5Qr.stop().catch(() => {});
    };
  }, []);

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  async function processScan(token) {
    try {
      const res = await api.post("/volunteer/scan/student", {
        qr_code_token: token,
      });

      const d = res.data?.data;

    //   if (d.status === "IN") {
    //     router.push(
    //       `/volunteer/scanner/success-in?name=${d.full_name}&reg=${d.registration_no}`
    //     );
    //   } else {
    //     router.push(
    //       `/volunteer/scanner/success-out?name=${d.full_name}&reg=${d.registration_no}`
    //     );
    //   }

    if (d.status === "IN") {
  router.push(`/volunteer/scanner/success?name=${d.full_name}&reg=${d.registration_no}&type=IN`);
} else {
  router.push(`/volunteer/scanner/success?name=${d.full_name}&reg=${d.registration_no}&type=OUT`);
}

    } catch (err) {
      setError("Scan failed.");
      setStatus("error");
    }
  }

  return (
    <div className="flex min-h-screen bg-soft-background dark:bg-dark-background">

      {/* LEFT SIDEBAR */}
      <VolunteerSidebar onLogout={handleLogout} />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <VolunteerHeader
          theme={theme}
          toggleTheme={toggleTheme}
          volunteerName={volunteerName}
        />

        {/* SCANNER */}
        <main className="p-6 flex flex-col items-center">

          <h1 className="text-2xl font-bold mb-6">Scan Student QR Code</h1>

          <div className="relative bg-gray-900 rounded-3xl overflow-hidden shadow-lg w-full max-w-md aspect-square">
            <div id="html5qr-reader" ref={readerRef} className="w-full h-full" />

            {/* Scanner Frame */}
            <div className="absolute inset-6 pointer-events-none">

              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-xl" />

              <div className="absolute left-0 w-full h-1 bg-[#ECC94B] animate-scan-line shadow-[0_0_18px_4px_rgba(236,201,75,0.5)]" />
            </div>
          </div>

          <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
            {status === "scanning" && "Point your camera at the QR code."}
            {status === "initializing" && "Initializing camera..."}
            {status === "error" && `Error: ${error}`}
          </p>

        </main>
      </div>

      {/* MOBILE NAV */}
      <VolunteerMobileNav />
    </div>
  );
}
