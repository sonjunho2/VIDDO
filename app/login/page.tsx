"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#070A12] text-white flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.28),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.22),_transparent_35%)]" />
      <Card className="relative z-10 w-full max-w-md bg-[#0D1220]/90 border-white/10 rounded-3xl shadow-2xl">
        <CardContent className="p-8">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center"><Video className="w-5 h-5 text-white" /></div>
            <span className="text-2xl font-black text-white">VIDDO</span>
          </Link>
          <h1 className="text-3xl font-black mb-2 text-white">Welcome back</h1>
          <p className="text-zinc-400 mb-7">Log in to create AI videos.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div><label className="text-sm text-zinc-300">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-blue-400" placeholder="you@example.com" /></div>
            <div><label className="text-sm text-zinc-300">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-2 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-blue-400" placeholder="••••••••" /></div>
            {message && <p className="text-sm text-red-300 bg-red-500/10 border border-red-400/20 rounded-2xl p-3">{message}</p>}
            <Button disabled={loading} className="w-full h-12 rounded-2xl bg-blue-500 hover:bg-blue-600 font-bold">{loading ? "Logging in..." : "Login"}</Button>
          </form>
          <p className="text-zinc-400 text-sm mt-6 text-center">No account yet? <Link href="/signup" className="text-blue-300 font-bold">Create one</Link></p>
        </CardContent>
      </Card>
    </main>
  );
}
