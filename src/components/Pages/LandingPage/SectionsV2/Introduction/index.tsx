import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
// IMAGES
import { useWindowSize } from '@/hooks/useWindowSize';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '@/store/onboarding/onboarding.slice';
import Loader from '@/components/Loader/Loader';
import ReactPlayer from 'react-player';
import FallbackMobile from '../../../../../../public/assets/images/V2Images/fallbackMobile.webp';
import Fallback from '../../../../../../public/assets/images/V2Images/fallback.webp';
import VolumeOff from './images/volume off.svg';
import VolumeOn from './images/volume on.svg';
import styles from './index.module.scss';

const MOBILE_SCREEN = 1024;
const VIDEO_DESKTOP =
  'https://d3ojbcv1c0rzy9.cloudfront.net/34460a53-a9e9-45ea-9161-8a20b70785a3';

const VIDEO_MOBILE =
  'https://d3ojbcv1c0rzy9.cloudfront.net/af78c44c-405f-4c0b-87f3-2f1db5fd501a';

type DATA = {
  handleGetStartedOpen: any;
  isSuccess: boolean;
};

type PLAYER = {
  playedSeconds: number;
  loadedSeconds: number;
};

export default function Introduction({
  handleGetStartedOpen,
  isSuccess,
}: DATA) {
  const { width } = useWindowSize();
  const playerRef = useRef<any>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [animation, setAnimation] = useState(false);
  const loaded = useSelector(selectors.loaded);
  const audioPlaying = useSelector(selectors.audioPlaying);
  const [cssLoaded, setCssLoaded] = useState(loaded);
  const dispatch = useDispatch();
  const isMobile = useMemo(() => width && width <= MOBILE_SCREEN, [width]);

  const [videoSettings, setVideoSettings] = useState({
    src: '',
    muted: true,
  });
  const [isFallbackImage, setIsFallbackImage] = useState(false);

  useEffect(() => {
    setCssLoaded(loaded);
  }, [loaded]);

  useEffect(() => {
    if (audioPlaying) {
      setVideoSettings({ ...videoSettings, muted: true });
      dispatch(actions.setVideoPlaying(false));
    }
  }, [audioPlaying]);

  useEffect(() => {
    if (width) {
      setVideoSettings({
        ...videoSettings,
        src: isMobile ? VIDEO_MOBILE : VIDEO_DESKTOP,
      });
    }
  }, [width]);

  useEffect(() => {
    if (playerRef.current && videoSettings.src && cssLoaded && canPlay) {
      if (!isPlaying) {
        setIsPlaying(true);
      }
    }
  }, [playerRef, videoSettings, cssLoaded, canPlay]);

  const handleMuteSwitcher = () => {
    setVideoSettings({ ...videoSettings, muted: !videoSettings.muted });
    dispatch(actions.setVideoPlaying(videoSettings.muted));
  };

  const handleReady = () => {
    setCanPlay(true);
  };

  const handleError = () => {
    setIsFallbackImage(true);
    setAnimation(true);
  };

  const handleProgress = ({ loadedSeconds, playedSeconds }: PLAYER) => {
    if (loadedSeconds > 10 && !canPlay) {
      setCanPlay(true);
    }
    if (playedSeconds > 5) {
      setAnimation(true);
    }
  };

  return (
    <div className={styles.root}>
      {(!isSuccess || !isPlaying || !canPlay) && (
        <div
          className={classNames(styles.blur, {
            [styles.disappear]:
              ((isFallbackImage && cssLoaded) || isPlaying) && isSuccess,
          })}
        >
          <Loader color="white" size={40} />
        </div>
      )}
      <div className={styles.videoWrapper}>
        {isFallbackImage ? (
          <Image src={isMobile ? FallbackMobile : Fallback} alt="background" />
        ) : (
          width && (
            <ReactPlayer
              url={videoSettings.src}
              width="100%"
              height="100%"
              className={styles.player}
              controls={false}
              playing={isPlaying}
              loop
              muted={videoSettings.muted}
              onProgress={handleProgress}
              volume={1}
              playsinline
              onReady={handleReady}
              ref={playerRef}
              onError={handleError}
            />
          )
        )}
      </div>
      <div className={styles.content}>
        <div
          className={classNames(styles.textContainer, {
            [styles.animated]: animation,
          })}
        >
          <h1 className={styles.title}>{'We plan,\nyou travel.'}</h1>
          <div className={styles.description}>
            Plannet is your personal travel concierge. We curate, text and book
            the best itinerary for your next trip.
          </div>
          <div
            className={styles.getStarted}
            onClick={handleGetStartedOpen(true)}
          >
            Get Started
          </div>
        </div>
        <div className={styles.muteSwitcher} onClick={handleMuteSwitcher}>
          <Image
            src={videoSettings.muted ? VolumeOn : VolumeOff}
            alt="volume"
          />
        </div>
      </div>
    </div>
  );
}
