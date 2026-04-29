import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }

    const { idea, style, length, voice, platform } = await req.json();

    if (!idea || typeof idea !== "string") {
      return Response.json({ error: "Video idea is required" }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are VIDDO, an expert AI video scriptwriter. Create practical, ready-to-record scripts for short-form and long-form social videos."
        },
        {
          role: "user",
          content: `Create a video script with these settings:\n\nIdea: ${idea}\nStyle: ${style}\nLength: ${length}\nVoice: ${voice}\nPlatform: ${platform}\n\nReturn the result in this format:\n1. Hook\n2. Scene-by-scene script\n3. Voiceover script\n4. On-screen caption suggestions\n5. Suggested title\n6. Suggested hashtags\n\nMake it clear, engaging, and ready to produce.`
        }
      ],
      temperature: 0.8,
    });

    const script = completion.choices[0]?.message?.content ?? "No script returned.";

    return Response.json({ script });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to generate script" }, { status: 500 });
  }
}
