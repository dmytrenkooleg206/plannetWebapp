import { useWindowSize } from '@/hooks/useWindowSize';
import { selectors } from '@/store/onboarding/onboarding.slice';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import Loader from '@/components/Loader/Loader';
// import Fallback from '../../../../../public/assets/images/V2Images/landingImg.svg';
// import FallbackMobile from '../../../../../public/assets/images/V2Images/landingImgMobile.svg';

import Image from 'next/image';
import styles from './index.module.scss';

const MOBILE_SCREEN = 700;
const TABLET_SCREEN = 1024;

type DATA = {
  handleGetStartedOpen: any;
  isSuccess: boolean;
  deskTopImage: any;
  tabletImage?: any;
  mobileImage: any;
  title: string;
  description: string;
};

export default function IntroductionWithImage({
  handleGetStartedOpen,
  isSuccess,
  mobileImage,
  tabletImage,
  deskTopImage,
  title,
  description,
}: DATA) {
  const { width } = useWindowSize();
  const [animation, setAnimation] = useState(false);
  const loaded = useSelector(selectors.loaded);
  const [cssLoaded, setCssLoaded] = useState(loaded);
  const [loader, setLoader] = useState<boolean>(false);
  const dispatch = useDispatch();
  const isMobile = useMemo(() => width && width <= MOBILE_SCREEN, [width]);
  const isTablet = useMemo(() => width && width <= TABLET_SCREEN, [width]);

  useEffect(() => {
    setCssLoaded(loaded);
  }, [loaded]);

  useEffect(() => {
    if (cssLoaded) {
      setLoader(true);
      setTimeout(() => {
        setAnimation(true);
      }, 1000);
    }
  }, [cssLoaded]);

  return (
    <div className={styles.root}>
      <div
        className={classNames(styles.blur, {
          [styles.disappear]: cssLoaded && isSuccess,
        })}
      >
        <Loader color="white" size={40} />
      </div>
      <div className={styles.videoWrapper}>
        <Image src={isMobile ? mobileImage : deskTopImage} alt="background" />
      </div>
      <div className={styles.content}>
        <div
          className={classNames(styles.textContainer, {
            [styles.animated]: animation,
          })}
        >
          <h1 className={styles.title}>{title}</h1>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
          <div
            className={styles.getStarted}
            onClick={handleGetStartedOpen(true)}
          >
            Get Started
          </div>
        </div>
      </div>
    </div>
  );
}
