import SignUpFooter from '@/components/layouts/MainLayout/SignUpFooter';
import Link from 'next/link';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';

import UserIcon from '../images/UserIcon.svg';
import styles from './index.module.scss';

export default function Congrates() {
  const isMobile = useMediaQuery({
    query: '(min-width: 768px)',
  });
  return (
    <>
      <div className={styles.form}>
        <div className={styles.innerContentCongrate}>
          <div className={styles.calendar}>
            <Image src={UserIcon} width={isMobile ? 100 : 80} alt="calendar" />
          </div>
          <p className={styles.congrateMsg}>
            Congrats you have signed up to be a Plannet Planner!
          </p>
        </div>
        <div className="flex justify-center mt-[30px] mb-[20px]">
          <Link href={`${process.env.NEXT_PUBLIC_APP_STORE}`} target="blank">
            <img
              className="max-w-[190px] w-full h-full pr-2"
              src="/assets/images/landingpage/app_store.png"
              alt="app_store"
            />
          </Link>
        </div>
        <div className={styles.innerContentSubtitleLast}>
          {
            'Download the Plannet app to complete your \nprofile and start earning.'
          }
        </div>
      </div>
      <SignUpFooter />
    </>
  );
}
