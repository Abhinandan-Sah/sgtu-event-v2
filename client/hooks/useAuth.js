// // hooks/useAuth.js
// import useSWR from "swr";
// import api from "@/lib/api";

// const fetcher = url => api.get(url).then(r => r.data);

// export function useAuth() {
//   const { data, error, mutate } = useSWR("/auth/me", fetcher, {
//     revalidateOnFocus: false
//   });

//   return {
//     user: data?.user || null,
//     loading: !error && !data,
//     error,
//     mutate
//   };
// }



"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export function useAuth(role = "student") {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    try {
      const res = await api.get(`/${role}/profile`);
      setUser(res.data.data);
    } catch (e) {
      setUser(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadUser();
  }, []);

  return { user, loading };
}
