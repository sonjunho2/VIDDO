import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ScriptRequest = {
  idea?: string;
  style?: string;
  length?: string;
  voice?: string;
  platform?: string;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

function createMockScript({ idea, style, length, voice, platform }: ScriptRequest) {
  const safeIdea = idea || "your video idea";
  const safeStyle = style || "Marketing";
  const safeLength = length || "30 sec";
  const safeVoice = voice || "Male";
  const safePlatform = platform || "TikTok";

  return `MOCK MODE - VIDDO AI SCRIPT\n\n1. Hook\n"Most people think ${safeIdea} is complicated. But here is the simple way to understand it in ${safeLength}."\n\n2. Scene-by-scene script\nScene 1 - 0:00~0:03\nShow a fast, attention-grabbing visual. Start with a bold question related to: ${safeIdea}\n\nScene 2 - 0:03~0:10\nExplain the main problem clearly. Keep the tone ${safeStyle.toLowerCase()} and direct.\n\nScene 3 - 0:10~0:20\nShow the simple solution. Use quick cuts, captions, and one clear example.\n\nScene 4 - 0:20~0:27\nSummarize the benefit. Make the viewer feel that this is easy and useful.\n\nScene 5 - 0:27~0:30\nEnd with a short call to action: "Follow for more simple AI tips."\n\n3. Voiceover script\n"Want to understand ${safeIdea} fast? Here is the simple version. First, stop making it complicated. Focus on one clear problem, one useful solution, and one strong result. That is how you turn an idea into content people actually watch. Follow for more."\n\n4. On-screen caption suggestions\n- "AI made simple"\n- "One idea. One clear result."\n- "Use this for your next video"\n- "Follow for more AI tips"\n\n5. Suggested title\nHow to Use AI the Simple Way\n\n6. Suggested hashtags\n#AI #ContentCreation #${safePlatform.replace(/\s+/g, "")} #AIVideo #VIDDO\n\nSelected settings\nStyle: ${safeStyle}\nLength: ${safeLength}\nVoice: ${safeVoice}\nPlatform: ${safePlatform}`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ScriptRequest;
    const { idea, style, length, voice, platform } = body;

    if (!idea || typeof idea !== "string") {
      return Response.json({ error: "Video idea is required." }, { status: 400 });
    }

    if (process.env.USE_MOCK_AI === "true") {
      return Response.json({ script: createMockScript({ idea, style, length, voice, platform }) });
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: "OPENAI_API_KEY is not configured in Vercel Environment Variables. Add OPENAI_API_KEY or set USE_MOCK_AI=true for testing." }, { status: 500 });
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
    const message = getErrorMessage(error);
    console.error("VIDDO script generation error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
