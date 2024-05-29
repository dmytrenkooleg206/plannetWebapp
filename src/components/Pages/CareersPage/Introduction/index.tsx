import React, { useEffect, useState, useMemo } from 'react';
import Image, { StaticImageData } from 'next/image';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useWindowSize } from '@/hooks/useWindowSize';
import { selectors } from '@/store/onboarding/onboarding.slice';
import styles from './index.module.scss';

type DATA = {
  title: string;
  description: string;
  background: string | StaticImageData;
  backgroundMobile: string | StaticImageData;
  theme?: string;
};

const MOBILE_SCREEN = 768;

export default function Introduction({
  title,
  description,
  background,
  backgroundMobile,
  theme,
}: DATA) {
  const loaded = useSelector(selectors.loaded);
  const [cssLoaded, setCssLoaded] = useState(loaded);
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width && width <= MOBILE_SCREEN, [width]);

  useEffect(() => {
    setCssLoaded(loaded);
  }, [loaded]);
  return (
    <div
      className={classNames(styles.root, {
        [styles[`${theme}`]]: theme,
      })}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={isMobile ? backgroundMobile : background}
          alt="background"
          priority
        />
      </div>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.description}>{description}</div>
        </div>
      </div>
    </div>
  );
}
