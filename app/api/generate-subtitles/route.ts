export const runtime = "nodejs";

type SubtitleRequest = {
  script?: string;
};

function createMockSubtitles(script: string) {
  const cleanScript = script
    .replace(/MOCK MODE - VIDDO AI SCRIPT/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8);

  const lines = cleanScript.length > 0 ? cleanScript : [
    "Create videos faster with VIDDO.",
    "Turn your idea into a script.",
    "Generate voice and subtitles.",
    "Prepare your content for social platforms."
  ];

  return lines.map((text, index) => ({
    id: index + 1,
    start: index * 3,
    end: index * 3 + 3,
    text
  }));
}

export async function POST(req: Request) {
  try {
    const { script } = (await req.json()) as SubtitleRequest;

    if (!script || typeof script !== "string") {
      return Response.json({ error: "Script is required to generate subtitles." }, { status: 400 });
    }

    if (process.env.USE_MOCK_AI === "true") {
      return Response.json({
        mode: "mock",
        subtitles: createMockSubtitles(script)
      });
    }

    return Response.json(
      { error: "Real subtitle generation is not connected yet. Set USE_MOCK_AI=true for testing." },
      { status: 501 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate subtitles.";
    return Response.json({ error: message }, { status: 500 });
  }
}
