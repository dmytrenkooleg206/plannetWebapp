import MainLayout from '@/components/layouts/MainLayout';
import PNModal from '@/components/Modals/PNModal';
import React, { useState } from 'react';
import BusinessContact from '@/components/Pages/PlannetBusiness/SectionsV2/BusinessContact';
import GetTextToPlannet from '@/components/layouts/MainLayout/GetTextToPlannet';
import Howitworks from '../LandingPage/SectionsV2/Howitworks';
import Introduction from './SectionsV2/Introduction';
// IMAGES
import Background from '../../../../public/assets/images/V2Images/backgroundPlannetBusiness.jpg';
import Plane from './images/plane.svg';
import HotelBooking from './images/hotelbooking.svg';
import Restaurant from './images/restaurant.svg';

const explanations = [
  {
    id: 1,
    img: Plane,
    text: (
      <span>
        Private, Semi-private and <br /> commercial flight bookings
      </span>
    ),
    alt: 'Private, Semi-private and commercial flight bookings',
  },
  {
    id: 2,
    img: HotelBooking,
    text: <span>Hotel Bookings</span>,
    alt: 'Share with you community/audience.',
  },
  {
    id: 3,
    img: Restaurant,
    text: <span>Restaurant Reservations</span>,
    alt: 'Restaurant Reservations',
  },
];

export default function PlannetlinksPage() {
  const [getStartedOpen, setGetStartedOpen] = useState(false);

  const handleGetStartedOpen = (open: boolean) => () => {
    setGetStartedOpen(open);
  };

  return (
    <MainLayout>
      <Introduction
        handleGetStartedOpen={handleGetStartedOpen}
        background={Background}
        title={'Plannet \nFor Business'}
        description="You focus on your business and we focus on getting your team into all the right rooms."
        buttonText="Learn More"
        theme="dark"
      />
      <Howitworks
        explanations={explanations}
        title="How it Works!"
        subtitle="All bookings and reservation requests can be made via text message or phone call to your business's personal travel line"
        background="#1F133E"
        textColor="#FFFFFF"
        theme="plannet"
      />
      <BusinessContact />
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
