import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PhoneNumberInput from '@/components/PhoneNumberInput/PhoneNumberInput';
import CodeInput from '@/components/CodeInput/CodeInput';
import {
  sendVerificationCode,
  verifyPhoneNumber,
} from '@/api/auth/auth.service';
import Button from '@/components/Button/Button';
import CodeResent from '@/components/CodeResent/CodeResent';
import {
  persistPlannetTokenInLocalStorage,
  persistPlannetUserIdInLocalStorage,
  persistPlannetUserProfilePictureInLocalStorage,
} from '@/lib/localStorage/localStorage';
import { actions } from '@/store/user/user.slice';
import { selectors as phoneSelectors } from '@/store/phone/phone.slice';

import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import styles from './index.module.scss';
// IMAGES
import Logo from '../images/logo.svg';

type PlannerVerifyProps = {
  onSetUserid: Function;
};
export default function PlannerVerify({ onSetUserid }: PlannerVerifyProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const storedCountryCode = useSelector(phoneSelectors.countryCode);
  const storedPhoneNumber = useSelector(phoneSelectors.phoneNumber);
  const storedFormatedPhoneNumber = useSelector(
    phoneSelectors.formatedPhoneNumber,
  );

  const [isSent, setIsSent] = useState<boolean>(true);
  const [isCodeResent, setIsCodeResent] = useState<boolean>(false);

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
  const [formatedPhoneNumber, setFormatedPhoneNumber] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');

  const [checkedStatus, setCheckedStatus] = useState<boolean>(false);

  useEffect(() => {
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
      setCountryCode(storedCountryCode);
      setFormatedPhoneNumber(storedFormatedPhoneNumber);
    } else setIsSent(false);
    setCheckedStatus(true);
  }, []);

  const handleContinue = async () => {
    if (isDisabled || isLoading) return;
    setIsLoading(true);
    try {
      if (!isSent) {
        await sendVerificationCode({ countryCode, phoneNumber });
        setIsSent(true);
      } else {
        const data = await verifyPhoneNumber({
          countryCode,
          phoneNumber,
          verificationCode,
        });
        const { user, token } = data;
        dispatch(actions.setUser(user));
        persistPlannetTokenInLocalStorage(token);
        persistPlannetUserIdInLocalStorage(user.id);
        persistPlannetUserProfilePictureInLocalStorage(
          user.profilePictureUrl_CF,
        );

        onSetUserid(user.id);
        setIsDisabled(true);
      }
    } catch (error) {
      setIsError(true);
      setErrorText('Incorrect Verification Code');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPhoneNumberChange = (
    newPhoneNumber: string,
    newCountryCode: string,
    newFormatedPhoneNumber: string,
  ) => {
    setPhoneNumber(newPhoneNumber);
    setCountryCode(newCountryCode);
    setFormatedPhoneNumber(newFormatedPhoneNumber);
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await sendVerificationCode({ countryCode, phoneNumber });
      setIsCodeResent(true);
    } catch (error) {
      setErrorText('Resend failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (code: string) => {
    if (code?.length === 6) {
      setIsDisabled(false);
      document.getElementById('continueBtn')?.focus();
    } else {
      setIsDisabled(true);
    }
    if (isError) setIsError(false);
    setVerificationCode(code);
  };

  const handleGoBack = () => {
    router.push('/plannetMonthlyTexts');
  };

  const renderContent = () => {
    if (!isSent)
      return (
        <div className="flex-1">
          <div className={styles.title}>Phone number</div>
          <div className={styles.inputsContainer}>
            <div className={styles.inputWrapper}>
              <PhoneNumberInput
                onPhoneActive={(active: boolean) => setIsDisabled(!active)}
                onPhoneChange={onPhoneNumberChange}
                onEnter={handleContinue}
                customStyle="!bg-[#FFFFFF1A] text-white !placeholder-[#FFFFFF4D] !focus:placeholder-gray-500"
              />
            </div>
          </div>
        </div>
      );
    return (
      <div className="flex-1">
        <div className={styles.verifyText}>Verify your phone number</div>
        <div className={styles.checkText}>Check your texts for the code.</div>
        <div className={styles.inputsContainerVerify}>
          <CodeInput
            isError={isError}
            errorText="Incorrect Verification Code"
            onCodeChange={handleCodeChange}
            onEnter={() => handleContinue()}
          />
        </div>
        <div className={styles.hintText}>
          Didn’t get the code? <br />
          Tap here to{' '}
          <b role="presentation" onClick={() => handleResend()}>
            resend to {formatedPhoneNumber}
          </b>{' '}
          or{' '}
          <b
            role="presentation"
            onClick={() => {
              setCountryCode('');
              setPhoneNumber('');
              setFormatedPhoneNumber('');
              setIsDisabled(true);
              setIsSent(false);
            }}
          >
            try a different phone number.
          </b>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className={styles.root}>
        <div className={styles.content}>
          <Link href="/" className={styles.logo}>
            <Image src={Logo} alt="plannet" priority />
          </Link>
          <div className={styles.form}>
            <div className={styles.header}>
              Sign Up
              <div className={styles.arrowBack} onClick={handleGoBack}>
                <FaChevronLeft />
              </div>
            </div>
            {checkedStatus ? (
              <div className="flex flex-col flex-1 w-full">
                <div>
                  <ProgressBar size={2} progress={0} />
                </div>
                {renderContent()}
                <div className="max-sm:mb-[50px]">
                  <Button
                    text={!isSent ? 'Get Code' : 'Continue'}
                    isDisabled={isDisabled}
                    isLoading={isLoading}
                    onClick={handleContinue}
                    color="gray"
                    id="continueBtn"
                  />
                </div>
              </div>
            ) : (
              <div />
            )}

            {isCodeResent && (
              <div className="fixed flex flex-col gap-[10px] items-center justify-center t-0 mx-auto left-[calc(50%-138px)] top-[330px] text-[20px] font-[700] text-[#1F133E] rounded-[8px] bg-[#FFFFFFE5] w-[276px] h-[154px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                >
                  <path
                    d="M20.4002 29.1335C21.1557 29.1335 21.7891 28.8779 22.3002 28.3668C22.8113 27.8557 23.0668 27.2224 23.0668 26.4668C23.0668 25.7113 22.8113 25.0779 22.3002 24.5668C21.7891 24.0557 21.1557 23.8002 20.4002 23.8002C19.6446 23.8002 19.0113 24.0557 18.5002 24.5668C17.9891 25.0779 17.7335 25.7113 17.7335 26.4668C17.7335 27.2224 17.9891 27.8557 18.5002 28.3668C19.0113 28.8779 19.6446 29.1335 20.4002 29.1335ZM32.2002 29.1335C32.9557 29.1335 33.5891 28.8779 34.1002 28.3668C34.6113 27.8557 34.8668 27.2224 34.8668 26.4668C34.8668 25.7113 34.6113 25.0779 34.1002 24.5668C33.5891 24.0557 32.9557 23.8002 32.2002 23.8002C31.4446 23.8002 30.8113 24.0557 30.3002 24.5668C29.7891 25.0779 29.5335 25.7113 29.5335 26.4668C29.5335 27.2224 29.7891 27.8557 30.3002 28.3668C30.8113 28.8779 31.4446 29.1335 32.2002 29.1335ZM43.5335 29.1335C44.2891 29.1335 44.9224 28.8779 45.4335 28.3668C45.9446 27.8557 46.2002 27.2224 46.2002 26.4668C46.2002 25.7113 45.9446 25.0779 45.4335 24.5668C44.9224 24.0557 44.2891 23.8002 43.5335 23.8002C42.7779 23.8002 42.1446 24.0557 41.6335 24.5668C41.1224 25.0779 40.8668 25.7113 40.8668 26.4668C40.8668 27.2224 41.1224 27.8557 41.6335 28.3668C42.1446 28.8779 42.7779 29.1335 43.5335 29.1335ZM5.3335 58.6668V9.3335C5.3335 8.26683 5.7335 7.3335 6.5335 6.5335C7.3335 5.7335 8.26683 5.3335 9.3335 5.3335H54.6668C55.7335 5.3335 56.6668 5.7335 57.4668 6.5335C58.2668 7.3335 58.6668 8.26683 58.6668 9.3335V44.0002C58.6668 45.0668 58.2668 46.0002 57.4668 46.8002C56.6668 47.6002 55.7335 48.0002 54.6668 48.0002H16.0002L5.3335 58.6668ZM14.2668 44.0002H54.6668V9.3335H9.3335V49.3335L14.2668 44.0002Z"
                    fill="#1F133E"
                  />
                </svg>
                Code resended
              </div>
            )}
          </div>
        </div>
      </div>
      <CodeResent
        phoneNumber={formatedPhoneNumber}
        isOpen={isCodeResent}
        onClose={() => setIsCodeResent(false)}
      />
    </div>
  );
}
