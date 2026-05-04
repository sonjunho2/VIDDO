import { Composition } from 'remotion';
import { ViddoShort } from './ViddoShort';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="ViddoShort"
        component={ViddoShort}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
