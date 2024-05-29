import {
  sendVerificationCode,
  verifyPhoneNumber,
} from '@/api/auth/auth.service';
import { OnPhoneChange } from '@/components/PhoneNumberInput/PhoneNumberInput';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { actions } from '@/store/user/user.slice';
import {
  getPlannetUserStatusFromLocalStorage,
  persistPlannetTokenInLocalStorage,
  persistPlannetUserIdInLocalStorage,
  persistPlannetUserProfilePictureInLocalStorage,
  persistUserFullnameInLocalStorage,
  persistUserStatusInLocalStorage,
} from '@/lib/localStorage/localStorage';
import { useRouter } from 'next/router';
import Alert from '@/components/Alert/Alert';
import { completeSignUp } from '@/api/user/user.service';
import { isInvalidEmail } from '@/lib/utils';
import VerifyInput from '@/components/Pages/Summary/VerifyInput/VerifyInput';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import Image from 'next/image';
import Loader from '@/components/Loader/Loader';
import { ResendCodeModal } from '../ResendCodeModal';
import LoginPhoneNumberInput from '@/components/Pages/Summary/LoginPhoneNumberInput/LoginPhoneNumberInput';
import { useQuery } from 'react-query';
import { getPlannetCashBalance } from '@/api/wallet/wallet.service';
import { QUERY_OPTION } from '@/lib/constants';

type TextInputProps = {
  id: string;
  placeholder: string;
  value: string;
  onChange: Function;
  onEnter: Function;
};

type LoginModalProps = {
  onClose: Function;
  isOpen: boolean;
  cloningSource: string;
  saveForLater: Function;
  setShowModalPage: Function;
};
export default function LoginForm({
  onClose,
  isOpen,
  cloningSource,
  saveForLater,
  setShowModalPage,
}: LoginModalProps) {
  const userStatus = getPlannetUserStatusFromLocalStorage();

  const [step, setStep] = useState(userStatus === 'APPROVED' ? 3 : 1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [formatedPhoneNumber, setFormatedPhoneNumber] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isCodeDisabled, setIsCodeDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const dispatch = useDispatch();
  const router = useRouter();
  //Verification
  const [isError, setIsError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isCodeResent, setIsCodeResent] = useState<boolean>(false);

  //profile
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  //balance
  const [getBalance, setGetBalance] = useState<boolean>(false);
  const { data: balanceData } = useQuery(
    ['balance'],
    () => getPlannetCashBalance(),
    { ...QUERY_OPTION, enabled: getBalance },
  );

  //Phone number functions
  const onPhoneNumberChange: OnPhoneChange = (
    newPhoneNumber,
    newCountryCode,
    newFormatedPhoneNumber,
  ) => {
    setPhoneNumber(newPhoneNumber);
    setCountryCode(newCountryCode);
    setFormatedPhoneNumber(newFormatedPhoneNumber);
  };

  const redirectOprations = async () => {
    setIsRedirecting(true);
    if (cloningSource === 'freeze') {
      setGetBalance(true);
      router.push(
        `/summary-details/freeze/${router.query.id}?startDate=${router.query.startDate}&endDate=${router.query.endDate}`,
      );
    } else if (cloningSource === 'ocb') {
      setGetBalance(true);
      router.push(
        `/summary-details/ocb/${router.query.id}?startDate=${router.query.startDate}&endDate=${router.query.endDate}`,
      );
    } else if (cloningSource === 'saveforlater') {
      await saveForLater();
      setShowModalPage(false);
      onClose();
    } else if (cloningSource === 'textPlannet') {
      setShowModalPage(false);
      onClose();
      // setShowLoginModal(true);
      window.location.href = `sms:+1(917)932-2005;?&body=Hey Plannet Team, I am interested in having you plan my trip! I am interested in having flights, hotels, experiences and restaurant reservations booked for me! I liked this trip ${process.env.NEXT_PUBLIC_CURRENT_URL}${router.asPath}`;
    }
  };

  const handleSendVerificationCode = () =>
    sendVerificationCode({ countryCode, phoneNumber });

  const handleNextStep = async (user: any = {}) => {
    if (step === 3) {
      redirectOprations();
    } else if (step === 2) {
      if (user?.status === 'COMPLETE') {
        redirectOprations();
      } else setStep(step + 1);
    } else setStep(step + 1);
  };

  const handleContinue = async () => {
    if (isDisabled || isLoading) return;
    setIsLoading(true);
    try {
      if (!isDisabled) {
        await handleSendVerificationCode();
        handleNextStep();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePrevStep = () => setStep((prevStep) => prevStep - 1);

  //Verification functions
  const handleCodeChange = (code: string) => {
    if (code?.length === 6) {
      setIsCodeDisabled(false);
      handleVerificationContinue(code);
    } else {
      setIsCodeDisabled(true);
    }
    if (isError) setIsError(false);
    setVerificationCode(code);
  };

  const handleVerificationContinue = async (code = '') => {
    // if (isCodeDisabled || isLoading) return;
    const vCode = code === '' ? verificationCode : code;
    setIsLoading(true);
    setIsError(false);
    setErrorText('');
    try {
      const data = await verifyPhoneNumber({
        countryCode,
        phoneNumber,
        verificationCode: vCode,
      });
      const { token, user } = data;
      dispatch(actions.setUser(user));
      persistUserFullnameInLocalStorage(
        `${user.firstName && user.firstName} ${user.lastName && user.lastName}`,
      );
      persistPlannetTokenInLocalStorage(token);
      persistPlannetUserIdInLocalStorage(user.id);
      persistPlannetUserProfilePictureInLocalStorage(user.profilePictureUrl_CF);
      persistUserStatusInLocalStorage(user.status);

      handleNextStep(user);
    } catch (error: any) {
      setIsError(true);
      const { response } = error;
      if (response && response.data) {
        setErrorText('Incorrect Verification Code');
      } else {
        setErrorText('Bad request! Try again later');
      }
      setIsCodeDisabled(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await sendVerificationCode({ countryCode, phoneNumber });
      setIsCodeResent(true);
      setTimeout(() => {
        setIsCodeResent(false);
      }, 2000);
    } catch (error) {
      setErrorText('Resend failed');
    } finally {
      setIsLoading(false);
    }
  };

  //Signup Functions
  const handleRegisration = async () => {
    const err: string = isInvalidEmail(email);
    if (err) {
      setErrorText(err);
      return;
    }
    if (firstName === '' || lastName === '') {
      return;
    }
    setIsLoading(true);
    try {
      const { user } = await completeSignUp({ firstName, lastName, email });
      dispatch(actions.setUser(user));
      persistUserFullnameInLocalStorage(
        `${user.firstName && user.firstName} ${user.lastName && user.lastName}`,
      );
      persistUserStatusInLocalStorage(user.status);
      handleNextStep();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      setIsRedirecting(false);
      setPhoneNumber('');
      setCountryCode('');
      setFormatedPhoneNumber('');
      setStep(1);
    };
  }, []);

  if (!isOpen) return null;
  return (
    <div className="bg-[#1F133E] text-white px-5 py-7 md:px-8 w-full min-h-[100dvh] fixed top-0 left-0 z-50">
      <div className="max-w-[500px] mx-auto text-white mt-2">
        <div className="grid grid-cols-3 gap-4 mb-8 ">
          <button
            onClick={() => {
              onClose();
              setShowModalPage(false);
            }}
          >
            <IoIosArrowBack className="text-[155%]" />
          </button>
          <p className="w-375px h-98px border-0 col-start-2 col-span-1">
            <Image
              src="/assets/images/registration/white_logo.png"
              width={250}
              height={250}
              alt="logo"
            />
          </p>
        </div>
        <div className="flex flex-col justify-between h-[70dvh]">
          {
            {
              1: (
                <>
                  <div>
                    <h2 className="text-center text-[24px] mb-8">
                      Create an account
                    </h2>
                    <LoginPhoneNumberInput
                      onPhoneActive={(active: boolean) =>
                        setIsDisabled(!active)
                      }
                      onPhoneChange={onPhoneNumberChange}
                      onEnter={() => handleContinue()}
                      customStyle="bg-white-100 text-white"
                    />
                    <p className="mt-5 text-white-600 text-center">
                      By entering your number, you’re agreeing to our{' '}
                      <Link
                        target="_blank"
                        className="underline"
                        style={{
                          color: '#fff',
                        }}
                        href="https://iridescent-honeydew-39f.notion.site/Terms-of-Service-7fbca3f435e54897846d7d376d879c1a"
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        target="_blank"
                        className="underline"
                        style={{
                          color: '#fff',
                        }}
                        href="https://iridescent-honeydew-39f.notion.site/Privacy-Policy-4d701c86d522468daecc3a66063d1566"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                  <button
                    onClick={() => handleContinue()}
                    disabled={isDisabled}
                    className={`w-full md:w-auto bg-white p-3 rounded-[8px] flex text-center text-md items-center justify-center mt-5 ${
                      isDisabled
                        ? 'text-[#1f133e] bg-white-500 cursor-not-allowed'
                        : 'text-[#1f133e]'
                    }`}
                  >
                    <p className="text-[24px] font-bold">Continue</p>
                  </button>
                </>
              ),
              2: (
                <>
                  <div>
                    <h2 className="text-center text-[24px]">
                      Verify your phone number
                    </h2>
                    <p className="font-light text-md text-center text-white-600 mb-8">
                      Check your texts for the code.
                    </p>
                    <VerifyInput
                      isError={isError}
                      errorText={errorText}
                      onCodeChange={handleCodeChange}
                      onEnter={() => handleVerificationContinue()}
                    />
                    <div className="mt-4">
                      {isLoading && <Loader color="white" />}
                    </div>
                    <div className="text-white-600 text-base text-md text-center mt-5 sm:mt-7 mb-7 sm:mb-12">
                      Didn’t get the code?
                      <br /> Tap here to{' '}
                      <span
                        className="text-white font-bold cursor-pointer underline select-none"
                        role="presentation"
                        onClick={() => handleResend()}
                      >
                        resend to {formatedPhoneNumber}
                      </span>{' '}
                      <br />
                      or{' '}
                      <span
                        className="text-white font-bold cursor-pointer underline select-none"
                        role="presentation"
                        onClick={() => handlePrevStep()}
                      >
                        try a different phone number.
                      </span>
                    </div>
                  </div>
                  {/* {isRedirecting ? (
                    <button className="`w-full md:w-auto bg-[#7440F5] p-3 rounded-[8px] flex items-center justify-center mt-5">
                      <Loader color="white" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVerificationContinue()}
                      disabled={isCodeDisabled}
                      className={`w-full md:w-auto bg-[#7440F5] p-3 rounded-[8px] flex text-center items-center justify-center mt-5 ${isCodeDisabled && 'bg-opacity-50'
                        }`}
                    >
                      <p className="text-[20px] font-bold">
                        {isCodeDisabled
                          ? 'Continue'
                          : 'Verify your phone number'}
                      </p>
                    </button>
                  )} */}
                </>
              ),
              3: (
                <>
                  <div>
                    <h2 className="text-center text-xl">
                      Complete Your Profile
                    </h2>
                    <div className="flex gap-2 mt-8">
                      <div>
                        <label>First Name</label>
                        <TextInput
                          id="firstname"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(val: string) => setFirstName(val)}
                          onEnter={() => {
                            document.getElementById('lastname')?.focus();
                          }}
                        />
                      </div>
                      <div>
                        <label>Last Name</label>
                        <TextInput
                          id="lastname"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(val: string) => setLastName(val)}
                          onEnter={() => {
                            document.getElementById('email')?.focus();
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label>Email</label>
                      <TextInput
                        id="email"
                        value={email}
                        onChange={(val: string) => {
                          if (errorText) setErrorText('');
                          setEmail(val);
                        }}
                        placeholder="user@gmail.com"
                        onEnter={() => handleRegisration()}
                      />
                      {errorText ? (
                        <div className="">
                          <Alert errorText="Incorrect email format" />
                          <div className="">{errorText} </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {isRedirecting ? (
                    <button className="`w-full md:w-auto bg-white-500 p-3 text-[#1f133e] p-3 rounded-[8px] flex items-center justify-center mt-5">
                      <Loader color="white" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegisration()}
                      className="w-full md:w-auto bg-white p-3 text-[#1f133e] rounded-[8px] flex text-center mt-4 items-center justify-center"
                    >
                      <p className="text-[20px] font-bold">Continue</p>
                    </button>
                  )}
                </>
              ),
            }[step]
          }
        </div>
      </div>
      <ResendCodeModal
        isOpen={isCodeResent}
        onClose={() => setIsCodeResent(false)}
      />
    </div>
  );
}

function TextInput({
  id = '',
  placeholder = '',
  value,
  onChange,
  onEnter,
}: TextInputProps) {
  const handleChange = (e: any) => {
    onChange(e.target.value);
  };
  return (
    <input
      id={id}
      type="text"
      value={value}
      autoComplete="off"
      onChange={handleChange}
      className="bg-white-100 p-3 rounded-lg w-full"
      placeholder={placeholder}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onEnter();
      }}
    />
  );
}
