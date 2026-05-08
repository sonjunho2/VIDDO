"use client";

import VideoRenderer from "@/components/VideoRenderer";
import SubtitleGenerator from "@/components/SubtitleGenerator";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Captions, Check, ImagePlus, Loader2, Mic, Music, Sparkles, Trash2, Upload, Video, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const styles = ["Marketing", "Educational", "Story", "Funny"];
const lengths = ["15 sec", "30 sec", "60 sec", "3 min"];
const voices = ["Male", "Female", "Energetic", "Calm"];
const platforms = ["TikTok", "YouTube Shorts", "Instagram Reels", "Long-form YouTube"];

export default function CreateVideoPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [idea, setIdea] = useState("");
  const [style, setStyle] = useState("Marketing");
  const [length, setLength] = useState("30 sec");
  const [voice, setVoice] = useState("Male");
  const [platform, setPlatform] = useState("TikTok");
  const [script, setScript] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setUploadedImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  }

  function removeImage(index: number) {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleGenerateScript() {
    setError("");
    setScript("");
    setAudioUrl("");

    if (!idea.trim()) {
      setError("Please enter a video idea first.");
      return;
    }

    setLoading(true);

    try {
      const enhancedIdea = uploadedImages.length > 0
        ? `${idea}\n\nReference Images Attached: Generate the video based on uploaded images while maintaining character, product, and visual consistency.`
        : idea;

      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: enhancedIdea,
          style,
          length,
          voice,
          platform
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate script.");
      }

      setScript(data.script || "No script returned.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate script.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateVoice() {
    setError("");

    if (!script.trim()) {
      setError("Please generate a script first.");
      return;
    }

    setVoiceLoading(true);
    setAudioUrl("");

    try {
      const res = await fetch("/api/generate-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, voice })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate voice.");
      }

      setAudioUrl(data.audioUrl || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate voice.");
    } finally {
      setVoiceLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070A12] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(139,92,246,0.18),_transparent_35%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        <header className="flex items-center justify-between mb-10">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-300 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
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

          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            Create AI videos from text or multiple images
          </h1>

          <p className="text-zinc-400 text-lg max-w-3xl">
            Generate viral short-form or long-form AI videos using natural language prompts. Optionally upload multiple images to create consistent scenes, characters, brands, and products.
          </p>
        </section>

        <section className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6 items-start">
          <Card className="bg-white/[0.04] border-white/10 rounded-3xl">
            <CardContent className="p-6 md:p-8">
              <div className="mb-6">
                <label className="block text-sm font-bold text-zinc-300 mb-3">
                  1. Enter your video idea
                </label>

                <textarea
                  value={idea}
                  onChange={(event) => setIdea(event.target.value)}
                  placeholder="Example: Create a cinematic TikTok video showing how AI helps entrepreneurs automate their business."
                  className="w-full min-h-[150px] rounded-2xl bg-black/30 border border-white/10 px-5 py-4 text-white placeholder:text-zinc-600 outline-none focus:border-blue-400 transition resize-none"
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-bold text-zinc-300">
                    2. Upload reference images (Optional)
                  </label>

                  <div className="text-xs text-zinc-500">
                    {uploadedImages.length} image(s) uploaded
                  </div>
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded-3xl border border-dashed border-white/15 bg-black/20 hover:bg-white/[0.04] transition p-6 text-center mb-4"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                    <ImagePlus className="w-8 h-8 text-blue-300" />
                  </div>

                  <h3 className="text-lg font-black mb-2">
                    Upload Multiple Reference Images
                  </h3>

                  <p className="text-sm text-zinc-400 max-w-md mx-auto mb-4">
                    Upload faces, products, characters, scenes, or brand assets. VIDDO will use them to maintain consistency across generated videos.
                  </p>

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-500 text-white font-bold text-sm">
                    <Upload className="w-4 h-4" /> Add Images
                  </div>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                        <img
                          src={preview}
                          alt={`Reference ${index + 1}`}
                          className="w-full h-40 object-cover"
                        />

                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/90 hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-zinc-300 mb-3">
                  3. Choose video style
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {styles.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setStyle(item)}
                      className={`rounded-2xl border p-4 text-left transition ${style === item ? "bg-blue-500/15 border-blue-400/50" : "bg-black/20 border-white/10 hover:bg-white/[0.06]"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black">{item}</span>
                        {style === item && <Check className="w-5 h-5 text-blue-300" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-3">4. Length</label>
                  <select value={length} onChange={(event) => setLength(event.target.value)} className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 text-white outline-none focus:border-blue-400">
                    {lengths.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-3">5. Voice</label>
                  <select value={voice} onChange={(event) => setVoice(event.target.value)} className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 text-white outline-none focus:border-blue-400">
                    {voices.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-3">6. Platform</label>
                  <select value={platform} onChange={(event) => setPlatform(event.target.value)} className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 text-white outline-none focus:border-blue-400">
                    {platforms.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
                  {error}
                </div>
              )}

              <Button
                onClick={handleGenerateScript}
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 text-base font-black disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating Script...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" /> Generate Script
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-[#0D1220]/90 border-white/10 rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-sm text-zinc-400">Generation Summary</p>
                    <h2 className="text-2xl font-black">AI Script Result</h2>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs border border-blue-400/20">
                    Script
                  </div>
                </div>

                <div className="rounded-2xl bg-black/30 border border-white/10 p-5 min-h-[360px] whitespace-pre-wrap text-zinc-200 leading-relaxed mb-5">
                  {loading
                    ? "VIDDO is writing your script..."
                    : script || "Your generated script will appear here after you click Generate Script."}
                </div>

                {script && (
                  <>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-black flex items-center gap-2">
                            <Mic className="w-5 h-5 text-blue-300" /> Voice Generation
                          </h3>

                          <p className="text-sm text-zinc-400 mt-1">
                            AI voice generation connected for testing.
                          </p>
                        </div>

                        <Button
                          onClick={handleGenerateVoice}
                          disabled={voiceLoading}
                          className="rounded-2xl bg-blue-500 hover:bg-blue-600 disabled:opacity-60"
                        >
                          {voiceLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
                            </>
                          ) : (
                            <>
                              <Music className="w-4 h-4 mr-2" /> Generate Voice
                            </>
                          )}
                        </Button>
                      </div>

                      {audioUrl && (
                        <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
                          <p className="text-sm text-zinc-400 mb-3">Voice Preview</p>
                          <audio controls src={audioUrl} className="w-full" />
                        </div>
                      )}
                    </div>

                    <SubtitleGenerator script={script} />

                    <VideoRenderer
                      script={script}
                      audioUrl={audioUrl}
                      platform={platform}
                      length={length}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
