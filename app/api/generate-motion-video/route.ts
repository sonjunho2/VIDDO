import { NextResponse } from "next/server";

const PLATFORM_MOTION_RULES: Record<string, string> = {
  shorts: "Fast vertical motion, social pacing, mobile safe framing",
  longform: "Cinematic storytelling motion, smooth dolly movement",
  square: "Centered motion optimized for social feeds",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const image = body.image;
    const prompt = body.prompt || "";
    const videoFormat = body.videoFormat || "shorts";
    const aspectRatio = body.aspectRatio || "9:16";

    if (!image) {
      return NextResponse.json(
        {
          error: "Scene image is required",
        },
        {
          status: 400,
        }
      );
    }

    const cinematicMotionPrompt = `
Create cinematic AI motion video.

Video format: ${videoFormat}
Aspect ratio: ${aspectRatio}

Scene direction:
${prompt}

Motion rules:
${PLATFORM_MOTION_RULES[videoFormat] || PLATFORM_MOTION_RULES.shorts}

Requirements:
- Keep character consistency
- Keep product consistency
- Use cinematic camera movement
- Maintain subtitle safe area
- Optimize for social media
- Use dolly and tracking movement
`;

    return NextResponse.json({
      success: true,
      status: "queued",
      provider: "VIDDO Motion Engine v2",
      previewVideo:
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      cinematicMotionPrompt,
      videoFormat,
      aspectRatio,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Motion video generation failed",
      },
      {
        status: 500,
      }
    );
  }
}
