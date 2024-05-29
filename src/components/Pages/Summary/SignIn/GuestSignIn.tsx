import { sendVerificationCode } from '@/api/auth/auth.service';
import { OnPhoneChange } from '@/components/PhoneNumberInput/PhoneNumberInput';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from '../../Registration/Registration.module.scss';
import VerifyStep from '../../Registration/Steps/Step2/VerifyStep';
import PhoneNumberSelector from '../../Registration/Steps/Step1/PhoneSelectStep';
import { getPlannetGuestUserTripIdFromLocalStorage } from '@/lib/localStorage/localStorage';

export default function GuestSignIn() {
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

  let guestUserTripId = '';

  useEffect(() => {
    guestUserTripId = getPlannetGuestUserTripIdFromLocalStorage();
  }, []);

  
  return (
    <div className={styles.block_signup}>
      {
        {
          1: (
            <PhoneNumberSelector
              onPhoneChange={onPhoneNumberChange}
              onSendCode={handleSendVerificationCode}
              onNextStep={handleNextStep}
              authType="signin"
              page="guestLogin"
            />
          ),
          2: (
            <VerifyStep
              onPrevStep={handlePrevStep}
              formatedPhoneNumber={formatedPhoneNumber}
              phoneNumber={phoneNumber}
              countryCode={countryCode}
              onNextStep={handleNextStep}
              authType="signin"
              redirectPage={`/summary/loading/${guestUserTripId}`}
            />
          ),
        }[step]
      }
    </div>
  );
}
