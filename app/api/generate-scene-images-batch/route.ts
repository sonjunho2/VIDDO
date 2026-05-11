import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    return NextResponse.json({
      success: true,
      imageBase64,
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
