import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const idea = body.idea || "";
    const analysis = body.analysis || "";
    const platform = body.platform || "TikTok";
    const length = body.length || "30 sec";

    const prompt = `
You are an elite AI cinematic director.

Create short-form AI video scenes based on:

User Idea:
${idea}

Image Analysis:
${analysis}

Platform:
${platform}

Video Length:
${length}

Generate:
1. Hook Scene
2. Transition Scene
3. Main Cinematic Scene
4. Emotional Scene
5. Ending CTA Scene

For each scene include:
- Camera angle
- Subject movement
- Lighting
- Background
- Mood
- Cinematic direction
- AI image/video prompt

Optimize for viral short-form content.
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    return NextResponse.json({
      success: true,
      scenes: response.output_text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Scene generation failed",
      },
      {
        status: 500,
      }
    );
  }
}
