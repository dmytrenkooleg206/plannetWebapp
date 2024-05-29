import MainLayout from '@/components/layouts/MainLayout';
import PNModal from '@/components/Modals/PNModal';
import React, { useState } from 'react';
import Hotel from '@/components/Pages/LandingPage/SectionsV2/images/hotel.svg';
import Voice from '@/components/Pages/LandingPage/SectionsV2/images/voice.svg';
import Plannet from '@/components/Pages/LandingPage/SectionsV2/images/plannet.svg';
import { useQuery } from 'react-query';
import { getWebFeed } from '@/api/web/web.service';
import { QUERY_OPTION } from '@/lib/constants';
import GetTextToPlannet from '@/components/layouts/MainLayout/GetTextToPlannet';
import TextToPlannet from './SectionsV2/TextToPlannet';
import Match from './SectionsV2/Match';
import Introduction from './SectionsV2/Introduction';
import PlannetMonthelyTexts from './SectionsV2/PlannetMonthelyText';
import monthlyTextImg from '../../../../public/assets/images/V2Images/plannetMontly.png';

export default function LandingPage() {
  const [getStartedOpen, setGetStartedOpen] = useState(false);
  const { isSuccess, data } = useQuery('feedv2', getWebFeed, QUERY_OPTION);

  const handleGetStartedOpen = (open: boolean) => () => {
    setGetStartedOpen(open);
  };

  return (
    <MainLayout>
      <Introduction
        handleGetStartedOpen={handleGetStartedOpen}
        isSuccess={isSuccess}
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
      <PlannetMonthelyTexts
        heading="Plannet"
        title="Monthly Texts"
        subTitle="We text you trip ideas on a monthly basis. You just text the number back and then we make it happen!"
        image={monthlyTextImg}
        theme="plannet"
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
