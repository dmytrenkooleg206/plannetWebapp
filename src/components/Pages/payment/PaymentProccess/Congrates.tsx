import { useState } from 'react';
import SignUpFooter from '@/components/layouts/MainLayout/SignUpFooter';
import Link from 'next/link';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';

import styles from './index.module.scss';
import BrachIcon from './images/branch.svg';
import AppStoreIcon from './images/App Store.png';

export default function Congrates() {
  const isMobile = useMediaQuery({
    query: '(min-width: 768px)',
  });

  return (
    <>
      <div className={styles.form}>
        <div className={styles.innerContentCongrate}>
          <p className="text-white text-center text-[36px] max-sm:text-[30px] font-[700] mb-[20px] max-sm:mb-[10px]">
            Congratulations!
          </p>
          <p className="text-white text-center text-[30px] max-sm:text-[24px] font-[400] mb-[10px] max-sm:mb-[5px]">
            You are going to Barcelona at{' '}
          </p>
          <p className="text-white text-center text-[30px] max-sm:text-[20px] font-[500] mb-[20px] max-sm:mb-[10px]">
            New York City, United States
          </p>
          <Image
            className="mx-auto my-[30px] max-sm:my-[20px]"
            src={BrachIcon}
            width={200}
            height={200}
            alt="Branch"
          />
          <div className="flex flex-col items-center mt-[20px] max-sm:mt-[10px]">
            <p className="text-white text-[30px] max-sm:text-[20px] font-[700] mb-[10px] max-sm:mb-[0px]">
              Download the Plannet App
            </p>
            <p className="text-white text-[24px] max-sm:text-[18px] font-[400] mb-[20px] max-sm:mb-[10px]">
              to view your trip bookings
            </p>
            <Link href={`${process.env.NEXT_PUBLIC_APP_STORE}`} target="blank">
              <Image
                src={AppStoreIcon}
                alt="app_store"
                width={isMobile ? 335 : 223}
                height={isMobile ? 108 : 72}
              />
            </Link>
          </div>
        </div>
      </div>
      <SignUpFooter />
    </>
  );
}
