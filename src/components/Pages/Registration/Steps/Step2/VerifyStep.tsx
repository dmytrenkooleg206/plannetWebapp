import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import {
  verifyPhoneNumber,
  sendVerificationCode,
} from '@/api/auth/auth.service';
import {
  persistPlannetGuestUserTokenInLocalStorage,
  persistPlannetTokenInLocalStorage,
  persistPlannetUserIdInLocalStorage,
  persistPlannetUserProfilePictureInLocalStorage,
  persistUserFullnameInLocalStorage,
  persistUserStatusInLocalStorage,
} from '@/lib/localStorage/localStorage';
import { actions } from '@/store/user/user.slice';
import Button from '@/components/Button/Button';
import CodeInput from '@/components/CodeInput/CodeInput';
import CodeResent from '@/components/CodeResent/CodeResent';

type VerifyStepProps = {
  onPrevStep: Function;
  formatedPhoneNumber: string;
  countryCode: string;
  phoneNumber: string;
  authType: string;
  redirectPage: string;
  onNextStep: Function;
};

export default function VerifyStep({
  onPrevStep,
  formatedPhoneNumber,
  countryCode,
  phoneNumber,
  onNextStep,
  authType = 'signup',
  redirectPage = '/home',
}: VerifyStepProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const [isCodeResent, setIsCodeResent] = useState<boolean>(false);

  const handleContinue = async () => {
    if (isDisabled || isLoading) return;
    setIsLoading(true);
    try {
      const data = await verifyPhoneNumber({
        countryCode,
        phoneNumber,
        verificationCode,
      });
      const { token, user } = data;
      dispatch(actions.setUser(user));
      if (redirectPage != '' && redirectPage !== '/home') {
        persistPlannetGuestUserTokenInLocalStorage(token);
      } else {
        persistPlannetTokenInLocalStorage(token);
      }
      persistPlannetUserIdInLocalStorage(user.id);
      persistPlannetUserProfilePictureInLocalStorage(user.profilePictureUrl_CF);

      persistUserFullnameInLocalStorage(
        `${user.firstName && user.firstName} ${user.lastName && user.lastName}`,
      );
      persistUserStatusInLocalStorage(user.status);
      if (user?.status === 'COMPLETE') {
        router.push(redirectPage);
        return;
      }
      onNextStep();
    } catch (error: any) {
      setIsError(true);
      const { response } = error;
      if (response && response.data) {
        setErrorText('Incorrect Verification Code');
      } else {
        setErrorText('Bad request! Try again later');
      }
      setIsDisabled(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (code: string) => {
    if (code?.length === 6) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
    if (isError) setIsError(false);
    setVerificationCode(code);
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

  return (
    <div>
      <img
        className="flex mx-auto max-w-[100px]"
        src="/assets/images/header/black_plannet.svg"
        alt="plannet"
      />
      <div className="text-2xl sm:text-3xl text-center font-bold my-5 sm:my-7">
        {authType === 'signup' ? 'Create an Account' : 'Login'}
      </div>
      <div className="text-center text-base sm:text-xl font-bold">
        Verify your phone
      </div>
      <div className="text-center text-base sm:text-xl font-normal mt-1 sm:mt-2.5 mb-3.5 sm:mb-7 opacity-60">
        Check your texts for the code.
      </div>
      <CodeInput
        isError={isError}
        errorText={errorText}
        onCodeChange={handleCodeChange}
        onEnter={() => handleContinue()}
      />
      <div className="text-gray text-base sm:text-xl text-center mt-5 sm:mt-7 mb-7 sm:mb-12">
        Didn’t get the code? Tap here to{' '}
        <span
          className="text-black font-bold cursor-pointer underline select-none"
          role="presentation"
          onClick={() => handleResend()}
        >
          resend to {formatedPhoneNumber}
        </span>{' '}
        or{' '}
        <span
          className="text-black font-bold cursor-pointer underline select-none"
          role="presentation"
          onClick={() => onPrevStep()}
        >
          try a different phone number.
        </span>
      </div>
      <Button
        text="Continue"
        isDisabled={isDisabled}
        isLoading={isLoading}
        width="320px"
        onClick={() => handleContinue()}
      />
      <CodeResent
        phoneNumber={formatedPhoneNumber}
        isOpen={isCodeResent}
        onClose={() => setIsCodeResent(false)}
      />
    </div>
  );
}
