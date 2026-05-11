"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [idea, setIdea] = useState("");
  const [videoFormat, setVideoFormat] = useState("shorts");
  const [length, setLength] = useState("30 sec");
  const [voice, setVoice] = useState("Male");
  const [isGenerating, setIsGenerating] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState({
    analysis: "idle",
    motion: "idle",
    render: "idle",
    save: "idle",
  });

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();

      setEmail(data.user?.email ?? null);
      setLoading(false);
    }

    loadUser();
  }, []);

  async function generateVideo() {
    if (!idea.trim()) return;

    setIsGenerating(true);

    setPipelineStatus({
      analysis: "running",
      motion: "idle",
      render: "idle",
      save: "idle",
    });

    setTimeout(() => {
      setPipelineStatus({
        analysis: "done",
        motion: "running",
        render: "idle",
        save: "idle",
      });
    }, 1500);

    setTimeout(() => {
      setPipelineStatus({
        analysis: "done",
        motion: "done",
        render: "running",
        save: "idle",
      });
    }, 3000);

    setTimeout(() => {
      setPipelineStatus({
        analysis: "done",
        motion: "done",
        render: "done",
        save: "running",
      });
    }, 4500);

    setTimeout(() => {
      setPipelineStatus({
        analysis: "done",
        motion: "done",
        render: "done",
        save: "done",
      });

      setIsGenerating(false);
    }, 6000);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-black">VIDDO</h1>

            <p className="text-zinc-400 mt-2">
              Logged in as: {email}
            </p>
          </div>

          <div className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5">
            AI Creator Studio
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-gradient-to-br from-[#182449] to-[#1A103D] p-8">

            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm mb-6">
              Creator Dashboard
            </div>

            <h2 className="text-6xl font-black leading-tight mb-6">
              Create your next AI video
            </h2>

            <p className="text-zinc-300 text-xl leading-9 max-w-3xl mb-10">
              Generate cinematic AI videos for Shorts, Reels, TikTok and YouTube.
            </p>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-6 mb-6">

              <label className="text-zinc-400 text-sm block mb-4">
                Your Idea
              </label>

              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe your video idea..."
                className="w-full h-40 rounded-2xl border border-white/10 bg-black/40 p-5 text-lg outline-none resize-none"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-zinc-400 text-sm mb-2">
                  Format
                </div>

                <select
                  value={videoFormat}
                  onChange={(e) => setVideoFormat(e.target.value)}
                  className="w-full bg-transparent text-xl font-bold outline-none"
                >
                  <option value="shorts">Shorts</option>
                  <option value="longform">Longform</option>
                  <option value="square">Square</option>
                </select>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-zinc-400 text-sm mb-2">
                  Length
                </div>

                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full bg-transparent text-xl font-bold outline-none"
                >
                  <option>15 sec</option>
                  <option>30 sec</option>
                  <option>60 sec</option>
                </select>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-zinc-400 text-sm mb-2">
                  Voice
                </div>

                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="w-full bg-transparent text-xl font-bold outline-none"
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

            </div>

<button
  onClick={generateVideo}
  disabled={isGenerating}
  className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 py-5 text-xl font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-3"
>
  {isGenerating ? (
    <>
      <Loader2 className="animate-spin w-6 h-6" />
      Generating cinematic video...
    </>
  ) : (
    "Generate Video"
  )}
</button>

          </div>

          <div className="space-y-6">

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

              <div className="text-zinc-400 mb-4">
                Current Plan
              </div>

              <div className="text-5xl font-black mb-6">
                Starter
              </div>

              <div className="w-full h-4 rounded-full bg-black/40 overflow-hidden mb-4">
                <div className="w-[10%] h-full bg-blue-500"></div>
              </div>

              <div className="text-zinc-400">
                3 / 30 videos used
              </div>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

              <div className="text-zinc-400 mb-4">
                Pipeline Status
              </div>

              <div className="space-y-4 text-lg">

                <div className="flex items-center justify-between">
                  <span>Analysis Engine</span>
                  <span>{pipelineStatus.analysis}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Motion Engine</span>
                  <span>{pipelineStatus.motion}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Render Engine</span>
                  <span>{pipelineStatus.render}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Auto Save System</span>
                  <span>{pipelineStatus.save}</span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
