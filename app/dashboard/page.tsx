"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Video, Sparkles, Clock, Download, ImagePlus, Loader2, Trash2, Wand2, Clapperboard, Images, Film, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import SubtitleGenerator from "@/components/SubtitleGenerator";
import VideoRenderer from "@/components/VideoRenderer";

export default function DashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [studioOpen, setStudioOpen] = useState(false);

  const [idea, setIdea] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState("");
  const [scenes, setScenes] = useState("");
  const [sceneImage, setSceneImage] = useState("");
  const [motionVideo, setMotionVideo] = useState("");
  const [script, setScript] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [finalVideo, setFinalVideo] = useState("");
  const [error, setError] = useState("");

  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [sceneLoading, setSceneLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [motionLoading, setMotionLoading] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [finalLoading, setFinalLoading] = useState(false);

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

  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const base64Images = await Promise.all(files.map((file) => fileToBase64(file)));
    setImagePreviews((prev) => [...prev, ...base64Images]);
  }

  function removeImage(index: number) {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function analyzeImages() {
    if (!imagePreviews.length) return;
    setAnalysisLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analyze-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: imagePreviews, prompt: idea }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image analysis failed");
      setAnalysis(data.analysis || "No analysis returned");
    } catch (e: any) {
      setError(e.message || "Image analysis failed");
    } finally {
      setAnalysisLoading(false);
    }
  }

  async function generateScenes() {
    if (!analysis) return;
    setSceneLoading(true);
    try {
      const res = await fetch("/api/generate-scenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, analysis, platform: "TikTok", length: "30 sec" }),
      });
      const data = await res.json();
      setScenes(data.scenes || "No scenes generated");
    } catch {
      setError("Scene generation failed");
    } finally {
      setSceneLoading(false);
    }
  }

  async function generateSceneImages() {
    if (!scenes) return;
    setImageLoading(true);
    try {
      const res = await fetch("/api/generate-scene-images-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenes }),
      });
      const data = await res.json();
      if (data.imageBase64) setSceneImage(`data:image/png;base64,${data.imageBase64}`);
    } catch {
      setError("Scene image generation failed");
    } finally {
      setImageLoading(false);
    }
  }

  async function generateMotionVideo() {
    if (!sceneImage) return;
    setMotionLoading(true);
    try {
      const res = await fetch("/api/generate-motion-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: sceneImage, prompt: scenes }),
      });
      const data = await res.json();
      setMotionVideo(data.previewVideo || "");
    } catch {
      setError("Motion video generation failed");
    } finally {
      setMotionLoading(false);
    }
  }

  async function generateScript() {
    setScriptLoading(true);
    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      const data = await res.json();
      setScript(data.script || "");
    } catch {
      setError("Script generation failed");
    } finally {
      setScriptLoading(false);
    }
  }

  async function generateVoice() {
    if (!script) return;
    setVoiceLoading(true);
    try {
      const res = await fetch("/api/generate-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, voice: "Male" }),
      });
      const data = await res.json();
      setAudioUrl(data.audioUrl || "");
    } catch {
      setError("Voice generation failed");
    } finally {
      setVoiceLoading(false);
    }
  }

  async function renderFinalVideo() {
    if (!motionVideo) return;
    setFinalLoading(true);
    try {
      const res = await fetch("/api/render-final-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motionVideo, audioUrl, subtitles: script, sceneImage }),
      });
      const data = await res.json();
      setFinalVideo(data.finalVideo || "");
    } catch {
      setError("Final render failed");
    } finally {
      setFinalLoading(false);
    }
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
              <p className="text-zinc-300 max-w-2xl mb-8">Create videos without leaving this dashboard. Add prompts, upload images, generate scenes, voice, subtitles, and export.</p>
              <Button onClick={() => setStudioOpen(true)} className="h-14 px-7 rounded-2xl bg-blue-500 hover:bg-blue-600 text-base font-bold">
                <Plus className="w-5 h-5 mr-2" /> Create Video
              </Button>
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

        {studioOpen && (
          <section className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6 items-start mb-8" id="studio">
            <Card className="bg-white/[0.04] border-white/10 rounded-3xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black">VIDDO AI Studio</h2>
                  <Button variant="outline" onClick={() => setStudioOpen(false)} className="rounded-xl border-white/15 bg-white/5 hover:bg-white/10 text-white">Close</Button>
                </div>
                <textarea value={idea} onChange={(e)=>setIdea(e.target.value)} placeholder="Describe your video idea..." className="w-full min-h-[140px] rounded-2xl bg-black/30 border border-white/10 p-4" />

                <div className="rounded-3xl border border-dashed border-white/15 p-6 bg-black/20">
                  <div onClick={()=>fileInputRef.current?.click()} className="text-center cursor-pointer">
                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                    <ImagePlus className="w-10 h-10 mx-auto mb-3 text-blue-300" />
                    <p className="font-bold text-lg">Upload Multiple Reference Images</p>
                    <p className="text-zinc-400 text-sm mt-2">Upload faces, products, characters, scenes, or brand assets.</p>
                  </div>
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                      {imagePreviews.map((preview,index)=>(
                        <div key={index} className="relative group overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                          <img src={preview} className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105" />
                          <button onClick={()=>removeImage(index)} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5 shadow-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button onClick={analyzeImages} disabled={analysisLoading || imagePreviews.length===0} className="w-full rounded-2xl bg-emerald-500 hover:bg-emerald-600">{analysisLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</> : "Analyze Uploaded Images"}</Button>
                <Button onClick={generateScenes} disabled={sceneLoading || !analysis} className="w-full rounded-2xl bg-orange-500 hover:bg-orange-600">{sceneLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating Scenes...</> : <><Clapperboard className="w-4 h-4 mr-2" />Generate Scenes</>}</Button>
                <Button onClick={generateSceneImages} disabled={imageLoading || !scenes} className="w-full rounded-2xl bg-pink-500 hover:bg-pink-600">{imageLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating Images...</> : <><Images className="w-4 h-4 mr-2" />Generate Scene Images</>}</Button>
                <Button onClick={generateMotionVideo} disabled={motionLoading || !sceneImage} className="w-full rounded-2xl bg-cyan-500 hover:bg-cyan-600">{motionLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating Motion...</> : <><Film className="w-4 h-4 mr-2" />Generate Motion Video</>}</Button>
                <Button onClick={generateScript} disabled={scriptLoading} className="w-full rounded-2xl bg-blue-500 hover:bg-blue-600">{scriptLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating Script...</> : <><Wand2 className="w-4 h-4 mr-2" />Generate Script</>}</Button>
                <Button onClick={generateVoice} disabled={voiceLoading || !script} className="w-full rounded-2xl bg-violet-500 hover:bg-violet-600">{voiceLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating Voice...</> : <><Music className="w-4 h-4 mr-2" />Generate Voice</>}</Button>
                <Button onClick={renderFinalVideo} disabled={finalLoading || !motionVideo} className="w-full rounded-2xl bg-red-500 hover:bg-red-600">{finalLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Rendering Final Video...</> : <><Download className="w-4 h-4 mr-2" />Render Final Video</>}</Button>
                {error && <div className="text-red-300">{error}</div>}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-[#0D1220]/90 border-white/10 rounded-3xl"><CardContent className="p-6 space-y-4"><h2 className="text-2xl font-black">AI Analysis</h2><div className="rounded-2xl bg-black/30 border border-white/10 p-4 whitespace-pre-wrap min-h-[140px]">{analysis || "Analysis output"}</div></CardContent></Card>
              <Card className="bg-[#0D1220]/90 border-white/10 rounded-3xl"><CardContent className="p-6 space-y-4"><h2 className="text-2xl font-black">AI Scenes</h2><div className="rounded-2xl bg-black/30 border border-white/10 p-4 whitespace-pre-wrap min-h-[180px]">{scenes || "Scene output"}</div></CardContent></Card>
              <Card className="bg-[#0D1220]/90 border-white/10 rounded-3xl"><CardContent className="p-6 space-y-4"><h2 className="text-2xl font-black">AI Scene Image</h2>{sceneImage ? <img src={sceneImage} className="w-full rounded-2xl" /> : <div className="rounded-2xl bg-black/30 border border-white/10 p-4 min-h-[240px] flex items-center justify-center">AI scene image preview</div>}</CardContent></Card>
              <Card className="bg-[#0D1220]/90 border-white/10 rounded-3xl"><CardContent className="p-6 space-y-4"><h2 className="text-2xl font-black">Motion Video</h2>{motionVideo ? <video controls className="w-full rounded-2xl"><source src={motionVideo} type="video/mp4" /></video> : <div className="rounded-2xl bg-black/30 border border-white/10 p-4 min-h-[240px] flex items-center justify-center">Motion video preview</div>}</CardContent></Card>
              <Card className="bg-[#0D1220]/90 border-white/10 rounded-3xl"><CardContent className="p-6 space-y-4"><h2 className="text-2xl font-black">Final Rendered Video</h2>{finalVideo ? <><video controls className="w-full rounded-2xl border border-white/10"><source src={finalVideo} type="video/mp4" /></video><a href={finalVideo} download className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-green-500 hover:bg-green-600 font-bold"><Download className="w-4 h-4" /> Download Final Video</a></> : <div className="rounded-2xl bg-black/30 border border-white/10 p-4 min-h-[240px] flex items-center justify-center text-zinc-500">Final rendered AI video will appear here.</div>}</CardContent></Card>
              <Card className="bg-[#0D1220]/90 border-white/10 rounded-3xl"><CardContent className="p-6 space-y-4"><h2 className="text-2xl font-black">Generated Script</h2><div className="rounded-2xl bg-black/30 border border-white/10 p-4 whitespace-pre-wrap min-h-[180px]">{script || "Generated script output"}</div>{audioUrl && <audio controls src={audioUrl} className="w-full" />}<SubtitleGenerator script={script} /><VideoRenderer script={script} audioUrl={audioUrl} platform="TikTok" length="30 sec" /></CardContent></Card>
            </div>
          </section>
        )}

        {!studioOpen && (
          <>
            <section className="grid md:grid-cols-3 gap-5 mb-8">
              <Card className="bg-white/[0.04] border-white/10 rounded-3xl"><CardContent className="p-6"><Clock className="w-6 h-6 text-blue-300 mb-4" /><p className="text-zinc-400">Rendering Queue</p><h3 className="text-3xl font-black">0</h3></CardContent></Card>
              <Card className="bg-white/[0.04] border-white/10 rounded-3xl"><CardContent className="p-6"><Video className="w-6 h-6 text-blue-300 mb-4" /><p className="text-zinc-400">Created Videos</p><h3 className="text-3xl font-black">0</h3></CardContent></Card>
              <Card className="bg-white/[0.04] border-white/10 rounded-3xl"><CardContent className="p-6"><Download className="w-6 h-6 text-blue-300 mb-4" /><p className="text-zinc-400">Downloads</p><h3 className="text-3xl font-black">0</h3></CardContent></Card>
            </section>
            <Card className="bg-white/[0.04] border-white/10 rounded-3xl"><CardContent className="p-7"><h2 className="text-2xl font-black mb-2">Recent Videos</h2><p className="text-zinc-400 mb-6">Generated videos will appear here after you create videos.</p><div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-zinc-400">No videos yet. Create your first video next.</div></CardContent></Card>
          </>
        )}
      </div>
    </main>
  );
}
