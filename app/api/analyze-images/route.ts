import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const images = body.images || [];
    const prompt = body.prompt || "";
    const videoFormat = body.videoFormat || "shorts";

    if (!images.length) {
      return NextResponse.json(
        {
          error: "No images uploaded",
        },
        {
          status: 400,
        }
      );
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze these uploaded reference images for AI video generation.

User Prompt:
${prompt}

Video Format:
${videoFormat}

Return the result in this exact structure:

VISUAL IDENTITY PROFILE
- Main subject:
- Face / body details:
- Clothing / accessories:
- Product / brand details:
- Colors and materials:
- Background environment:
- Lighting identity:
- Mood identity:
- Elements that must stay consistent:
- Elements that can change:

CINEMATIC STYLE PROFILE
- Camera style:
- Lens feeling:
- Movement style:
- Lighting style:
- Color grading:
- Composition rules:

VIDEO DIRECTION
- Recommended hook:
- Recommended scene flow:
- Suggested cinematic scenes:
- Social media direction:

IMPORTANT:
Create a reusable visual identity profile that can be inserted into every AI image and video prompt to keep the same character, product, brand, and mood consistent across all scenes.`,
            },
            ...images.map((image: string) => ({
              type: "image_url",
              image_url: {
                url: image,
              },
            })),
          ],
        },
      ],
    });

    return NextResponse.json({
      success: true,
      analysis:
        response.choices?.[0]?.message?.content || "No analysis",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Image analysis failed",
      },
      {
        status: 500,
      }
    );
  }
}
