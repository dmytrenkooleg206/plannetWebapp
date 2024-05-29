import { useRef, useEffect, useState, MouseEvent } from 'react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styles from './PlannerItem.module.scss';

type AudioButtonProps = {
  audioUrl: string;
  playingId: string;
  plannerId: string;
  onAudioChange: Function;
};
export default function AudioButton({
  audioUrl,
  playingId = '',
  plannerId,
  onAudioChange,
}: AudioButtonProps) {
  const [durationWidth, setDurationWidth] = useState<number>(0);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (plannerId === playingId) playerRef?.current?.play();
    else playerRef?.current?.pause();
  }, [playingId]);

  const handlePlay = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (plannerId === playingId) onAudioChange('');
    else onAudioChange(plannerId);
  };

  const onPlaying = () => {
    let durationWidthCalc =
      Number(playerRef?.current?.currentTime) /
      Number(playerRef?.current?.duration);
    durationWidthCalc = Number.isNaN(durationWidthCalc)
      ? 0
      : durationWidthCalc * 100;
    setDurationWidth(durationWidthCalc);
  };

  if (!audioUrl) return null;

  return (
    <div className="relative max-w-[50px] w-full mb-auto">
      <img
        className="w-full"
        src="/assets/images/planneritem/play_back.png"
        alt="check"
      />
      <div
        className={styles.white_circle}
        onClick={handlePlay}
        role="presentation"
      >
        <CircularProgressbarWithChildren
          value={durationWidth}
          className={styles.audio_progressbar}
        >
          <img
            className={styles.image_play_stop}
            src={`/assets/images/planneritem/${
              plannerId === playingId ? 'stop' : 'play'
            }.svg`}
            alt="play"
          />
        </CircularProgressbarWithChildren>
      </div>
      <audio
        id="track"
        src={audioUrl}
        onTimeUpdate={onPlaying}
        preload="none"
        onEnded={() => {
          onAudioChange('');
        }}
        ref={playerRef}
      >
        <track kind="captions" />
      </audio>
    </div>
  );
}
