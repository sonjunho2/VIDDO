import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const ViddoShort: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ color: 'white', fontSize: 60, opacity }}>
        VIDDO AI VIDEO
      </div>
    </AbsoluteFill>
  );
};
