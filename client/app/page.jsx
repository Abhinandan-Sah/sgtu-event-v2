"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // ----------------------------
      // SET CORRECT ENDPOINT
      // backend expects: /api/student/login etc.
      // BUT our axios baseURL = http://localhost:5000/api
      // so endpoint = "/student/login" is correct
      // ----------------------------
      let endpoint = "";

      if (role === "student") endpoint = "/student/login";
      if (role === "volunteer") endpoint = "/volunteer/login";
      if (role === "admin") endpoint = "/admin/login";

      // ----------------------------
      // SEND LOGIN REQUEST
      // ----------------------------
      const res = await api.post(endpoint, { email, password });

      // ----------------------------
      // FIX TOKEN PART (VERY IMPORTANT)
      // backend returns token inside:
      // res.data.data.token
      // ----------------------------
      const token = res.data?.data?.token;

      if (token) {
        // save token in localStorage
        localStorage.setItem("token", token);
      } else {
        alert("Token not received from backend!");
        return;
      }

      // ----------------------------
      // REDIRECT USER BY ROLE
      // ----------------------------
      if (role === "student") router.push("/student");
      if (role === "volunteer") router.push("/volunteer/");
      if (role === "admin") router.push("/admin/");

    } catch (err) {
      console.log(err);
      alert("Invalid credentials");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen 
      bg-gray-100 
      dark:bg-gradient-to-b dark:from-[#0c111d] dark:to-[#111827]
      flex flex-col items-center justify-between transition-all duration-300">

      <main className="w-full max-w-md mx-auto px-6 py-10">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-full max-w-xs aspect-[4/3] mt-4">
            <Image
              src="/images/SGT-Logo.png"
              alt="SGT Logo"
              width={200}
              height={200}
              className="object-contain w-full h-full"
              loading="eager"
            />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white tracking-tight">
          Welcome Back
        </h1>

        {/* FORM */}
        <div className="mt-8 space-y-5">

          {/* Role */}
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-200">
              Role
            </label>
            <select
              className="w-full mt-2 border border-gray-300 dark:border-gray-600 
              rounded-xl px-4 py-3 
              bg-white dark:bg-[#1d2333] 
              dark:text-gray-100 focus:ring-2 focus:ring-blue-600"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-2 border border-gray-300 dark:border-gray-600 
              rounded-xl px-4 py-3 
              bg-white dark:bg-[#1d2333] 
              dark:text-gray-100 focus:ring-2 focus:ring-blue-600"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <div className="relative mt-2">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border border-gray-300 dark:border-gray-600 
                rounded-xl px-4 py-3 pr-12 
                bg-white dark:bg-[#1d2333] 
                dark:text-gray-100 focus:ring-2 focus:ring-blue-600"
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPass ? (
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3 3l18 18M10.58 10.58A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .436-.093.85-.26 1.22m-1.38 1.38A3 3 0 019 12c0-.436.093-.85.26-1.22" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </span>
            </div>
          </div>

        </div>

        <button
  onClick={handleLogin}
  disabled={loading}
  className="w-full mt-8 py-3 text-white rounded-xl shadow-md disabled:opacity-60 transition-all"
  style={{ backgroundColor: loading ? "#2B6CB0" : "#2B6CB0" }}
  onMouseEnter={(e) => (e.target.style.backgroundColor = "#1E3A8A")}
  onMouseLeave={(e) => (e.target.style.backgroundColor = "#2B6CB0")}
>
  {loading ? "Logging in..." : "Login"}
</button>


        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Powered by SGT University
        </p>

      </main>
    </div>
  );
}