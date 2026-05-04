"use client";

import { useState } from "react";
import { Download, Loader2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  script: string;
  audioUrl: string;
  platform: string;
  length: string;
};

export default function VideoRenderer({ script, audioUrl, platform, length }: Props) {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRenderVideo() {
    setError("");

    if (!script.trim()) {
      setError("Please generate a script first.");
      return;
    }

    setLoading(true);
    setVideoUrl("");

    try {
      const res = await fetch("/api/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, audioUrl, subtitles: [], platform, length })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to render video.");

      setVideoUrl(data.videoUrl || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to render video.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 mt-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-black flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-300" /> Video Rendering
          </h3>
          <p className="text-sm text-zinc-400 mt-1">Render a mock video preview and test the final flow.</p>
        </div>

        <Button onClick={handleRenderVideo} disabled={loading} className="rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Rendering...
            </>
          ) : (
            <>
              <Video className="w-4 h-4 mr-2" /> Generate Video
            </>
          )}
        </Button>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

      {videoUrl && (
        <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
          <p className="text-sm text-zinc-400 mb-3">Video Preview</p>
          <video controls src={videoUrl} className="w-full rounded-xl mb-4" />
          <a href={videoUrl} download className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 underline">
            <Download className="w-4 h-4" /> Download Video
          </a>
        </div>
      )}
    </div>
  );
}
