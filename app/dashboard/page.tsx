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
  const [sceneOutput, setSceneOutput] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [generatedVideo, setGeneratedVideo] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [pipelineStatus, setPipelineStatus] = useState({
  analysis: "idle",
  motion: "idle",
  render: "idle",
  save: "idle",
});

async function saveProject(
  sceneText: string,
  imageUrl: string
) {
  const { data: userData } =
    await supabase.auth.getUser();

  if (!userData.user) return;

  await supabase
    .from("projects")
    .insert([
      {
        user_id: userData.user.id,
        idea,
        scene_output: sceneText,
        generated_image: imageUrl,
        video_format: videoFormat,
        video_length: length,
        voice,
      },
    ]);
}
  
async function loadProjects() {
  const { data: userData } =
    await supabase.auth.getUser();

  if (!userData.user) return;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", {
      ascending: false,
    });

  if (!error && data) {
    setProjects(data);
  }
}
  function openProject(project: any) {
  setIdea(project.idea || "");

  setSceneOutput(
    project.scene_output || ""
  );

  setGeneratedImage(
    project.generated_image || ""
  );

  setVideoFormat(
    project.video_format || "shorts"
  );
}
  async function generateMotionVideo() {
  if (!generatedImage) return;

  try {
    setPipelineStatus({
      analysis: "done",
      motion: "running",
      render: "idle",
      save: "idle",
    });

    const response = await fetch(
      "/api/generate-motion-video",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: generatedImage,
          prompt: idea,
        }),
      }
    );

    const data = await response.json();

    if (data.videoUrl) {
      setGeneratedVideo(data.videoUrl);

      setPipelineStatus({
        analysis: "done",
        motion: "done",
        render: "ready",
        save: "idle",
      });
    }
  } catch (error) {
    console.error(error);

    setPipelineStatus({
      analysis: "done",
      motion: "error",
      render: "idle",
      save: "idle",
    });
  }
}
useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();

      setEmail(data.user?.email ?? null);
      setLoading(false);
    }

    loadUser();
    loadProjects();
  }, []);

  async function generateVideo() {
    if (!idea.trim()) return;

    setIsGenerating(true);
    setError("");
    setSceneOutput("");
    setGeneratedImage("");

    setPipelineStatus({
      analysis: "running",
      motion: "idle",
      render: "idle",
      save: "idle",
    });

    try {
      let imageAnalysis = "";

if (uploadedImages.length > 0) {
  const analysisResponse = await fetch(
    "/api/analyze-images",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        images: uploadedImages,
      }),
    }
  );

  const analysisData = await analysisResponse.json();

  imageAnalysis =
    analysisData.analysis ||
    "Uploaded image analysis unavailable";
}
      const response = await fetch("/api/generate-scenes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea,
          analysis:
  imageAnalysis ||
  "No uploaded reference image. Use prompt-only video direction.",
          platform: videoFormat,
          length,
          videoFormat,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Scene generation failed");
      }

      setSceneOutput(data.scenes || "No scenes generated");

      const imageResponse = await fetch(
  "/api/generate-scene-images-batch",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scenes: [data.scenes],
      settings: {
        imageSize:
          videoFormat === "longform"
            ? "1536x1024"
            : "1024x1536",
      },
    }),
  }
);

const imageData = await imageResponse.json();

console.log("IMAGE RESPONSE:", imageData);

if (imageData.success && imageData.imageBase64) {
  const imageUrl = `data:image/png;base64,${imageData.imageBase64}`;

  setGeneratedImage(imageUrl);

  await saveProject(
  data.scenes || "",
  imageUrl
);
}

      setPipelineStatus({
        analysis: "done",
        motion: "ready",
        render: "idle",
        save: "idle",
      });
    } catch (e: any) {
      setError(e.message || "Generation failed");
      setPipelineStatus({
        analysis: "error",
        motion: "idle",
        render: "idle",
        save: "idle",
      });
    } finally {
      setIsGenerating(false);
    }
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

              <div className="mt-4">
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => {
      const files = Array.from(e.target.files || []);

      Promise.all(
  files.map(
    (file) =>
      new Promise<string>((resolve) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (event) => {
          img.src = event.target?.result as string;
        };

        img.onload = () => {
          const canvas =
            document.createElement("canvas");

          const maxWidth = 512;

          const scale =
            maxWidth / img.width;

          canvas.width = maxWidth;
          canvas.height =
            img.height * scale;

          const ctx =
            canvas.getContext("2d");

          ctx?.drawImage(
            img,
            0,
            0,
            canvas.width,
            canvas.height
          );

          const compressed =
            canvas.toDataURL(
              "image/jpeg",
              0.7
            );

          resolve(compressed);
        };

        reader.readAsDataURL(file);
      })
  )
).then((base64Images) => {
  setUploadedImages(base64Images);
});
    }}
    className="block w-full text-sm text-zinc-400"
  />
</div>
{uploadedImages.length > 0 && (
  <div className="grid grid-cols-2 gap-4 mt-6">
    {uploadedImages.map((image, index) => (
      <div
        key={index}
        className="rounded-2xl overflow-hidden border border-white/10"
      >
        <img
          src={image}
          alt={`upload-${index}`}
          className="w-full h-40 object-cover"
        />
      </div>
    ))}
  </div>
)}
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
                  Generating scenes...
                </>
              ) : (
                "Generate Video"
              )}
            </button>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">
                {error}
              </div>
            )}

            {sceneOutput && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-6">
                <div className="text-zinc-400 text-sm mb-3">Generated Scene Direction</div>
                <pre className="whitespace-pre-wrap text-sm leading-7 text-zinc-200">{sceneOutput}</pre>
              </div>
            )}

            {generatedImage && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                <img
                  src={generatedImage}
                  alt="Generated Scene"
                  className="w-full rounded-2xl object-cover"
                />
              </div>
            )}
            {generatedImage && !generatedVideo && (
  <button
    onClick={generateMotionVideo}
    className="mt-6 w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 py-4 text-lg font-bold hover:opacity-90 transition"
  >
    Generate Motion Video
  </button>
)}

          </div>

          <div className="space-y-6">

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="text-zinc-400 mb-4">Current Plan</div>
              <div className="text-5xl font-black mb-6">Starter</div>

              <div className="w-full h-4 rounded-full bg-black/40 overflow-hidden mb-4">
                <div className="w-[10%] h-full bg-blue-500"></div>
              </div>

              <div className="text-zinc-400">3 / 30 videos used</div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="text-zinc-400 mb-4">Pipeline Status</div>

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

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-zinc-400 mb-4">My Projects</div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {projects.length === 0 ? (
                  <div className="text-zinc-500 text-sm">
                    No saved projects yet
                  </div>
                ) : (
                  projects.map((project) => (
                    <div
  key={project.id}
  onClick={() => openProject(project)}
  className="rounded-2xl border border-white/10 bg-black/30 p-3 cursor-pointer hover:border-blue-500/50 transition"
>
                      {project.generated_image && (
                        <img
                          src={project.generated_image}
                          alt="project"
                          className="w-full h-32 object-cover rounded-xl mb-3"
                        />
                      )}

                      <div className="text-sm text-zinc-300 line-clamp-2">
                        {project.idea}
                      </div>

                      <div className="text-xs text-zinc-500 mt-2">
                        {project.video_format}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
