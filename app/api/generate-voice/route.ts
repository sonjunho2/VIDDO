export const runtime = "nodejs";

type VoiceRequest = {
  script?: string;
  voice?: string;
};

export async function POST(req: Request) {
  try {
    const { script, voice } = (await req.json()) as VoiceRequest;

    if (!script || typeof script !== "string") {
      return Response.json({ error: "Script is required to generate voice." }, { status: 400 });
    }

    if (process.env.USE_MOCK_AI === "true") {
      return Response.json({
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        mode: "mock",
        voice: voice || "Male",
        message: "Mock voice generated successfully. Real TTS will be connected later."
      });
    }

    return Response.json(
      { error: "Real TTS is not connected yet. Set USE_MOCK_AI=true for testing." },
      { status: 501 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate voice.";
    return Response.json({ error: message }, { status: 500 });
  }
}
