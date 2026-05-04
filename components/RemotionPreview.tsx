"use client";

import { Player } from "@remotion/player";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

type Props = {
  script: string;
  platform: string;
  length: string;
};

function PreviewComposition({ script, platform, length }: Props) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 40], [0.94, 1], { extrapolateRight: "clamp" });

  const headline = script.split("\n").find((line) => line.trim().length > 8)?.replace(/^[0-9.\-\s]+/, "") || "VIDDO AI VIDEO";

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #020617, #1d4ed8, #7c3aed)", color: "white", fontFamily: "Arial, sans-serif" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90, textAlign: "center" }}>
        <div style={{ opacity, transform: `scale(${scale})` }}>
          <div style={{ fontSize: 42, fontWeight: 800, marginBottom: 36, color: "#bfdbfe" }}>{platform} · {length}</div>
          <div style={{ fontSize: 82, fontWeight: 900, lineHeight: 1.08, textShadow: "0 8px 40px rgba(0,0,0,.35)" }}>{headline.slice(0, 95)}</div>
          <div style={{ marginTop: 52, fontSize: 42, fontWeight: 700, color: "#dbeafe" }}>Created with VIDDO</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export default function RemotionPreview({ script, platform, length }: Props) {
  if (!script) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 mt-5">
      <div className="mb-4">
        <h3 className="text-xl font-black">Remotion Video Preview</h3>
        <p className="text-sm text-zinc-400 mt-1">Browser preview for the final video template. Server MP4 rendering will be connected next.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
        <Player
          component={PreviewComposition}
          inputProps={{ script, platform, length }}
          durationInFrames={180}
          fps={30}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{ width: "100%" }}
          controls
        />
      </div>
    </div>
  );
}
