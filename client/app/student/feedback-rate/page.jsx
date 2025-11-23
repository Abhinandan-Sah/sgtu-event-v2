"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function FeedbackRatePage() {
  const params = useSearchParams();
  const router = useRouter();

  const stallId = params.get("stallId");

  const [checkedIn, setCheckedIn] = useState(false);
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");

  // STEP 1 – Check if student is checked in
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await api.get("/student/check-status");
        setCheckedIn(res.data?.checked_in || false);
      } catch (e) {
        setCheckedIn(false);
      }
    }
    checkStatus();
  }, []);

  if (!checkedIn) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-2xl font-bold text-red-500">Not Checked-In</h1>
        <p className="text-gray-600 mt-2">
          You must check-in at event entry before giving stall feedback.
        </p>
        <button
          onClick={() => router.push("/student")}
          className="mt-6 px-6 py-3 bg-primary text-white rounded-xl"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const numberPad = [1,2,3,4,5,6,7,8,9,10];

  async function submitFeedback() {
    if (!rating) return alert("Select a rating");

    try {
      await api.post("/student/submit-feedback", {
        stall_id: stallId,
        rating,
        comment,
      });

      router.push("/student/feedback-success");
    } catch (err) {
      alert("Failed to submit feedback.");
    }
  }

  return (
    <div className="min-h-screen p-6 bg-soft-background flex flex-col items-center">
      
      <h1 className="text-3xl font-bold text-dark-text mb-6">
        Rate This Stall
      </h1>

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
        {numberPad.map((num) => (
          <button
            key={num}
            onClick={() => setRating(num)}
            className={`py-4 text-xl rounded-xl font-semibold transition
              ${
                rating === num
                  ? "bg-primary text-white shadow-md"
                  : "bg-white border border-light-gray-border"
              }
            `}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Comment box (only after rating) */}
      {rating && (
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment (optional)"
          className="w-full max-w-sm mt-6 p-4 border border-light-gray-border rounded-xl bg-white"
          rows={3}
        />
      )}

      <button
        onClick={submitFeedback}
        className="mt-8 px-8 py-3 bg-primary text-white rounded-2xl shadow-soft hover:bg-primary-dark"
      >
        Submit Feedback
      </button>
    </div>
  );
}
