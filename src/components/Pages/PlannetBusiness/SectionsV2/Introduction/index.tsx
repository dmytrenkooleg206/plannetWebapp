import React, { useEffect, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import classNames from 'classnames';
import PhoneNumberInput from '@/components/PhoneNumberInput/PhoneNumberInput';
import { FaChevronRight } from 'react-icons/fa';
import Loader from '@/components/Loader/Loader';
import { useSelector } from 'react-redux';
import { selectors } from '@/store/onboarding/onboarding.slice';
import styles from './index.module.scss';

type DATA = {
  handleGetStartedOpen?: any;
  title: string;
  description: string;
  buttonText?: string;
  background: string | StaticImageData;
  theme?: string;
  setIsDisabled?: any;
  isDisabled?: boolean;
  handleContinue?: any;
  onPhoneNumberChange?: any;
  isLoading?: boolean;
};

export default function Introduction({
  handleGetStartedOpen,
  title,
  description,
  buttonText,
  background,
  theme,
  setIsDisabled,
  isDisabled,
  handleContinue,
  onPhoneNumberChange,
  isLoading,
}: DATA) {
  const loaded = useSelector(selectors.loaded);
  const [cssLoaded, setCssLoaded] = useState(loaded);

  useEffect(() => {
    setCssLoaded(loaded);
  }, [loaded]);
  const handleActive = (active: boolean) => {
    setIsDisabled(!active);
  };
  return (
    <div
      className={classNames(styles.root, {
        [styles[`${theme}`]]: theme,
      })}
    >
      <div className={styles.imageWrapper}>
        <Image src={background} alt="background" priority />
      </div>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.description}>{description}</div>
          {buttonText && (
            <a className={styles.getStarted} href="#contact_form">
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
