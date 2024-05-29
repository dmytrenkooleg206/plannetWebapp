import React from 'react';
import useChangeBgImage from '@/hooks/useChangeBgImage';
import styles from '@/styles/Registration.module.scss'
import GuestSignIn from '@/components/Pages/Summary/SignIn/GuestSignIn';

export default function guestUserSignIn() {
  const bgChangingContainer = useChangeBgImage();
  return (
    <div ref={bgChangingContainer} className={styles.container_parent}>
      <div className={styles.container_registration}>
        <div className={styles.overlay} />
        <GuestSignIn />
      </div>
    </div>
  );
}
