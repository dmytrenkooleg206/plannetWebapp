/* eslint-disable import/extensions */
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { StaticImageData } from 'next/image';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layouts/MainLayout';
import { sendVerificationCode } from '@/api/auth/auth.service';
import { useQuery } from 'react-query';
import { getWebFeed } from '@/api/web/web.service';
import { QUERY_OPTION } from '@/lib/constants';
import { actions } from '@/store/phone/phone.slice';
import { useWindowSize } from '@/hooks/useWindowSize';
import monthlyTextDesktop from './images/monthlyTextDesktop.png';
import monthlyTextTablet from './images/monthlyTextTablet.png';
import monthlyTextMobile from './images/monthlyTextMobile.png';
import Introduction from './Introduction';
import travelStyle from './images/travelStyle.svg';
import monthlyLink from './images/monthlyLink.svg';
import testingBack from './images/testingBack.svg';
import Howitworks from '../LandingPage/SectionsV2/Howitworks';
import Match from '../LandingPage/SectionsV2/Match';
import Places from './Places/Places';
import france from './images/france.webp';
import miami from './images/dubai.webp';
import mexico from './images/maxico.webp';
import losAngeles from './images/losAngeles.webp';
import london from './images/london.webp';
import barcelona from './images/barcelona.webp';
import newYork from './images/newYork.webp';
import miamiBeach from './images/miamiBeach.webp';
import PlannetMonthelyTexts from '../LandingPage/SectionsV2/PlannetMonthelyText';
import monthlyTextImg from '../../../../public/assets/images/V2Images/plannetMonthlyText.png';

const explanations = [
  {
    id: 1,
    img: travelStyle,
    title:
      '<p className="!font-[700]">Tell us about your \n<b className="!font-[400]">travel style</b></p>',
    alt: 'travel style',
  },
  {
    id: 2,
    img: monthlyLink,
    title:
      '<p className="!font-[700]">We text you custom unique \n<b className="!font-[400]">trip itineraries monthly</b></p>',
    alt: 'trip itineraries monthly',
  },
  {
    id: 3,
    img: testingBack,
    title:
      '<p className="!font-[700]">Book easily by just \n<b className="!font-[400]">texting back</b></p>',
    alt: 'texting back',
  },
];

interface HomebaseSchema {
  namme: string;
  country: string;
}

interface PlacesSchema {
  id: number;
  firstName: string;
  HomeBase: HomebaseSchema;
  title: string;
  image: string | StaticImageData;
}

export type PlacesInterface = PlacesSchema[];

const placesArr: PlacesInterface = [
  {
    id: 1,
    firstName: 'A Parisian Adventure',
    HomeBase: { namme: 'Paris', country: 'France' },
    title:
      'Eiffel, Montmartre, Louvre, Seine cruise, gourmet dinner—a perfect Parisian day.',
    image: france,
  },
  {
    id: 2,
    firstName: 'A Journey Through Opulence',
    HomeBase: { namme: 'Dubai', country: 'United Arab Emirates' },
    title:
      'Skyscrapers, souks, desert safari, beach, mall, fountain, seafood, culture.',
    image: miami,
  },
  {
    id: 3,
    firstName: "Exploring Mexico City's Rich Heritage",
    HomeBase: { namme: 'Mexixo City', country: 'Maxico' },
    title:
      'Mexico City: Ancient Ruins, Art, Cuisine, and Urban Adventures Await You.',
    image: mexico,
  },
  {
    id: 4,
    firstName: 'A Journey through Los Angeles',
    HomeBase: { namme: 'Los Angeles', country: 'United States' },
    title:
      'LA: Celebrities, Beaches, Culture, Cuisine - Discover the City of Dreams!',
    image: losAngeles,
  },
  {
    id: 5,
    firstName: 'A Cultural Capital Expedition',
    HomeBase: { namme: 'London', country: 'England' },
    title:
      'London: Royalty, History, Arts, Cuisine - Explore the Heart of England!',
    image: london,
  },
  {
    id: 6,
    firstName: 'Sun, Sea, and Surreal Architecture',
    HomeBase: { namme: 'Barcelona', country: 'Spain' },
    title:
      "Barcelona: Gaudí's Masterpieces, Beaches, Tapas - A Catalan Adventure Awaits!",
    image: barcelona,
  },
  {
    id: 7,
    firstName: "A Journey through New York's Icons",
    HomeBase: { namme: 'New York', country: 'United States' },
    title:
      'New York, New York: Skyline Spectacles, Cultural Marvels, and Culinary Delights Await!',
    image: newYork,
  },
  {
    id: 8,
    firstName: 'Sun, Sand, and Style in Miami',
    HomeBase: { namme: 'Miami', country: ' United States' },
    title:
      "Sun, Art, Latin Rhythms: Immerse in Miami's Vibrant Culture and Coastal Charm.",
    image: miamiBeach,
  },
];

const MOBILE_SCREEN = 1024;

function MonthlyTexts() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { width } = useWindowSize();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
  const [formatedPhoneNumber, setFormatedPhoneNumber] = useState<string>('');

  const { isSuccess, data } = useQuery('feedv2', getWebFeed, QUERY_OPTION);

  const isMobile = useMemo(() => width && width <= MOBILE_SCREEN, [width]);

  const [getStartedOpen, setGetStartedOpen] = useState(false);

  const handleGetStartedOpen = (open: boolean) => () => {
    setGetStartedOpen(open);
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

  const handleContinue = async () => {
    if (isDisabled || isLoading) return;
    setIsLoading(true);
    try {
      await sendVerificationCode({ countryCode, phoneNumber });
      dispatch(actions.setCountryCode(countryCode));
      dispatch(actions.setFormatedPhoneNumber(formatedPhoneNumber));
      dispatch(actions.setPhoneNumber(phoneNumber));
      router.push('/plannetMonthlyTexts/signup');
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <Introduction
        backgroundDesktop={monthlyTextDesktop}
        backgroundTablet={monthlyTextTablet}
        backgroundMobile={monthlyTextMobile}
        title={'Your new,\n travel assistant.'}
        description={
          "We know you are busy and don't have time to constantly be planning! So you set your preferences and  we do it for you."
        }
        theme="planner"
        isDisabled={isDisabled}
        setIsDisabled={setIsDisabled}
        handleContinue={handleContinue}
        onPhoneNumberChange={onPhoneNumberChange}
        isLoading={isLoading}
      />
      <Howitworks
        background="#1F133E"
        explanations={explanations}
        title="How it Works!"
        textColor="#FFFFFF"
        theme="plannet"
      />
      <Places data={placesArr} handleGetStartedOpen={handleGetStartedOpen} />
      <Match
        handleGetStartedOpen={handleGetStartedOpen}
        isSuccess={isSuccess}
        data={data}
        title="Created and customized by our local Planners"
      />
      <PlannetMonthelyTexts
        heading="Plannet"
        title="Monthly Texts"
        subTitle="We text you trip ideas on a monthly basis. You just text the number back and then we make it happen!"
        image={monthlyTextImg}
        theme="plannet"
      />
    </MainLayout>
  );
}

export default MonthlyTexts;
