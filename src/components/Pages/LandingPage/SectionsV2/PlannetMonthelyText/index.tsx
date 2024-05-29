import React, { useEffect, useState } from 'react';
// STYLES
import Image, { StaticImageData } from 'next/image';
import { FaChevronRight } from 'react-icons/fa';
import PhoneNumberInput from '@/components/PhoneNumberInput/PhoneNumberInput';
import { sendVerificationCode } from '@/api/auth/auth.service';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { actions } from '@/store/phone/phone.slice';
import Loader from '@/components/Loader/Loader';
import { useMediaQuery } from 'react-responsive';
import styles from './index.module.scss';

type DATA = {
  title: string;
  heading: string;
  subTitle: string;
  image: StaticImageData;
  theme?: string;
};

function PlannetMonthelyTexts({
  heading,
  title,
  subTitle,
  theme,
  image,
}: DATA) {
  const dispatch = useDispatch();

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  const [formatedPhoneNumber, setFormatedPhoneNumber] = useState<string>('');
  const router = useRouter();
  const isMobile = useMediaQuery({
    query: '(min-width: 768px)',
  });
  const handleContinue = async () => {
    if (isDisabled || isLoading) return;
    setIsLoading(true);
    try {
      if (!isSent) {
        await sendVerificationCode({ countryCode, phoneNumber });
        setIsSent(true);
        dispatch(actions.setCountryCode(countryCode));
        dispatch(actions.setFormatedPhoneNumber(formatedPhoneNumber));
        dispatch(actions.setPhoneNumber(phoneNumber));
        router.push('/plannetMonthlyTexts/signup');
      }
    } catch (error) {
      console.error('error', error);
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

  useEffect(() => {
    // Once the component mounts, update the state
    setIsClient(true);
  }, []);

  return (
    <div className="bg-[#D4DDE0] lg:flex">
      {isClient && isMobile && (
        <div className="w-full lg:w-[36%]">
          <Image
            className=" object-cover w-full h-full"
            src={image}
            width={image.width}
            height={image.height}
            alt={heading}
          />
        </div>
      )}

      <div className="w-full p-[20px]  md:p-[50px] sm:[20px_15px] lg:w-[64%] lg:p-[100px_75px]">
        <div>
          <h2 className={styles.title} style={{ color: '#221A36' }}>
            {heading} <br /> {title}
          </h2>
          <div className={styles.explanationText}>{subTitle}</div>
          <p className={styles.caption}>Sign up for Plannet Monthly</p>
          <div className="relative w-[431px] max-sm:w-full">
            <PhoneNumberInput
              onPhoneActive={(active: boolean) => setIsDisabled(!active)}
              onPhoneChange={onPhoneNumberChange}
              onEnter={handleContinue}
              customStyle="w-full rounded-lg p-[9.5px] max-sm:p-[6px]"
              isDisabled={isDisabled}
            />
            <button
              className={`absolute top-[10px] max-sm:top-[7px] right-[10px] max-sm:right-[7px] flex items-center justify-center w-[50px] max-sm:w-[35px] h-[50px] max-sm:h-[35px] md:p-3 bg-black z-10 rounded-lg ${
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
        </div>
      </div>
    </div>
  );
}

export default PlannetMonthelyTexts;
