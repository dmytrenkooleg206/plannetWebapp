import SignUpFooter from '@/components/layouts/MainLayout/SignUpFooter';
import Link from 'next/link';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';

import CalendarBtn from '../images/calendarBtn.svg';
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
            <Image
              src={CalendarBtn}
              width={isMobile ? 100 : 80}
              alt="calendar"
            />
          </div>
          <p className={styles.congrateMsg}>
            Congrats you have <br /> signed up for Plannet <br /> Monthly Texts!
          </p>
          <p className={styles.subMSg}>
            We will send you a text from this number <b>+1(917)932-2005.</b>{' '}
            Please text us back at this number if you would like to book or
            further customize a plan
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
          Download the Plannet app to change your settings from the account tab.
        </div>
      </div>
      <SignUpFooter />
    </>
  );
}
