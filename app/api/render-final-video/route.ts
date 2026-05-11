import { NextResponse } from "next/server";

const PLATFORM_RENDER_SETTINGS: Record<string, Record<string, string>> = {
  shorts: {
    aspectRatio: "9:16",
    exportType: "short-form",
    subtitlePosition: "bottom-safe",
  },

  longform: {
    aspectRatio: "16:9",
    exportType: "longform",
    subtitlePosition: "cinematic-bottom",
  },

  square: {
    aspectRatio: "1:1",
    exportType: "square-feed",
    subtitlePosition: "square-bottom",
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const motionVideo = body.motionVideo;
    const audioUrl = body.audioUrl;
    const subtitles = body.subtitles || "";
    const sceneImage = body.sceneImage || "";
    const videoFormat = body.videoFormat || "shorts";

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

    const settings =
      PLATFORM_RENDER_SETTINGS[videoFormat] ||
      PLATFORM_RENDER_SETTINGS.shorts;

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
          videoFormat,
          renderSettings: settings,
        }),
      }
    );

    const renderData = await renderResponse.json();

    return NextResponse.json({
      success: true,
      status: "rendered",
      provider: "VIDDO Render Engine v2",
      finalVideo: renderData.videoUrl,

      renderInfo: {
        subtitlesIncluded: !!subtitles,
        voiceIncluded: !!audioUrl,
        aspectRatio: settings.aspectRatio,
        exportType: settings.exportType,
        subtitlePosition: settings.subtitlePosition,
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
