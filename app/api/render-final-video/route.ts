import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const motionVideo = body.motionVideo;
    const audioUrl = body.audioUrl;
    const subtitles = body.subtitles || "";
    const sceneImage = body.sceneImage || "";

    if (!motionVideo) {
      return NextResponse.json(
        {
          error: "Motion video is required",
        },
        {
          status: 400,
        }
      );
    }

    const renderResponse = await fetch(
      "https://viddo-render.onrender.com/render-video",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: sceneImage,
          audio: audioUrl,
          subtitles,
        }),
      }
    );

    const renderData = await renderResponse.json();

    return NextResponse.json({
      success: true,
      status: "rendered",
      provider: "VIDDO Render Engine",
      finalVideo: renderData.videoUrl,
      renderInfo: {
        subtitlesIncluded: !!subtitles,
        voiceIncluded: !!audioUrl,
        aspectRatio: "9:16",
        exportType: "short-form",
        renderServer: "https://viddo-render.onrender.com",
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Final video rendering failed",
      },
      {
        status: 500,
      }
    );
  }
}
