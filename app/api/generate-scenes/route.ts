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
    const videoFormat = body.videoFormat || "shorts";

    const prompt = `
You are an elite cinematic AI video director creating a high-quality social media video production.

USER IDEA:
${idea}

VISUAL IDENTITY PROFILE:
${analysis}

PLATFORM:
${platform}

VIDEO FORMAT:
${videoFormat}

VIDEO LENGTH:
${length}

IMPORTANT CONSISTENCY RULES:
- Keep the same character identity across all scenes.
- Keep the same face, hairstyle, clothing, accessories, and body proportions.
- Keep the same product design and branding.
- Maintain cinematic continuity between scenes.
- Maintain the same lighting style and mood identity.
- Preserve visual storytelling continuity.
- Optimize composition for the target platform aspect ratio.

Generate this structure:

1. Hook Scene
2. Transition Scene
3. Main Cinematic Scene
4. Emotional Scene
5. Ending CTA Scene

For EVERY scene include:
- Scene purpose
- Camera angle
- Camera movement
- Subject movement
- Lighting
- Background environment
- Mood
- Cinematic direction
- Transition style
- Subtitle placement recommendation
- AI image generation prompt
- AI motion video prompt

CINEMATIC REQUIREMENTS:
- Viral short-form pacing
- Strong hook in first 3 seconds
- Cinematic realism
- Professional advertising quality
- Social media optimized framing
- Consistent visual identity across all scenes
- Mobile-safe subtitle spacing
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      scenes: response.choices?.[0]?.message?.content || "No scenes generated",
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
