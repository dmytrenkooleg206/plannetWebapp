import { useState } from 'react';
import { sendVerificationCode } from '@/api/auth/auth.service';
import PhoneNumberSelector from '../Steps/Step1/PhoneSelectStep';
import VerifyStep from '../Steps/Step2/VerifyStep';
import CreateProfileStep from '../Steps/Step3/CreateProfileStep';
import NotificationStep from '../Steps/Step4/NotificationStep';
import styles from '../Registration.module.scss';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
  const [formatedPhoneNumber, setFormatedPhoneNumber] = useState<string>('');

  const onPhoneNumberChange = (
    newPhoneNumber: string,
    newCountryCode: string,
    newFormatedPhoneNumber: string,
  ) => {
    setPhoneNumber(newPhoneNumber);
    setCountryCode(newCountryCode);
    setFormatedPhoneNumber(newFormatedPhoneNumber);
  };

  const handleSendVerificationCode = () => {
    sendVerificationCode({ countryCode, phoneNumber });
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  return (
    <>
      <div className={styles.block_signup}>
        {step === 1 && (
          <PhoneNumberSelector
            page=""
            onPhoneChange={onPhoneNumberChange}
            onSendCode={handleSendVerificationCode}
            onNextStep={handleNextStep}
            authType="signup"
          />
        )}
        {step === 2 && (
          <VerifyStep
            redirectPage="/home"
            onPrevStep={handlePrevStep}
            formatedPhoneNumber={formatedPhoneNumber}
            phoneNumber={phoneNumber}
            countryCode={countryCode}
            onNextStep={handleNextStep}
            authType="signup"
          />
        )}
        {step === 3 && <CreateProfileStep onNextStep={handleNextStep} />}
      </div>
      {step === 4 && <NotificationStep />}
    </>
  );
}
