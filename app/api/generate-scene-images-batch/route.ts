import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

type VideoFormat = "shorts" | "longform" | "square";

const FORMAT_SETTINGS: Record<VideoFormat, { label: string; aspectRatio: string; imageSize: string; direction: string }> = {
  shorts: {
    label: "Shorts / Reels / TikTok",
    aspectRatio: "9:16",
    imageSize: "1024x1536",
    direction: "vertical 9:16 composition for TikTok, YouTube Shorts, and Instagram Reels",
  },
  longform: {
    label: "YouTube Longform",
    aspectRatio: "16:9",
    imageSize: "1536x1024",
    direction: "horizontal 16:9 cinematic composition for YouTube long-form videos",
  },
  square: {
    label: "Square Feed",
    aspectRatio: "1:1",
    imageSize: "1024x1024",
    direction: "square 1:1 composition for social feed posts",
  },
};

function getFormatSettings(value: string) {
  if (value === "longform") return FORMAT_SETTINGS.longform;
  if (value === "square") return FORMAT_SETTINGS.square;
  return FORMAT_SETTINGS.shorts;
}

function base64ToBuffer(base64: string) {
  return Buffer.from(base64, "base64");
}

async function uploadImageToStorage(imageBase64: string) {
  const fileName = `scene-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.png`;

  const filePath = `scene-images/${fileName}`;
  const imageBuffer = base64ToBuffer(imageBase64);

  const { error } = await supabaseAdmin.storage
    .from("generated-assets")
    .upload(filePath, imageBuffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabaseAdmin.storage
    .from("generated-assets")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const scenes = body.scenes || "";
    const videoFormat = body.videoFormat || "shorts";
    const settings = getFormatSettings(videoFormat);

    if (!scenes) {
      return NextResponse.json(
        {
          error: "Scenes are required",
        },
        {
          status: 400,
        }
      );
    }

    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt: `Create a cinematic AI video scene.

Video Format:
- ${settings.label}
- Aspect Ratio: ${settings.aspectRatio}
- Required Composition: ${settings.direction}

Scene Direction:
${scenes}

Style:
- realistic
- dramatic lighting
- cinematic
- ultra detailed
- social media optimized
- clean composition for captions
- professional advertising quality
`,
      size: settings.imageSize as any,
    });

    const imageBase64 = response.data?.[0]?.b64_json;

    if (!imageBase64) {
      return NextResponse.json(
        {
          error: "No image generated",
        },
        {
          status: 500,
        }
      );
    }

    const imageUrl = await uploadImageToStorage(imageBase64);

    return NextResponse.json({
      success: true,
      imageBase64,
      imageUrl,
      videoFormat,
      aspectRatio: settings.aspectRatio,
      imageSize: settings.imageSize,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Scene image generation failed",
      },
      {
        status: 500,
      }
    );
  }
}
