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
  const [userId, setUserId] = useState<string>("");
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
      setUserId(data.user.id);
      setLoading(false);
    }

    loadUser();
  }, [router]);

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
    try {
      const renderData = {
        finalVideo: "demo-video.mp4",
      };

      const completedVideo = renderData.finalVideo || "";

      await postJson("/api/save-project", {
        userId,
        title: idea.slice(0, 60),
        idea,
        videoFormat,
        length,
        voice,
        analysis,
        scenes,
        script,
        sceneImage,
        motionVideo,
        audioUrl,
        finalVideo: completedVideo,
        status: "completed",
        pipelineSteps: steps,
      });
    } catch (e) {
      console.error(e);
    }
  }

  return null;
}
