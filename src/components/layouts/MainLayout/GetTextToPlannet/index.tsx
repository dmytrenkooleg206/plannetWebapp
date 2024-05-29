import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// STYLES
import styles from './index.module.scss';
// IMAGES
import CTA from './images/cta.png';
import Close from './images/close.svg';

type DATA = {
  onClose: any;
  title?: string;
};

const GetTextToPlannet = ({ onClose, title }: DATA) => {
  return (
    <div className={styles.root}>
      <div className={styles.close} onClick={onClose}>
        <Image src={Close} alt={'close'} priority={true} />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>+1(917)932-2005</div>
        <div className={styles.plannetWhiteBtn}>
          <a href="sms:+1(917)932-2005;?&body=Hey Plannet Team, I am interested in having you plan my next trip! I am interested in having flights, hotels and restaurant reservations booked for me to: (add City Name)">
            <div className={styles.getStarted}>Text To Plannet</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default GetTextToPlannet;
