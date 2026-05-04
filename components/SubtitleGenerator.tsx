"use client";

import { useState } from "react";
import { Captions, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Subtitle = {
  id: number;
  start: number;
  end: number;
  text: string;
};

type Props = {
  script: string;
};

export default function SubtitleGenerator({ script }: Props) {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerateSubtitles() {
    setError("");

    if (!script.trim()) {
      setError("Please generate a script first.");
      return;
    }

    setLoading(true);
    setSubtitles([]);

    try {
      const res = await fetch("/api/generate-subtitles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate subtitles.");

      setSubtitles(data.subtitles || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate subtitles.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 mt-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-black flex items-center gap-2">
            <Captions className="w-5 h-5 text-blue-300" /> Subtitle Generation
          </h3>
          <p className="text-sm text-zinc-400 mt-1">Generate timed mock subtitles from the script.</p>
        </div>

        <Button onClick={handleGenerateSubtitles} disabled={loading} className="rounded-2xl bg-violet-500 hover:bg-violet-600 disabled:opacity-60">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Captions className="w-4 h-4 mr-2" /> Generate Subtitles
            </>
          )}
        </Button>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

      {subtitles.length > 0 && (
        <div className="space-y-2">
          {subtitles.map((subtitle) => (
            <div key={subtitle.id} className="rounded-xl bg-black/30 border border-white/10 p-3 text-sm">
              <span className="text-blue-300">[{subtitle.start}s - {subtitle.end}s]</span> {subtitle.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
