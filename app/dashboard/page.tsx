"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Clock,
  Download,
  Film,
  ImagePlus,
  Loader2,
  LogOut,
  Music,
  Sparkles,
  Trash2,
  Video,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import SubtitleGenerator from "@/components/SubtitleGenerator";
import VideoRenderer from "@/components/VideoRenderer";

type VideoFormat = "shorts" | "longform" | "square";
type PipelineStepStatus = "idle" | "running" | "done" | "error";

const VIDEO_FORMATS: Record<VideoFormat, { label: string; desc: string; aspect: string }> = {
  shorts: {
    label: "Shorts / Reels / TikTok",
    desc: "9:16 vertical video",
    aspect: "9:16",
  },
  longform: {
    label: "YouTube Longform",
    desc: "16:9 horizontal video",
    aspect: "16:9",
  },
  square: {
    label: "Square Feed",
    desc: "1:1 social feed video",
    aspect: "1:1",
  },
};

const INITIAL_STEPS: Array<{ key: string; label: string; status: PipelineStepStatus }> = [
  { key: "analysis", label: "Image / Prompt Analysis", status: "idle" },
  { key: "scenes", label: "Cinematic Scene Direction", status: "idle" },
  { key: "images", label: "AI Scene Image", status: "idle" },
  { key: "motion", label: "Motion Video", status: "idle" },
  { key: "script", label: "Script Generation", status: "idle" },
  { key: "voice", label: "Voice Generation", status: "idle" },
  { key: "render", label: "Final Render", status: "idle" },
];

export default function DashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [idea, setIdea] = useState("");
  const [videoFormat, setVideoFormat] = useState<VideoFormat>("shorts");
  const [length, setLength] = useState("30 sec");
  const [voice, setVoice] = useState("Male");

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState("");
  const [scenes, setScenes] = useState("");
  const [sceneImage, setSceneImage] = useState("");
  const [motionVideo, setMotionVideo] = useState("");
  const [script, setScript] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [finalVideo, setFinalVideo] = useState("");
  const [error, setError] = useState("");
  const [steps, setSteps] = useState(INITIAL_STEPS);

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

  function updateStep(key: string, status: PipelineStepStatus) {
    setSteps((prev) =>
      prev.map((step) => (step.key === key ? { ...step, status } : step))
    );
  }

  function resetOutputs() {
    setAnalysis("");
    setScenes("");
    setSceneImage("");
    setMotionVideo("");
    setScript("");
    setAudioUrl("");
    setFinalVideo("");
    setError("");
    setSteps(INITIAL_STEPS);
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

  async function postJson(path: string, payload: Record<string, unknown>) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `${path} failed`);
    }

    return data;
  }

  async function generateVideo() {
    if (!idea.trim()) {
      setError("Please enter a video idea first.");
      return;
    }

    resetOutputs();
    setIsGenerating(true);
    setAdvancedOpen(true);

    try {
      updateStep("analysis", "running");
      let analysisResult = "No reference image uploaded. Generate scenes based on the user's prompt only.";

      if (imagePreviews.length > 0) {
        const data = await postJson("/api/analyze-images", {
          images: imagePreviews,
          prompt: idea,
        });
        analysisResult = data.analysis || analysisResult;
      }

      setAnalysis(analysisResult);
      updateStep("analysis", "done");

      updateStep("scenes", "running");
      const sceneData = await postJson("/api/generate-scenes", {
        idea,
        analysis: analysisResult,
        platform: VIDEO_FORMATS[videoFormat].label,
        length,
        videoFormat,
      });
      const sceneText = sceneData.scenes || "";
      setScenes(sceneText);
      updateStep("scenes", "done");

      updateStep("images", "running");
      const imageData = await postJson("/api/generate-scene-images-batch", {
        scenes: sceneText,
        videoFormat,
      });
      const generatedSceneImage = imageData.imageBase64
        ? `data:image/png;base64,${imageData.imageBase64}`
        : "";
      setSceneImage(generatedSceneImage);
      updateStep("images", "done");

      updateStep("motion", "running");
      const motionData = await postJson("/api/generate-motion-video", {
        image: generatedSceneImage,
        prompt: sceneText,
        videoFormat,
        aspectRatio: VIDEO_FORMATS[videoFormat].aspect,
      });
      const generatedMotionVideo = motionData.previewVideo || "";
      setMotionVideo(generatedMotionVideo);
      updateStep("motion", "done");

      updateStep("script", "running");
      const scriptData = await postJson("/api/generate-script", {
        idea,
        platform: VIDEO_FORMATS[videoFormat].label,
        length,
        voice,
      });
      const scriptText = scriptData.script || "";
      setScript(scriptText);
      updateStep("script", "done");

      updateStep("voice", "running");
      const voiceData = await postJson("/api/generate-voice", {
        script: scriptText,
        voice,
      });
      const generatedAudioUrl = voiceData.audioUrl || "";
      setAudioUrl(generatedAudioUrl);
      updateStep("voice", "done");

      updateStep("render", "running");
      const renderData = await postJson("/api/render-final-video", {
        motionVideo: generatedMotionVideo,
        audioUrl: generatedAudioUrl,
        subtitles: scriptText,
        sceneImage: generatedSceneImage,
        videoFormat,
        aspectRatio: VIDEO_FORMATS[videoFormat].aspect,
      });
      setFinalVideo(renderData.finalVideo || "");
      updateStep("render", "done");
    } catch (e: any) {
      setError(e.message || "Video generation failed");
      setSteps((prev) =>
        prev.map((step) => (step.status === "running" ? { ...step, status: "error" } : step))
      );
    } finally {
      setIsGenerating(false);
    }
  }

  if (loading) {
    return <main className="min-h-screen bg-[#070A12] text-white flex items-center justify-center">Loading...</main>;
  }

  return (
    <main className="min-h-screen bg-[#070A12] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.26),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(139,92,246,0.2),_transparent_35%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        <header className="flex items-center justify-between mb-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black">VIDDO</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm text-zinc-400">{email}</span>
            <Button onClick={handleLogout} variant="outline" className="rounded-xl border-white/15 bg-white/5 hover:bg-white/10 text-white">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </header>

        <section className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 items-start mb-8">
          <Card className="bg-[#0D1220]/90 border-white/10 rounded-[2rem] shadow-2xl overflow-hidden">
            <CardContent className="p-7 md:p-9 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/15 border border-blue-400/20 text-blue-200 text-sm mb-5">
                  <Sparkles className="w-4 h-4" /> AI Video Creator
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4">Create videos in one click</h1>
                <p className="text-zinc-400 text-lg">Enter your idea, choose the video format, optionally upload reference images, and VIDDO will run the full AI production pipeline.</p>
              </div>

              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Example: Create a 30-second TikTok ad using this product image. Make it cinematic and persuasive."
                className="w-full min-h-[160px] rounded-3xl bg-black/30 border border-white/10 p-5 outline-none focus:border-blue-400 resize-none"
              />

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-2">Video Format</label>
                  <select value={videoFormat} onChange={(e) => setVideoFormat(e.target.value as VideoFormat)} className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 outline-none focus:border-blue-400">
                    <option value="shorts">Shorts / Reels / TikTok</option>
                    <option value="longform">YouTube Longform</option>
                    <option value="square">Square Feed</option>
                  </select>
                  <p className="text-xs text-zinc-500 mt-2">{VIDEO_FORMATS[videoFormat].desc}</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-2">Length</label>
                  <select value={length} onChange={(e) => setLength(e.target.value)} className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 outline-none focus:border-blue-400">
                    <option>15 sec</option>
                    <option>30 sec</option>
                    <option>60 sec</option>
                    <option>3 min</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-2">Voice</label>
                  <select value={voice} onChange={(e) => setVoice(e.target.value)} className="w-full h-12 rounded-2xl bg-black/30 border border-white/10 px-4 outline-none focus:border-blue-400">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Energetic</option>
                    <option>Calm</option>
                  </select>
                </div>
              </div>

              <div className="rounded-3xl border border-dashed border-white/15 p-6 bg-black/20">
                <div onClick={() => fileInputRef.current?.click()} className="text-center cursor-pointer">
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  <ImagePlus className="w-10 h-10 mx-auto mb-3 text-blue-300" />
                  <p className="font-bold text-lg">Upload reference images</p>
                  <p className="text-zinc-400 text-sm mt-2">Optional. Add product, face, character, or brand images.</p>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                        <img src={preview} className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105" />
                        <button onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5 shadow-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button onClick={generateVideo} disabled={isGenerating} className="w-full h-15 rounded-3xl bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 text-lg font-black">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating Full Video...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" /> Generate Video
                  </>
                )}
              </Button>

              {error && <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-200 text-sm">{error}</div>}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-white/[0.04] border-white/10 rounded-[2rem]">
              <CardContent className="p-7">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-zinc-400 text-sm">Selected format</p>
                    <h2 className="text-2xl font-black">{VIDEO_FORMATS[videoFormat].label}</h2>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-blue-500/15 border border-blue-400/20 text-blue-200 font-bold">{VIDEO_FORMATS[videoFormat].aspect}</div>
                </div>

                <div className="space-y-3">
                  {steps.map((step) => (
                    <div key={step.key} className="flex items-center justify-between rounded-2xl bg-black/25 border border-white/10 p-4">
                      <div className="flex items-center gap-3">
                        {step.status === "done" ? <Check className="w-5 h-5 text-green-400" /> : step.status === "running" ? <Loader2 className="w-5 h-5 text-blue-300 animate-spin" /> : step.status === "error" ? <Clock className="w-5 h-5 text-red-300" /> : <Clock className="w-5 h-5 text-zinc-500" />}
                        <span className="font-bold text-zinc-200">{step.label}</span>
                      </div>
                      <span className="text-xs text-zinc-500 uppercase">{step.status}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0D1220]/90 border-white/10 rounded-[2rem]">
              <CardContent className="p-7 space-y-4">
                <h2 className="text-2xl font-black">Final Video</h2>
                {finalVideo ? (
                  <>
                    <video controls className="w-full rounded-2xl border border-white/10">
                      <source src={finalVideo} type="video/mp4" />
                    </video>
                    <a href={finalVideo} download className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-green-500 hover:bg-green-600 font-bold">
                      <Download className="w-4 h-4" /> Download Final Video
                    </a>
                  </>
                ) : motionVideo ? (
                  <video controls className="w-full rounded-2xl border border-white/10">
                    <source src={motionVideo} type="video/mp4" />
                  </video>
                ) : sceneImage ? (
                  <img src={sceneImage} className="w-full rounded-2xl border border-white/10" />
                ) : (
                  <div className="min-h-[360px] rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center text-zinc-500">
                    Preview will appear here after generation starts.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {advancedOpen && (
          <section className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-[#0D1220]/90 border-white/10 rounded-[2rem]">
              <CardContent className="p-7 space-y-4">
                <h2 className="text-2xl font-black">AI Analysis</h2>
                <div className="rounded-2xl bg-black/30 border border-white/10 p-4 whitespace-pre-wrap min-h-[140px] text-zinc-300">{analysis || "Analysis output"}</div>
              </CardContent>
            </Card>

            <Card className="bg-[#0D1220]/90 border-white/10 rounded-[2rem]">
              <CardContent className="p-7 space-y-4">
                <h2 className="text-2xl font-black">AI Scenes</h2>
                <div className="rounded-2xl bg-black/30 border border-white/10 p-4 whitespace-pre-wrap min-h-[180px] text-zinc-300">{scenes || "Scene output"}</div>
              </CardContent>
            </Card>

            <Card className="bg-[#0D1220]/90 border-white/10 rounded-[2rem]">
              <CardContent className="p-7 space-y-4">
                <h2 className="text-2xl font-black">Generated Script</h2>
                <div className="rounded-2xl bg-black/30 border border-white/10 p-4 whitespace-pre-wrap min-h-[180px] text-zinc-300">{script || "Generated script output"}</div>
                {audioUrl && <audio controls src={audioUrl} className="w-full" />}
                <SubtitleGenerator script={script} />
              </CardContent>
            </Card>

            <Card className="bg-[#0D1220]/90 border-white/10 rounded-[2rem]">
              <CardContent className="p-7 space-y-4">
                <h2 className="text-2xl font-black">Renderer Preview</h2>
                <VideoRenderer script={script} audioUrl={audioUrl} platform={VIDEO_FORMATS[videoFormat].label} length={length} />
              </CardContent>
            </Card>
          </section>
        )}

        <section className="grid md:grid-cols-3 gap-5 mb-8">
          <Card className="bg-white/[0.04] border-white/10 rounded-3xl"><CardContent className="p-6"><Clock className="w-6 h-6 text-blue-300 mb-4" /><p className="text-zinc-400">Rendering Queue</p><h3 className="text-3xl font-black">{isGenerating ? 1 : 0}</h3></CardContent></Card>
          <Card className="bg-white/[0.04] border-white/10 rounded-3xl"><CardContent className="p-6"><Video className="w-6 h-6 text-blue-300 mb-4" /><p className="text-zinc-400">Created Videos</p><h3 className="text-3xl font-black">{finalVideo ? 1 : 0}</h3></CardContent></Card>
          <Card className="bg-white/[0.04] border-white/10 rounded-3xl"><CardContent className="p-6"><Download className="w-6 h-6 text-blue-300 mb-4" /><p className="text-zinc-400">Downloads</p><h3 className="text-3xl font-black">0</h3></CardContent></Card>
        </section>
      </div>
    </main>
  );
}
