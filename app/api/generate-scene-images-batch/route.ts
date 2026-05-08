import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const scenes = body.scenes || "";

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
      prompt: `Create a cinematic vertical AI video scene.

${scenes}

Style:
- realistic
- dramatic lighting
- cinematic
- ultra detailed
- social media optimized
- vertical composition
- viral short-form feeling
`,
      size: "1024x1792",
    });

    const imageBase64 = response.data?.[0]?.b64_json;

    return NextResponse.json({
      success: true,
      imageBase64,
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
