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
          error: "No images uploaded"
        },
        {
          status: 400
        }
      );
    }

    const content: any[] = [
      {
        type: "input_text",
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

Make the response optimized for AI cinematic video generation.`
      }
    ];

    images.forEach((image: string) => {
      content.push({
        type: "input_image",
        image_url: image
      });
    });

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content
        }
      ]
    });

    return NextResponse.json({
      success: true,
      analysis: response.output_text
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Image analysis failed"
      },
      {
        status: 500
      }
    );
  }
}
