import {useEffect, useState, MouseEvent, memo, useRef, useMemo} from 'react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styles from './index.module.scss';
import Image from "next/image";
// IMAGES
import Play from './images/play.svg';
import Stop from './images/stop.svg';

import uniqid from 'uniqid';
import {actions, selectors} from "@/store/onboarding/onboarding.slice";
import {useDispatch, useSelector} from "react-redux";
import classNames from "classnames";

type AudioButtonProps = {
  audioUrl: string;
  playingId: string;
  plannerId: string;
  onAudioChange: Function;
};
const AudioButton = ({
  audioUrl,
  playingId = '',
  plannerId,
  onAudioChange
}: AudioButtonProps) => {
  const [durationWidth, setDurationWidth] = useState<number>(0);
  const [canPlay, setCanPlay] = useState<boolean>(false);
  const uniqueId = useMemo(() => uniqid(), []);
  const audioRef = useRef<any>();
  const videoPlaying = useSelector(selectors.videoPlaying);
  const dispatch = useDispatch();

  useEffect(() => {
    if (uniqueId === playingId) {
      audioRef?.current?.play();
    }
    else {
      audioRef?.current?.pause();
    }

    if (playingId) {
      dispatch(actions.setAudioPlaying(true));
    } else {
      dispatch(actions.setAudioPlaying(false));
    }
  }, [playingId]);

  useEffect(() => {
    if (videoPlaying) {
      audioRef?.current?.pause();
      dispatch(actions.setAudioPlaying(false));
      if (uniqueId === playingId) onAudioChange('');
    }
  }, [videoPlaying]);

  const handlePlay = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (uniqueId === playingId) onAudioChange('');
    else onAudioChange(uniqueId);
  };

  const onPlaying = () => {
    let durationWidthCalc =
      Number(audioRef?.current?.currentTime) /
      Number(audioRef?.current?.duration);
    durationWidthCalc = Number.isNaN(durationWidthCalc)
      ? 0
      : durationWidthCalc * 100;
    setDurationWidth(durationWidthCalc);
  };

  const handleCanPlay = () => {
    setCanPlay(true);
  }

  if (!audioUrl) return null;

  return (
    <div className={classNames(styles.root, {
      [styles.visible]: canPlay
    })}>
      <div
        className={styles.circle}
        onClick={handlePlay}
        role="presentation"
      >
        <CircularProgressbarWithChildren
          value={durationWidth}
          className={styles.audio_progressbar}
        >
          <Image
            className={styles.image_play_stop}
            src={uniqueId === playingId ? Stop : Play}
            alt="play"
          />
        </CircularProgressbarWithChildren>
      </div>
      <audio
        id={uniqueId}
        src={audioUrl}
        onTimeUpdate={onPlaying}
        preload="auto"
        onEnded={() => {
          onAudioChange('');
        }}
        ref={audioRef}
        onLoadedMetadata={handleCanPlay}
      >
        <track kind="captions" />
      </audio>
    </div>
  );
}

export default memo(AudioButton);
