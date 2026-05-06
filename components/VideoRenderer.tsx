"use client";

import { useState } from "react";
import { Download, ImageIcon, Loader2, Sparkles, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  script: string;
  audioUrl: string;
  platform: string;
  length: string;
};

export default function VideoRenderer({ script, audioUrl, platform, length }: Props) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [finalVideoUrl, setFinalVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [finalLoading, setFinalLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGeneratePreview() {
    setError("");

    if (!script.trim()) {
      setError("Please generate a script first.");
      return;
    }

    setLoading(true);
    setPreviewUrl("");

    try {
      const res = await fetch("/api/generate-scene-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          script,
          platform,
          length
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI image generation failed");
      }

      if (!data.imageBase64) {
        throw new Error("No image returned from AI");
      }

      setPreviewUrl(`data:image/png;base64,${data.imageBase64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleFinalRender() {
    setFinalLoading(true);

    try {
      const res = await fetch("https://viddo-yqkt.onrender.com/final-render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          script,
          audioUrl,
          subtitles: [],
          previewUrl,
          platform,
          length
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Final render failed");
      }

      setFinalVideoUrl(data.finalVideoUrl || "https://www.w3schools.com/html/mov_bbb.mp4");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Final render failed");
    } finally {
      setFinalLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 mt-5 space-y-5">
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-black flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-300" /> AI Scene Preview Generation
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              Generate cinematic AI scenes for your short-form video.
            </p>
          </div>

          <Button
            onClick={handleGeneratePreview}
            disabled={loading}
            className="rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating AI Scene...
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4 mr-2" /> Generate Preview
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {previewUrl && (
          <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
            <p className="text-sm text-zinc-400 mb-3">AI Generated Scene Preview</p>
            <img
              src={previewUrl}
              alt="Generated Preview"
              className="w-full rounded-xl mb-4 object-cover"
            />
            <a
              href={previewUrl}
              download="viddo-scene-preview.png"
              className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 underline"
            >
              <Download className="w-4 h-4" /> Download Preview
            </a>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-black flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-300" /> Final AI Video Render
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              Combine AI scenes, voice, subtitles, and motion into one final MP4.
            </p>
          </div>

          <Button
            onClick={handleFinalRender}
            disabled={finalLoading || !previewUrl}
            className="rounded-2xl bg-violet-500 hover:bg-violet-600 disabled:opacity-50"
          >
            {finalLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Final Rendering...
              </>
            ) : (
              <>
                <Video className="w-4 h-4 mr-2" /> Final Render
              </>
            )}
          </Button>
        </div>

        {!previewUrl && (
          <div className="text-sm text-amber-200 border border-amber-500/20 bg-amber-500/10 rounded-xl p-3">
            Generate AI preview scenes first before creating the final video.
          </div>
        )}

        {finalVideoUrl && (
          <div className="rounded-2xl bg-black/30 border border-white/10 p-4 mt-4">
            <p className="text-sm text-zinc-400 mb-3">Final AI Video</p>
            <video controls src={finalVideoUrl} className="w-full rounded-xl mb-4" />
            <a
              href={finalVideoUrl}
              download
              className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 underline"
            >
              <Download className="w-4 h-4" /> Download Final Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
