import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const script = body.script;

    if (!script) {
      return NextResponse.json(
        { error: "script required" },
        { status: 400 }
      );
    }

    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt: `Create a cinematic vertical short-form video scene. Style: realistic, high quality, social media content, dramatic lighting. Script: ${script}`,
      size: "1024x1792"
    });

    const imageBase64 = response.data?.[0]?.b64_json;

    return NextResponse.json({
      success: true,
      imageBase64
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "image generation failed"
      },
      {
        status: 500
      }
    );
  }
}
