import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import PhoneNumberInput, {
  type OnPhoneChange,
} from '@/components/PhoneNumberInput/PhoneNumberInput';

type PhoneSelectStepProps = {
  onPhoneChange: OnPhoneChange;
  onSendCode: Function;
  onNextStep: Function;
  authType: string;
  page: string;
};

export default function PhoneSelectStep({
  onPhoneChange,
  onSendCode,
  onNextStep,
  authType = 'signup',
  page = '',
}: PhoneSelectStepProps) {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleContinue = async () => {
    if (isDisabled || isLoading) return;
    setIsLoading(true);
    try {
      await onSendCode();
      onNextStep();
    } catch (error) {
      console.log(error);
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
      <PhoneNumberInput
        onPhoneActive={(active: boolean) => setIsDisabled(!active)}
        onPhoneChange={onPhoneChange}
        onEnter={() => handleContinue()}
      />
      <div className="mt-7 mb-5 sm:mb-12 mx-auto text-base sm:text-lg text-center font-medium max-w-[350px] text-gray">
        By entering your number, you’re agreeing to our{' '}
        <Link
          href="https://iridescent-honeydew-39f.notion.site/Terms-of-Service-7fbca3f435e54897846d7d376d879c1a"
          className="text-black font-bold"
          target="blank"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href="https://iridescent-honeydew-39f.notion.site/Privacy-Policy-4d701c86d522468daecc3a66063d1566"
          className="text-black font-bold"
          target="blank"
        >
          Privacy Policy
        </Link>
        .
      </div>
      <Button
        text="Continue"
        isDisabled={isDisabled}
        isLoading={isLoading}
        width="320px"
        onClick={() => handleContinue()}
      />
      {page && page != '' && page === 'guestLogin' ? null : authType ===
        'signup' ? (
        <div className="mt-7 font-normal text-center text-base sm:text-xl">
          Already have an account?
          <Link href="/signin" className="text-primary pl-1">
            Login
          </Link>
        </div>
      ) : (
        <div className="mt-7 font-normal text-center text-base sm:text-xl">
          Not a member?
          <Link href="/signup" className="text-primary pl-1">
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
