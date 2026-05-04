export const runtime = "nodejs";

type RenderRequest = {
  script?: string;
  audioUrl?: string;
  subtitles?: unknown[];
  platform?: string;
  length?: string;
};

export async function POST(req: Request) {
  try {
    const { script, audioUrl, subtitles, platform, length } = (await req.json()) as RenderRequest;

    if (!script || typeof script !== "string") {
      return Response.json({ error: "Script is required to render video." }, { status: 400 });
    }

    if (process.env.USE_MOCK_AI === "true") {
      return Response.json({
        mode: "mock",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        downloadUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        platform: platform || "TikTok",
        length: length || "30 sec",
        hasAudio: Boolean(audioUrl),
        subtitleCount: Array.isArray(subtitles) ? subtitles.length : 0,
        message: "Mock video rendered successfully. Real rendering will be connected later."
      });
    }

    return Response.json(
      { error: "Real video rendering is not connected yet. Set USE_MOCK_AI=true for testing." },
      { status: 501 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to render video.";
    return Response.json({ error: message }, { status: 500 });
  }
}
