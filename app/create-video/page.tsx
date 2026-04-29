"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Captions, Check, Clock, Mic, Play, Sparkles, Video, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const styles = [
  { id: "marketing", name: "Marketing", desc: "Product, service, brand, or offer promotion." },
  { id: "educational", name: "Educational", desc: "Teach useful information clearly and quickly." },
  { id: "story", name: "Story", desc: "Narrative style with a hook and emotional flow." },
  { id: "funny", name: "Funny", desc: "Humorous short-form content for engagement." }
];

const lengths = ["15 sec", "30 sec", "60 sec", "3 min"];
const voices = ["Male", "Female", "Energetic", "Calm"];
const platforms = ["TikTok", "YouTube Shorts", "Instagram Reels", "Long-form YouTube"];

export default function CreateVideoPage() {
  const [idea, setIdea] = useState("");
  const [style, setStyle] = useState("marketing");
  const [length, setLength] = useState("30 sec");
  const [voice, setVoice] = useState("Male");
  const [platform, setPlatform] = useState("YouTube Shorts");

  const selectedStyle = useMemo(() => styles.find((item) => item.id === style), [style]);

  function handleGenerate() {
    alert("Next step: AI script generation will be connected here.");
  }

  return (
    <main className="min-h-screen bg-[#070A12] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(139,92,246,0.18),_transparent_35%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        <header className="flex items-center justify-between mb-10">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-300 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black">VIDDO</span>
          </Link>
        </header>

        <section className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-blue-100 mb-5">
            <Sparkles className="w-4 h-4" /> AI Video Studio
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">Create a new AI video</h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Start with your idea. VIDDO will turn it into a ready-to-post video flow with script, voice, subtitles, and editing.
          </p>
        </section>

        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
          <Card className="bg-white/[0.04] border-white/10 rounded-3xl">
            <CardContent className="p-6 md:p-8">
              <div className="mb-7">
                <label className="block text-sm font-bold text-zinc-300 mb-3">1. Enter your video idea</label>
                <textarea
                  value={idea}
                  onChange={(event) => setIdea(event.target.value)}
                  placeholder="Example: Create a 30-second viral video about how AI helps small businesses save time."
                  className="w-full min-h-[150px] rounded-2xl bg-black/30 border border-white/10 px-5 py-4 text-white placeholder:text-zinc-600 outline-none focus:border-blue-400 transition resize-none"
                />
              </div>

              <div className="mb-7">
                <label className="block text-sm font-bold text-zinc-300 mb-3">2. Choose video style</label>
                <div className="grid md:grid-cols-2 gap-3">
                  {styles.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setStyle(item.id)}
                      className={`text-left rounded-2xl border p-4 transition ${style === item.id ? "bg-blue-500/15 border-blue-400/50" : "bg-black/20 border-white/10 hover:bg-white/[0.06]"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-black">{item.name}</h3>
                        {style === item.id && <Check className="w-5 h-5 text-blue-300" />}
                      </div>
                      <p className="text-sm text-zinc-400">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-3">3. Length</label>
                  <select value={length} onChange={(event) => setLength(event.target.value)} className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 text-white outline-none focus:border-blue-400">
                    {lengths.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-3">4. Voice</label>
                  <select value={voice} onChange={(event) => setVoice(event.target.value)} className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 text-white outline-none focus:border-blue-400">
                    {voices.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-3">5. Platform</label>
                  <select value={platform} onChange={(event) => setPlatform(event.target.value)} className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 text-white outline-none focus:border-blue-400">
                    {platforms.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>
              </div>

              <Button onClick={handleGenerate} className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 text-base font-black">
                Generate Video
                <Wand2 className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-[#0D1220]/90 border-white/10 rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-sm text-zinc-400">Video Preview</p>
                    <h2 className="text-2xl font-black">Generation Summary</h2>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs border border-blue-400/20">Draft</div>
                </div>

                <div className="aspect-[9/16] max-h-[520px] mx-auto rounded-3xl bg-gradient-to-br from-blue-500/30 via-violet-500/25 to-black border border-white/10 flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 rounded-2xl bg-white/[0.04] border border-white/10 p-4">
                    <Sparkles className="w-5 h-5 text-blue-300 mt-0.5" />
                    <div><p className="font-bold">Idea</p><p className="text-zinc-400">{idea || "Your idea will appear here."}</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4"><p className="text-zinc-400 mb-1">Style</p><p className="font-bold">{selectedStyle?.name}</p></div>
                    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4"><p className="text-zinc-400 mb-1">Platform</p><p className="font-bold">{platform}</p></div>
                    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-300" /><p className="font-bold">{length}</p></div>
                    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 flex items-center gap-2"><Mic className="w-4 h-4 text-blue-300" /><p className="font-bold">{voice}</p></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.04] border-white/10 rounded-3xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-black mb-4">Next engine steps</h3>
                <div className="space-y-3 text-zinc-300">
                  <div className="flex items-center gap-3"><Check className="w-4 h-4 text-blue-300" /> Create video request form</div>
                  <div className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-blue-300" /> Connect AI script generation</div>
                  <div className="flex items-center gap-3"><Mic className="w-4 h-4 text-blue-300" /> Connect AI voiceover</div>
                  <div className="flex items-center gap-3"><Captions className="w-4 h-4 text-blue-300" /> Add subtitles and rendering</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
