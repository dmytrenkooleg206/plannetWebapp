/* eslint-disable consistent-return */
import React, { useEffect, useMemo } from 'react';
// COMPONENTS
import { useDispatch } from 'react-redux';
import { actions } from '@/store/onboarding/onboarding.slice';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
// STYLES
import styles from './index.module.scss';
// CONSTANTS

type DATA = {
  children: any;
};

function MainLayout({ children }: DATA) {
  const router = useRouter();
  const headerDark = useMemo(
    () => router.pathname === '/plannetlinks',
    [router.pathname],
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (window.performance.timing.loadEventEnd) {
      dispatch(actions.setLoaded(true));
      return;
    }
    const listener = () => {
      dispatch(actions.setLoaded(true));
    };

    window.addEventListener('load', listener);

    return () => {
      window.removeEventListener('load', listener);
    };
  }, []);

  return (
    <div>
      <Header headerDark={headerDark} />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
