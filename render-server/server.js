import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/renders", express.static(path.join(process.cwd(), "renders")));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/render", async (req, res) => {
  try {
    const { script } = req.body;

    if (!script) {
      return res.status(400).json({ error: "script required" });
    }

    const rendersDir = path.join(process.cwd(), "renders");

    if (!fs.existsSync(rendersDir)) {
      fs.mkdirSync(rendersDir, { recursive: true });
    }

    const bundled = await bundle({
      entryPoint: path.join(process.cwd(), "remotion-entry.jsx")
    });

    const composition = await selectComposition({
      serveUrl: bundled,
      id: "VideoComposition",
      inputProps: {
        text: script
      }
    });

    const fileName = `video-${Date.now()}.mp4`;
    const outputLocation = path.join(rendersDir, fileName);

    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: "h264",
      outputLocation,
      timeoutInMilliseconds: 120000,
      inputProps: {
        text: script
      }
    });

    return res.json({
      success: true,
      videoUrl: `/renders/${fileName}`,
      downloadUrl: `/renders/${fileName}`
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "render failed",
      details: error?.message || "unknown error"
    });
  }
});

app.listen(port, () => {
  console.log(`VIDDO Render Server running on ${port}`);
});
