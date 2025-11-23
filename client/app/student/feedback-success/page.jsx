"use client";

import { useRouter } from "next/navigation";

export default function FeedbackSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-soft-background text-center">

      <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center mb-6 shadow-md">
        <span className="material-symbols-outlined text-green-600 text-6xl">
          check_circle
        </span>
      </div>

      <h1 className="text-3xl font-bold mb-2 text-dark-text">
        Feedback Submitted!
      </h1>

      <p className="text-gray-600 mb-6">
        Thank you for sharing your experience.
      </p>

      <button
        onClick={() => router.push("/student")}
        className="px-8 py-3 bg-primary text-white rounded-xl"
      >
        Back to Home
      </button>
    </div>
  );
}
