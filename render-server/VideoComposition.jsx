import React from "react";
import { AbsoluteFill } from "remotion";

export const VideoComposition = ({ text }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: 60,
          textAlign: "center",
          padding: 60
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
