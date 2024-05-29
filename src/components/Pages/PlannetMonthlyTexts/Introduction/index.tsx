import { selectors } from '@/store/onboarding/onboarding.slice';
import Image, { StaticImageData } from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { FaChevronRight } from 'react-icons/fa';
import Loader from '@/components/Loader/Loader';
import PhoneNumberInput from '@/components/PhoneNumberInput/PhoneNumberInput';
import { useWindowSize } from '@/hooks/useWindowSize';
import styles from './index.module.scss';

type DATA = {
  handleGetStartedOpen?: any;
  title: string;
  description: string;
  buttonText?: string;
  backgroundDesktop: string | StaticImageData;
  backgroundMobile: string | StaticImageData;
  backgroundTablet: string | StaticImageData;
  theme?: string;
  setIsDisabled?: any;
  isDisabled?: boolean;
  handleContinue?: any;
  onPhoneNumberChange?: any;
  isLoading?: boolean;
};

const MOBILE_SCREEN = 700;
const TABLET_SCREEN = 1024;

function Introduction({
  handleGetStartedOpen,
  title,
  description,
  buttonText,
  backgroundDesktop,
  backgroundMobile,
  backgroundTablet,
  theme,
  setIsDisabled,
  handleContinue,
  onPhoneNumberChange,
  isDisabled,
  isLoading,
}: DATA) {
  const { width } = useWindowSize();
  const loaded = useSelector(selectors.loaded);
  const [cssLoaded, setCssLoaded] = useState(loaded);
  const isMobile = useMemo(() => width && width <= MOBILE_SCREEN, [width]);
  const isTablet = useMemo(() => width && width <= TABLET_SCREEN, [width]);

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
        <Image
          src={
            isMobile
              ? backgroundMobile
              : isTablet
              ? backgroundTablet
              : backgroundDesktop
          }
          alt="background"
          priority
        />
      </div>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.description}>{description}</div>
          <p className={styles.caption}>Sign up for Plannet Monthly</p>
          {buttonText && handleGetStartedOpen && (
            <div
              className={styles.getStarted}
              onClick={handleGetStartedOpen(true)}
            >
              {buttonText}
            </div>
          )}
          {onPhoneNumberChange && (
            <>
              <div
                className={classNames(
                  'max-w-[431px]',
                  'relative',
                  'bg-white',
                  styles.inputWrapper,
                )}
              >
                <PhoneNumberInput
                  onPhoneActive={handleActive}
                  onPhoneChange={onPhoneNumberChange}
                  onEnter={handleContinue}
                  customStyle={styles.phoneInput}
                />
                <button
                  className={`absolute flex items-center justify-center w-[50px] max-sm:w-[34px] h-[50px] max-sm:h-[34px] top-[50%] translate-y-[-50%] right-2 max-sm:right-[5px] bg-black z-10 rounded-lg ${
                    isDisabled ? 'opacity-40' : ''
                  }`}
                  type="button"
                  onClick={handleContinue}
                >
                  {!isLoading ? (
                    <FaChevronRight className="text-white text-base md:text-xl" />
                  ) : (
                    <Loader color="white" size={20} />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Introduction;
