"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
      setLoading(false);
    }

    loadUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold">VIDDO Dashboard</h1>
      <p className="mt-4">Logged in as: {email}</p>
      <div className="mt-10 p-6 border border-white/20 rounded-2xl">
        Dashboard restored successfully.
      </div>
    </main>
  );
}
