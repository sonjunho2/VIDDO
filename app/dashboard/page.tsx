"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Video, Sparkles, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      setEmail(data.user.email ?? null);
      setLoading(false);
    }
    loadUser();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return <main className="min-h-screen bg-[#070A12] text-white flex items-center justify-center">Loading...</main>;
  }

  return (
    <main className="min-h-screen bg-[#070A12] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_35%)]" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        <header className="flex items-center justify-between mb-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center"><Video className="w-5 h-5 text-white" /></div>
            <span className="text-2xl font-black">VIDDO</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm text-zinc-400">{email}</span>
            <Button onClick={handleLogout} variant="outline" className="rounded-xl border-white/15 bg-white/5 hover:bg-white/10 text-white"><LogOut className="w-4 h-4 mr-2" /> Logout</Button>
          </div>
        </header>

        <section className="grid lg:grid-cols-[1.4fr_0.6fr] gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/20 to-violet-500/20 border-white/10 rounded-3xl">
            <CardContent className="p-8 md:p-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-blue-100 mb-6"><Sparkles className="w-4 h-4" /> Creator Dashboard</div>
              <h1 className="text-4xl md:text-5xl font-black mb-4">Create your next AI video</h1>
              <p className="text-zinc-300 max-w-2xl mb-8">This dashboard is ready for the next step: AI script generation, voiceover, subtitles, and video rendering.</p>
              <Button className="h-14 px-7 rounded-2xl bg-blue-500 hover:bg-blue-600 text-base font-bold"><Plus className="w-5 h-5 mr-2" /> Create Video</Button>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.04] border-white/10 rounded-3xl">
            <CardContent className="p-7">
              <p className="text-zinc-400 mb-2">Current Plan</p>
              <h2 className="text-3xl font-black mb-5">Starter</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2"><span className="text-zinc-300">Videos used</span><span className="text-white">0 / 30</span></div>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden"><div className="h-full w-[2%] bg-blue-500" /></div>
                </div>
                <Button variant="outline" className="w-full rounded-2xl border-white/15 bg-white/5 hover:bg-white/10 text-white">Upgrade Plan</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid md:grid-cols-3 gap-5 mb-8">
          <Card className="bg-white/[0.04] border-white/10 rounded-3xl"><CardContent className="p-6"><Clock className="w-6 h-6 text-blue-300 mb-4" /><p className="text-zinc-400">Rendering Queue</p><h3 className="text-3xl font-black">0</h3></CardContent></Card>
          <Card className="bg-white/[0.04] border-white/10 rounded-3xl"><CardContent className="p-6"><Video className="w-6 h-6 text-blue-300 mb-4" /><p className="text-zinc-400">Created Videos</p><h3 className="text-3xl font-black">0</h3></CardContent></Card>
          <Card className="bg-white/[0.04] border-white/10 rounded-3xl"><CardContent className="p-6"><Download className="w-6 h-6 text-blue-300 mb-4" /><p className="text-zinc-400">Downloads</p><h3 className="text-3xl font-black">0</h3></CardContent></Card>
        </section>

        <Card className="bg-white/[0.04] border-white/10 rounded-3xl">
          <CardContent className="p-7">
            <h2 className="text-2xl font-black mb-2">Recent Videos</h2>
            <p className="text-zinc-400 mb-6">Generated videos will appear here after we add the video creation engine.</p>
            <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-zinc-400">No videos yet. Create your first video next.</div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
