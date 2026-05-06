import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/render", async (req, res) => {
  try {
    const { script } = req.body;

    if (!script) {
      return res.status(400).json({ error: "script required" });
    }

    return res.json({
      success: true,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    });
  } catch (error) {
    return res.status(500).json({ error: "render failed" });
  }
});

app.listen(port, () => {
  console.log(`VIDDO Render Server running on ${port}`);
});
