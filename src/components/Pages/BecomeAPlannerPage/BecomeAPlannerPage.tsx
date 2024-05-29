import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useRouter } from 'next/router';

import { actions } from '@/store/phone/phone.slice';

import { getPlannetUserIdFromLocalStorage } from '@/lib/localStorage/localStorage';

import { sendVerificationCode } from '@/api/auth/auth.service';
import Howitworks from '@/components/Pages/LandingPage/SectionsV2/Howitworks';
import BlockWithImage from '@/components/Pages/Plannetlinks/SectionsV2/BlockWithImage';
import MainLayout from '@/components/layouts/MainLayout';
import Introduction from './Introduction';
import Background from '../../../../public/assets/images/V2Images/backgroundPlanner.webp';
import Plannet from './images/plannet.svg';
import Diversity from './images/diversity.svg';
import Currency from './images/currency.svg';
import Mockup1 from '../../../../public/assets/images/V2Images/mockup4.webp';

const explanations = [
  {
    id: 1,
    img: Plannet,
    title: 'Complete your profile!',
    text: 'Your passions, interest and what you\nlove the most about your city.',
    alt: 'Complete your profile!',
  },
  {
    id: 2,
    img: Diversity,
    title: 'Connect with travelers\nfrom around the world!',
    alt: 'Connect with travelers from around the world!',
  },
  {
    id: 3,
    img: Currency,
    title: 'Start earning.',
    text: 'Cash out right in the app',
    alt: 'Start earning.',
  },
];

const blocks = [
  {
    title: 'Know the \nbest spots \nin your City?',
    description:
      'Jumpstart a new career or kick-off your next side hustle as a Plannet Planner. Connecting with like-minded travelers coming to your city, build your brand and itineraries which best showcase your city.',
    buttonText: '',
    image: Mockup1,
    reverse: false,
    theme: 'planner',
    maxTextWidth: '56%',
  },
];

export default function BecomeAPlannerPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
  const [formatedPhoneNumber, setFormatedPhoneNumber] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [userId, setUserId] = useState<string>('');
  useEffect(() => {
    const userId = getPlannetUserIdFromLocalStorage();
    setUserId(userId);
  }, []);

  const onPhoneNumberChange = (
    newPhoneNumber: string,
    newCountryCode: string,
    newFormatedPhoneNumber: string,
  ) => {
    setPhoneNumber(newPhoneNumber);
    setCountryCode(newCountryCode);
    setFormatedPhoneNumber(newFormatedPhoneNumber);
  };

  const handleContinue = async () => {
    if (isDisabled || isLoading) return;
    setIsLoading(true);
    try {
      await sendVerificationCode({ countryCode, phoneNumber });
      dispatch(actions.setCountryCode(countryCode));
      dispatch(actions.setFormatedPhoneNumber(formatedPhoneNumber));
      dispatch(actions.setPhoneNumber(phoneNumber));
      router.push('/planner/signup');
    } catch (error) {
      setIsLoading(false);
    }
  };
  return (
    <MainLayout>
      <Introduction
        background={Background}
        title={'Become a \nPlannet Planner.'}
        description={
          "Turn your love for your city into earnings. Finally, a \njob that won't feel like work. Earn by sharing your \npassion for your city & culture with travelers."
        }
        theme="planner"
        isDisabled={isDisabled}
        setIsDisabled={setIsDisabled}
        handleContinue={handleContinue}
        onPhoneNumberChange={onPhoneNumberChange}
        isLoading={isLoading}
      />
      <Howitworks
        explanations={explanations}
        title="How it works!"
        background="#F8EFE4"
        textColor="#1F133E"
        theme="planner"
      />
      {blocks.map((block, idx) => (
        <BlockWithImage
          title={block.title}
          description={block.description}
          buttonText={block.buttonText}
          image={block.image}
          reverse={block.reverse}
          theme={block.theme}
          maxTextWidth={block.maxTextWidth}
          key={idx}
        />
      ))}
    </MainLayout>
  );
}
