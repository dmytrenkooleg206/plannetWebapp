import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '@/store/onboarding/onboarding.slice';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import BackgroundMoblie from '../../../../../../public/assets/images/V2Images/backgroundContacts-mobile.webp';
import Background from '../../../../../../public/assets/images/V2Images/contact-desktop.jpg';
import styles from './index.module.scss';

export default function Introduction() {
  const loaded = useSelector(selectors.loaded);
  const [cssLoaded, setCssLoaded] = useState(loaded);
  const isMobile = useMediaQuery({
    query: '(min-width: 768px)',
  });

  useEffect(() => {
    setCssLoaded(loaded);
  }, [loaded]);

  return (
    <div className={styles.root}>
      <div className={styles.imageWrapper}>
        <Image
          src={!isMobile ? BackgroundMoblie : Background}
          alt="background"
          priority
        />
      </div>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>Contact Us</h1>
          <div className={styles.description}>
            If you have any thoughts, suggestions or feedback about Plannet
            please message us!
          </div>
        </div>
      </div>
    </div>
  );
}
