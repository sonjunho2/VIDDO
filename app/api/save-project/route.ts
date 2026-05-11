import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Supabase server credentials are missing" },
        { status: 500 }
      );
    }

    const body = await req.json();

    const {
      userId,
      title,
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
      finalVideo,
      status,
      pipelineSteps,
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("viddo_projects")
      .insert({
        user_id: userId,
        title: title || idea?.slice(0, 80) || "Untitled VIDDO Project",
        idea,
        video_format: videoFormat,
        video_length: length,
        voice_style: voice,
        analysis,
        scenes,
        script,
        scene_image: sceneImage,
        motion_video: motionVideo,
        audio_url: audioUrl,
        final_video: finalVideo,
        status: status || "draft",
        pipeline_steps: pipelineSteps || [],
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Project save failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, project: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Project save failed" }, { status: 500 });
  }
}
