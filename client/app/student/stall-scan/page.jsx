"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StallScanPage() {
  const router = useRouter();

  useEffect(() => {
    let scanner;
    let video;

    async function loadScanner() {
      // Load qr-scanner ONLY in client
      const QrScanner = (await import("qr-scanner")).default;

      video = document.getElementById("qr-video");

      scanner = new QrScanner(
        video,
        (result) => {
          try {
            const url = result.data;
            const stallId = new URL(url).searchParams.get("stallId");

            if (stallId) {
              router.push(`/student/feedback-rate?stallId=${stallId}`);
            } else {
              alert("Invalid Stall QR");
            }
          } catch {
            alert("Invalid QR Code Format");
          }
        },
        { returnDetailedScanResult: true }
      );

      scanner.start();
    }

    loadScanner();

    return () => {
      if (scanner) scanner.stop();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-soft-background p-6">
      <h1 className="text-2xl font-bold text-dark-text mb-6">Scan Stall QR</h1>

      <div className="w-full max-w-sm bg-white p-4 rounded-2xl shadow-soft border border-light-gray-border">
        <video id="qr-video" className="w-full rounded-xl" />
      </div>

      <p className="text-gray-600 mt-4 text-sm text-center">
        Hold your camera over the stall QR code
      </p>
    </div>
  );
}
