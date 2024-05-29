import Link from 'next/link';
import Image from 'next/image';
import WhiteLogoImage from '@/../public/assets/images/footer/white_logo.png';
import MobileNav from './MobileNav';
import styles from '../Footer.module.scss';

const links = [
  {
    text: 'FAQ',
    href: '/',
  },
  {
    text: 'Contact',
    href: '/contact',
  },
  {
    text: 'Terms of Service',
    href: 'https://iridescent-honeydew-39f.notion.site/Terms-of-Service-7fbca3f435e54897846d7d376d879c1a',
  },
  {
    text: 'Careers',
    href: '/careers',
  },
  {
    text: 'Planner Reference Sheet',
    href: '/reference',
  },
  {
    text: 'Privacy Policy',
    href: 'https://iridescent-honeydew-39f.notion.site/Privacy-Policy-4d701c86d522468daecc3a66063d1566',
  },
];

export default function DesktopFooter() {
  return (
    <div className={styles.footer_desktop}>
      <div>
        <Image
          className={styles.image_logo}
          src={WhiteLogoImage}
          alt="logo"
          loading="lazy"
        />
        <div className={styles.text_start_here}>Travel Starts Here.</div>
        <div className={styles.text_copyright}>
          Copyright © 2023. Plannet Technologies Inc.
        </div>
      </div>
      <div className={styles.flex_col}>
        {links.map((link) => {
          return (
            <MobileNav
              key={link.text}
              text={link.text}
              href={link.href}
              color="#FFFFFF"
              fontsize="24px"
            />
          );
        })}
      </div>
      <div className={styles.flex_col}>
        <div className="flex mb-7">
          <Link href={`${process.env.NEXT_PUBLIC_APP_STORE}`} target="blank">
            <div className="w-[180px] h-[56px] mr-2 relative">
              <Image
                src="/assets/images/landingpage/app_store.png"
                alt="app store"
                fill
                loading="lazy"
              />
            </div>
          </Link>
        </div>
        <Link href="/planner" className={styles.button_become}>
          Become a Plannet Planner
        </Link>
        <Link className={styles.link_learnmore} href="/planner/about">
          Learn more about Planners
        </Link>
      </div>
    </div>
  );
}
