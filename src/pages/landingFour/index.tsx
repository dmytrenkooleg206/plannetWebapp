import React, { useState } from 'react';
import IntroductionWithImage from '@/components/Pages/LandingPage/NewIntroduction';
import MainLayout from '@/components/layouts/MainLayout';
import TextToPlannet from '@/components/Pages/LandingPage/SectionsV2/TextToPlannet';
import { getWebFeed } from '@/api/web/web.service';
import { QUERY_OPTION } from '@/lib/constants';
import { useQuery } from 'react-query';
import Match from '@/components/Pages/LandingPage/SectionsV2/Match';
import PNModal from '@/components/Modals/PNModal';
import GetTextToPlannet from '@/components/layouts/MainLayout/GetTextToPlannet';
import landingFourDesktop from '../../../public/assets/images/V2Images/landingFourDesktop.webp';
import landingFourMobile from '../../../public/assets/images/V2Images/landingFourMobile.webp';

function LandingWithImage() {
  const [getStartedOpen, setGetStartedOpen] = useState(false);
  const { isSuccess, data } = useQuery('feedv2', getWebFeed, QUERY_OPTION);

  const handleGetStartedOpen = (open: boolean) => () => {
    setGetStartedOpen(open);
  };
  return (
    <MainLayout>
      <IntroductionWithImage
        deskTopImage={landingFourDesktop}
        mobileImage={landingFourMobile}
        handleGetStartedOpen={handleGetStartedOpen}
        isSuccess={isSuccess}
        title={'We plan,\nyou travel.'}
        description="Text us what you like and we plan and book the best itinerary for your next trip. We help with flights, hotels and restaurant reservations."
      />
      <TextToPlannet
        handleGetStartedOpen={handleGetStartedOpen}
        title="Text To Plannet"
        background="#1F133E"
        textColor="#FFFFFF"
        theme="plannet"
      />
      <Match
        handleGetStartedOpen={handleGetStartedOpen}
        isSuccess={isSuccess}
        data={data}
        title="A friend in every city"
        subtitle="We find your perfect match. Someone on the same wave length. Whether you want to explore the culture, feel the nightlife or taste the best food the city has to offer, we got you!"
      />
      <PNModal
        isOpen={getStartedOpen}
        onClose={handleGetStartedOpen(false)}
        isDark={false}
        noPadding
        maxWidth="max-w-[500px]"
        fitContent
      >
        <GetTextToPlannet
          onClose={handleGetStartedOpen(false)}
          title="Text Plannet to plan and book the best itinerary 
          for your next trip"
        />
      </PNModal>
    </MainLayout>
  );
}

export default LandingWithImage;
