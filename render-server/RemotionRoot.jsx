import React from "react";
import { Composition } from "remotion";
import { VideoComposition } from "./VideoComposition.jsx";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="VideoComposition"
        component={VideoComposition}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          text: "VIDDO AI VIDEO"
        }}
      />
    </>
  );
};
