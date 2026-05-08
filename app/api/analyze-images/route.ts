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

Return:
1. Character description
2. Product description
3. Visual style
4. Lighting style
5. Scene mood
6. Clothing details
7. Camera style
8. Suggested cinematic scenes
9. Social media video direction

Make the response optimized for AI cinematic video generation.`,
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
