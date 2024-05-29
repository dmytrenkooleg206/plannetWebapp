import { useState } from 'react';
import { useRouter } from 'next/router';
import { sendVerificationCode } from '@/api/auth/auth.service';

import { type OnPhoneChange } from '@/components/PhoneNumberInput/PhoneNumberInput';

import PhoneNumberSelector from '../Steps/Step1/PhoneSelectStep';
import VerifyStep from '../Steps/Step2/VerifyStep';
import styles from '../Registration.module.scss';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [formatedPhoneNumber, setFormatedPhoneNumber] = useState('');

  const onPhoneNumberChange: OnPhoneChange = (
    newPhoneNumber,
    newCountryCode,
    newFormatedPhoneNumber,
  ) => {
    setPhoneNumber(newPhoneNumber);
    setCountryCode(newCountryCode);
    setFormatedPhoneNumber(newFormatedPhoneNumber);
  };

  const handleSendVerificationCode = () =>
    sendVerificationCode({ countryCode, phoneNumber });

  const handleNextStep = () => {
    if (step === 2) router.push('/home');
    else setStep(step + 1);
  };

  const handlePrevStep = () => setStep((prevStep) => prevStep - 1);

  return (
    <div className={styles.block_signup}>
      {
        {
          1: (
            <PhoneNumberSelector
              page=""
              onPhoneChange={onPhoneNumberChange}
              onSendCode={handleSendVerificationCode}
              onNextStep={handleNextStep}
              authType="signin"
            />
          ),
          2: (
            <VerifyStep
              redirectPage="/home"
              onPrevStep={handlePrevStep}
              formatedPhoneNumber={formatedPhoneNumber}
              phoneNumber={phoneNumber}
              countryCode={countryCode}
              onNextStep={handleNextStep}
              authType="signin"
            />
          ),
        }[step]
      }
    </div>
  );
}
