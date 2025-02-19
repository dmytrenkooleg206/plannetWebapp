/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';
// STYLES
// IMAGES
import GetStarted from '@/components/layouts/MainLayout/GetStarted';
import PNModal from '@/components/Modals/PNModal';
import { useRouter } from 'next/router';
import Close from './images/close.svg';
import styles from './index.module.scss';
import GetTextToPlannet from '../GetTextToPlannet';

const LINKS = [
  {
    href: '/plannetMonthlyTexts',
    title: 'Monthly Texts',
  },
  {
    href: '/planner',
    title: 'Become a Planner',
  },
  {
    href: '/plannetBusiness',
    title: 'Plannet For Business',
  },
];

const LINKS_MOBILE = [
  {
    href: '/plannetMonthlyTexts',
    title: 'Monthly Texts',
  },
  {
    href: '/planner',
    title: 'Become a Planner',
  },
  {
    href: '/plannetBusiness',
    title: 'Plannet For Business',
  },
  {
    href: '/careers',
    title: 'Careers',
  },
  {
    href: '/contact',
    title: 'Contact',
  },
];

type DATA = {
  headerDark?: boolean;
};

const LOGO = (
  <svg
    width="175"
    height="50"
    viewBox="0 0 175 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M92.4877 37.5V22.4376C92.4877 20.5251 92.138 18.9626 91.4254 17.7501C90.7128 16.5376 89.7627 15.6376 88.5629 15.0501C87.3628 14.4626 85.9878 14.1626 84.4377 14.1626C83.0253 14.1626 81.7379 14.4501 80.5877 15.0251C79.4378 15.6001 78.5254 16.3626 77.8502 17.3126L77.8377 17.3251C77.2754 18.1376 76.9877 19.1126 76.9877 20.0876V34.4876C76.9877 36.1503 75.6504 37.4875 73.9878 37.4875H71.8628V9.87509H76.9877V12.7501C77.7003 12.0751 78.5129 11.5001 79.4128 11.0001C81.2002 10.0251 83.2002 9.5376 85.4252 9.5376C87.7503 9.5376 89.8254 10.0376 91.6629 11.0251C93.5005 12.0126 94.9503 13.4751 96.0129 15.3876C97.0752 17.3001 97.6005 19.6501 97.6005 22.4376V34.5001C97.6005 36.1627 96.2629 37.5 94.6002 37.5H92.4877Z"
      fill="white"
    />
    <path
      d="M122.113 37.5V22.4376C122.113 20.5251 121.763 18.9626 121.05 17.7501C120.338 16.5376 119.388 15.6376 118.188 15.0501C116.988 14.4626 115.613 14.1626 114.063 14.1626C112.65 14.1626 111.363 14.4501 110.213 15.0251C109.063 15.6001 108.15 16.3626 107.476 17.3126L107.463 17.3251C106.9 18.1376 106.613 19.1126 106.613 20.0876V34.5001C106.613 36.1627 105.275 37.5 103.613 37.5H101.488V9.87509H106.613V12.7501C107.325 12.0751 108.138 11.5001 109.038 11.0001C110.826 10.0251 112.825 9.5376 115.051 9.5376C117.375 9.5376 119.45 10.0376 121.288 11.0251C123.126 12.0126 124.576 13.4751 125.638 15.3876C126.701 17.3001 127.225 19.6501 127.225 22.4376V34.5001C127.225 36.1627 125.888 37.5 124.226 37.5H122.113Z"
      fill="white"
    />
    <path d="M36.4882 0H31.4883V37.5002H36.4882V0Z" fill="white" />
    <path
      d="M174.988 9.5V14.625H169.238V34.5C169.238 36.1627 167.9 37.5002 166.238 37.5002H164.238V14.625H158.613V9.5H164.238V0.75H169.238V9.5H174.988Z"
      fill="white"
    />
    <path
      d="M25.8499 16.275C24.6249 14.15 22.9749 12.4625 20.8999 11.225C18.8126 10 16.4501 9.375 13.8124 9.375C11.1999 9.375 8.8499 9.98752 6.77512 11.225C6.18754 11.575 5.63737 11.9625 5.12491 12.375V9.5H0V50H2.12496C3.78734 50 5.12491 48.6627 5.12491 47V32.8999C6.30007 34.3251 7.71245 35.4376 9.37483 36.2752C11.0375 37.1 12.8501 37.5127 14.8249 37.5127C17.2749 37.5127 19.4625 36.9002 21.4126 35.6627C23.3499 34.4251 24.8876 32.7625 26.0126 30.6375C27.1376 28.525 27.6999 26.1375 27.6999 23.4625C27.675 20.8 27.0625 18.4 25.8499 16.275ZM21.575 28.3001C20.7876 29.7251 19.7125 30.8626 18.375 31.6752C17.0249 32.5 15.5 32.9124 13.7875 32.9124C12.1126 32.9124 10.5874 32.5 9.2249 31.6752C7.86239 30.8501 6.80006 29.7251 6.02483 28.3001C5.57502 27.4625 5.24991 26.5751 5.06256 25.625C4.9625 25.0875 4.88738 24.5375 4.87491 23.9625C4.87491 23.9125 4.87491 23.85 4.87491 23.8C4.87491 23.7 4.87491 23.6 4.87491 23.4875C4.87491 22.725 4.93756 22 5.07503 21.3125C5.07503 21.3 5.07503 21.275 5.0875 21.2625C5.27485 20.3125 5.58749 19.4375 6.0376 18.6125C6.81253 17.1875 7.87486 16.0625 9.23736 15.2375C10.5999 14.4125 12.1251 14 13.7999 14C15.5125 14 17.0499 14.4125 18.3874 15.2375C19.7375 16.0625 20.8001 17.1875 21.5875 18.6125C22.3749 20.0375 22.7751 21.6625 22.7751 23.475C22.7624 25.2625 22.3749 26.8625 21.575 28.3001Z"
      fill="white"
    />
    <path
      d="M68.1127 37.5V23.5624H68.1003C68.1003 20.9123 67.4878 18.5248 66.2755 16.3998C65.0629 14.2873 63.4127 12.6123 61.3504 11.3873C59.2878 10.1623 56.9502 9.5498 54.3502 9.5498C51.7502 9.5498 49.413 10.1623 47.3254 11.3873C45.2379 12.6123 43.5879 14.2873 42.3754 16.3998C41.1628 18.5123 40.5503 20.8998 40.5503 23.5624C40.5503 26.2124 41.1129 28.5998 42.2254 30.7C43.3377 32.8 44.8629 34.4624 46.8002 35.6874C48.7378 36.9124 50.9129 37.525 53.3502 37.525C55.7878 37.525 57.9627 36.9124 59.9003 35.6874C61.0879 34.9374 62.1129 34.0247 62.9878 32.9499V37.5125H68.1127V37.5ZM61.9629 28.3999C61.1877 29.825 60.1254 30.95 58.7878 31.7748C57.4378 32.5999 55.9128 33.0123 54.2003 33.0123C52.513 33.0123 51.0002 32.5999 49.6377 31.7748C48.2752 30.95 47.2004 29.825 46.4127 28.3999C45.6253 26.9748 45.2254 25.3623 45.2254 23.5873C45.2254 21.7749 45.6253 20.1499 46.4127 18.7248C47.2004 17.2998 48.2752 16.1748 49.6377 15.3498C51.0002 14.5248 52.513 14.1123 54.2003 14.1123C55.9128 14.1123 57.4502 14.5248 58.7878 15.3498C60.1378 16.1748 61.1877 17.2998 61.9629 18.7248C62.7378 20.1499 63.1253 21.7749 63.1253 23.5873C63.1253 25.3623 62.7378 26.9623 61.9629 28.3999Z"
      fill="white"
    />
    <path
      d="M157.263 23.1626C157.263 20.5126 156.763 18.1626 155.776 16.1251C154.788 14.0876 153.351 12.5001 151.463 11.3376C149.576 10.1751 147.326 9.6001 144.701 9.6001C142.051 9.6001 139.688 10.2001 137.638 11.3876C135.588 12.5751 133.988 14.2251 132.826 16.3251C131.663 18.4251 131.088 20.8501 131.088 23.6126C131.088 26.3376 131.701 28.7501 132.926 30.8502C134.151 32.9502 135.851 34.6001 138.013 35.7878C140.176 36.9751 142.663 37.5751 145.451 37.5751C146.988 37.5751 148.613 37.2877 150.313 36.7126C152.338 36.0253 154.238 34.9627 155.751 33.4253C155.713 33.4627 152.726 30.7252 152.413 30.4378C152.001 30.7876 151.451 31.2252 150.826 31.6376C150.813 31.6376 150.813 31.6501 150.801 31.6501C150.201 32.0251 149.488 32.3502 148.638 32.65C147.551 33.0375 146.476 33.2252 145.438 33.2252C143.526 33.2252 141.826 32.8003 140.351 31.9627C138.876 31.1251 137.713 29.9752 136.876 28.5377C136.313 27.5626 135.938 26.5127 135.751 25.3626H157.238V23.1876C157.263 23.1876 157.263 23.1751 157.263 23.1626ZM154.176 34.7625C154.163 34.7753 154.138 34.7878 154.126 34.8002C154.101 34.8127 154.088 34.8252 154.063 34.8377C154.101 34.8127 154.138 34.7878 154.176 34.7625ZM135.826 21.3751C136.001 20.4126 136.288 19.5126 136.688 18.6751C137.401 17.2126 138.426 16.0626 139.788 15.2251C141.151 14.3876 142.788 13.9626 144.701 13.9626C146.376 13.9626 147.813 14.3501 148.988 15.1251C150.163 15.9001 151.076 16.9501 151.713 18.2751C152.163 19.2251 152.463 20.2501 152.613 21.3751H135.826Z"
      fill="white"
    />
  </svg>
);

const BURGER = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 24V22H28V24H4ZM4 17V15H28V17H4ZM4 10V8H28V10H4Z" fill="white" />
  </svg>
);

function Header({ headerDark }: DATA) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [getStartedOpen, setGetStartedOpen] = useState(false);

  const handleGetStartedOpen = (open: boolean) => () => {
    setGetStartedOpen(open);
    menuOpen && setMenuOpen(false);
  };

  const handleMenuOpen = (open: boolean) => () => {
    setMenuOpen(open);
  };

  useEffect(() => {
    if (menuOpen) {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;
      window.onscroll = function () {
        window.scrollTo(scrollLeft, scrollTop);
      };
    } else {
      window.onscroll = function () {};
    }
  }, [menuOpen]);

  return (
    <div
      className={classNames(styles.root, {
        [styles.dark]: headerDark,
      })}
    >
      <div className={styles.content}>
        <div className={styles.logo}>
          <Link href="/">{LOGO}</Link>
        </div>
        <div className={styles.menu}>
          {LINKS.map((item, i) => (
            <div
              className={classNames(styles.link, {
                [styles.active]: router.pathname === item.href,
              })}
              key={i}
            >
              <Link href={item.href}>{item.title}</Link>
            </div>
          ))}
          <div
            className={styles.getStarted}
            onClick={handleGetStartedOpen(true)}
          >
            Get started
          </div>
        </div>
        <div className={styles.burger} onClick={handleMenuOpen(true)}>
          {BURGER}
        </div>
      </div>
      <div
        className={classNames(styles.mobileMenu, {
          [styles.open]: menuOpen,
        })}
      >
        <div className={styles.menuContent}>
          <div className={styles.logo} onClick={handleMenuOpen(false)}>
            <Link href="/" prefetch>
              {LOGO}
            </Link>
          </div>
          <div className={styles.menu}>
            {LINKS_MOBILE.map((item, i) => (
              <div
                className={classNames(styles.link, {
                  [styles.active]: router.pathname === item.href,
                })}
                key={i}
                onClick={handleMenuOpen(false)}
              >
                <Link href={item.href} prefetch>
                  {item.title}
                </Link>
              </div>
            ))}
            <div
              className={styles.getStarted}
              onClick={handleGetStartedOpen(true)}
            >
              Get started
            </div>
          </div>
          <div className={styles.close} onClick={handleMenuOpen(false)}>
            <Image src={Close} alt="close" priority />
          </div>
        </div>
      </div>
      <PNModal
        isOpen={getStartedOpen}
        onClose={handleGetStartedOpen(false)}
        isDark={false}
        noPadding
        maxWidth="max-w-[500px]"
        fitContent
      >
        <GetTextToPlannet
          onClose={handleGetStartedOpen(false)}
          title="Text Plannet to plan and book the best itinerary 
          for your next trip"
        />
      </PNModal>
    </div>
  );
}

export default Header;
