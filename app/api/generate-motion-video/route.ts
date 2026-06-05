import { NextResponse } from "next/server";

const PLATFORM_MOTION_RULES: Record<string, string> = {
  shorts: "Fast vertical motion, social pacing, mobile safe framing, subtle camera push-in",
  longform: "Cinematic storytelling motion, smooth dolly movement, natural camera movement",
  square: "Centered motion optimized for social feeds, gentle camera orbit, clean composition",
};

function getAspectRatio(videoFormat: string) {
  if (videoFormat === "longform") return "16:9";
  if (videoFormat === "square") return "1:1";
  return "9:16";
}

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getLumaGeneration(id: string) {
  const response = await fetch(
    `https://api.lumalabs.ai/dream-machine/v1/generations/${id}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${process.env.LUMA_API_KEY}`,
      },
      cache: "no-store",
    }
  );

  return response.json();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const image = body.image;
    const prompt = body.prompt || "";
    const videoFormat = body.videoFormat || "shorts";
    const aspectRatio = body.aspectRatio || getAspectRatio(videoFormat);

    if (!image) {
      return NextResponse.json(
        {
          error: "Scene image URL is required",
        },
        {
          status: 400,
        }
      );
    }

    if (typeof image === "string" && image.startsWith("data:image")) {
      return NextResponse.json(
        {
          error: "Luma requires a public image URL. Please generate a new scene image after the Storage update.",
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

    const createResponse = await fetch(
      "https://api.lumalabs.ai/dream-machine/v1/generations",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${process.env.LUMA_API_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          prompt: cinematicMotionPrompt,
          model: "ray-2",
          resolution: "720p",
          duration: "5s",
          aspect_ratio: aspectRatio,
          loop: false,
          keyframes: {
            frame0: {
              type: "image",
              url: image,
            },
          },
        }),
      }
    );

    const created = await createResponse.json();

    if (!createResponse.ok) {
      return NextResponse.json(
        {
          error: created?.detail || created?.error || "Luma generation request failed",
          lumaResponse: created,
        },
        {
          status: createResponse.status,
        }
      );
    }

    const generationId = created.id;

    for (let i = 0; i < 8; i += 1) {
      await wait(3000);

      const generation = await getLumaGeneration(generationId);

      if (generation.state === "completed" && generation.assets?.video) {
        return NextResponse.json({
          success: true,
          status: "completed",
          provider: "Luma Ray 2",
          generationId,
          videoUrl: generation.assets.video,
          cinematicMotionPrompt,
          videoFormat,
          aspectRatio,
        });
      }

      if (generation.state === "failed") {
        return NextResponse.json(
          {
            error: generation.failure_reason || "Luma video generation failed",
            generationId,
            lumaResponse: generation,
          },
          {
            status: 500,
          }
        );
      }
    }

    return NextResponse.json({
      success: true,
      status: "processing",
      provider: "Luma Ray 2",
      generationId,
      videoUrl: null,
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
