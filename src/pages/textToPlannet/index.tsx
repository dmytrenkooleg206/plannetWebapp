import React, { useEffect, useRef, useState } from 'react';
// STYLES
import styles from './index.module.scss';
import Image from 'next/image';
import Close from '../../../public/assets/images/dashboard/closeBlack.svg';
import { useRouter } from 'next/router';
import PNModal from '@/components/Modals/PNModal';

const index = () => {
  const router = useRouter();
  const [link, setLink] = useState<HTMLElement | null>(null);

  const handleClose = () => {};

  const onClose = () => {
    router.push('/');
  };

  useEffect(() => {
    if (link !== null) {
      link.click();
    }
    //   window.location.href =
    //     'sms:+1(917)932-2005;?&body=Hey Plannet Team, I am interested in having you plan my next trip! I am interested in having flights, hotels and restaurant reservations booked for me to: (add City Name)';
    // setLink(document.getElementById('smsLink'));
    // eslint-disable-next-line
  }, [link]);

  console.log('link', link);
  return (
    <PNModal
      isOpen={true}
      onClose={handleClose}
      isDark={false}
      noPadding={true}
      maxWidth={'max-w-[500px]'}
      fitContent={true}
    >
      <div className={styles.root}>
        <div className={styles.close} onClick={onClose}>
          <Image src={Close} alt={'close'} priority={true} />
        </div>
        <div className={styles.content}>
          <div className={styles.title}>Text To Plannet</div>
          <div className={styles.subtitle}>+1(917)932-2005</div>
          <div className={styles.plannetWhiteBtn}>
            <a
              id="smsLink"
              ref={(e: HTMLElement | null) => setLink(e)}
              href="sms:+1(917)932-2005;?&body=Hey Plannet Team, I am interested in having you plan my next trip! I am interested in having flights, hotels and restaurant reservations booked for me to: (add City Name)"
            >
              <div className={styles.getStarted}>Text To Plannet</div>
            </a>
          </div>
        </div>
      </div>
    </PNModal>
  );
};

export default index;
