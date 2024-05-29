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
              <div className={styles.phoneTitle}>Sign up to be a Planner</div>
              <div
                className={classNames(
                  'max-w-[460px]',
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
                  className={`absolute top-[50%] translate-y-[-50%] right-2 p-2 md:p-3 bg-black z-10 rounded-lg ${
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
