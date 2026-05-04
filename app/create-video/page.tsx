"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Captions, Check, Clock, Loader2, Mic, Play, Sparkles, Video, Wand2 } from "lucide-react";
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
  const [script, setScript] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);

  const selectedStyle = useMemo(() => styles.find((item) => item.id === style), [style]);

  async function handleGenerate() {
    setError("");

    if (!idea.trim()) {
      setError("Please enter a video idea first.");
      return;
    }

    setLoading(true);
    setScript("");
    setAudioUrl("");

    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, style, length, voice, platform })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setScript(data.script);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateVoice() {
    setVoiceLoading(true);
    setAudioUrl("");

    try {
      const res = await fetch("/api/generate-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, voice })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setAudioUrl(data.audioUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setVoiceLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070A12] text-white">
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-6">
        <h1 className="text-3xl font-bold mb-6">Create Video</h1>

        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Enter your video idea"
          className="w-full p-4 bg-black border mb-4"
        />

        <Button onClick={handleGenerate}>
          {loading ? "Generating..." : "Generate Script"}
        </Button>

        {script && (
          <div className="mt-4">
            <pre>{script}</pre>

            <Button onClick={handleGenerateVoice} className="mt-4">
              {voiceLoading ? "Generating Voice..." : "Generate Voice"}
            </Button>
          </div>
        )}

        {audioUrl && (
          <div className="mt-4">
            <audio controls src={audioUrl} />
          </div>
        )}

        {error && <p className="text-red-400">{error}</p>}
      </div>
    </main>
  );
}
