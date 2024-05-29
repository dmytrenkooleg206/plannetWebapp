import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// STYLES
import PNModal from '@/components/Modals/PNModal';
import styles from './index.module.scss';
// IMAGES
import Logo from './images/logo.svg';
import CTA from './images/cta.png';
import GetTextToPlannet from '../GetTextToPlannet';

function SignUpFooter() {
  const [getStartedOpen, setGetStartedOpen] = useState(false);

  const handleGetStartedOpen = (open: boolean) => () => {
    setGetStartedOpen(open);
  };

  return (
    <div className={styles.signupFooter}>
      <div className={styles.signupFooter_content}>
        <div className={styles.signupFooter_logo}>
          <Link href="/" prefetch>
            <Image src={Logo} alt="logo" priority />
          </Link>
          <p className="m-0 text-[11.5px] text-white">A friend in every city</p>
        </div>
        <div className={styles.download}>
          <Link href={`${process.env.NEXT_PUBLIC_APP_STORE}`} target="blank">
            <Image src={CTA} alt="apple store" priority />
          </Link>
        </div>
        <div className={styles.menu}>
          <div className={styles.column}>
            <div className={styles.columnTitle}>Company</div>
            <Link href="/" className={styles.link} prefetch>
              FAQs
            </Link>
            <Link href="/contact" className={styles.link} prefetch>
              Contact
            </Link>
            <Link
              className={styles.link}
              href="https://iridescent-honeydew-39f.notion.site/Terms-of-Service-7fbca3f435e54897846d7d376d879c1a"
            >
              Terms of Service
            </Link>
            <Link className={styles.link} href="/careers" prefetch>
              Careers
            </Link>
            <Link
              className={styles.link}
              href="https://iridescent-honeydew-39f.notion.site/Privacy-Policy-4d701c86d522468daecc3a66063d1566"
            >
              Privacy Policy
            </Link>
          </div>
          <div className={styles.column}>
            <div className={styles.columnTitle}>Products</div>
            <Link className={styles.link} href="/plannetBusiness" prefetch>
              Plannet For Business
            </Link>
            <Link className={styles.link} href="/plannetMonthlyTexts" prefetch>
              Plannet Monthly Texts
            </Link>
            {/* </Link> */}
            <Link href="/planner" className={styles.link} prefetch>
              Become a Planner
            </Link>
            <Link className={styles.link} href="/plannetlinks" prefetch>
              Get Plannet Links
            </Link>
          </div>
        </div>
        <div className={styles.copyright}>
          Copyright © 2023. Plannet Technologies Inc.
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

export default SignUpFooter;
