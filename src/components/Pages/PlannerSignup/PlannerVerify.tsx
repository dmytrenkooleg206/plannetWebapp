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

type PlannerVerifyProps = {
  onSetUserid: Function;
};
export default function PlannerVerify({ onSetUserid }: PlannerVerifyProps) {
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
    } else {
      setIsDisabled(true);
    }
    if (isError) setIsError(false);
    setVerificationCode(code);
  };

  const renderContent = () => {
    if (!isSent)
      return (
        <div>
          <div className="text-xl md:text-3xl font-bold text-center">
            Input your phone number
          </div>
          <div className="my-5 md:my-10">
            <PhoneNumberInput
              onPhoneActive={(active: boolean) => setIsDisabled(!active)}
              onPhoneChange={onPhoneNumberChange}
              onEnter={handleContinue}
            />
          </div>
        </div>
      );
    return (
      <div>
        <div className="text-xl md:text-3xl font-bold text-center">
          Verify your phone number
        </div>
        <div className="text-lg md:text-2xl text-center mt-3 text-black-400">
          Check your texts for the code.
        </div>
        <div className="my-5 md:my-10">
          <CodeInput
            isError={isError}
            errorText={errorText}
            onCodeChange={handleCodeChange}
            onEnter={() => handleContinue()}
          />
        </div>
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
            onClick={() => {
              setCountryCode('');
              setPhoneNumber('');
              setFormatedPhoneNumber('');
              setIsDisabled(true);
              setIsSent(false);
            }}
          >
            try a different phone number.
          </span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex w-full bg-fill bg-no-repeat bg-center bg-[url('/assets/images/ourplanner/planner-bg-steps.png')]">
        <div className="w-full max-w-[500px] p-5 md:p-14 bg-white text-black mx-auto shadow-md mt-7 mb-20">
          {checkedStatus ? (
            <div>
              {renderContent()}
              <Button
                text="Continue"
                isDisabled={isDisabled}
                isLoading={isLoading}
                color="black"
                onClick={handleContinue}
              />
            </div>
          ) : (
            <div />
          )}
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
