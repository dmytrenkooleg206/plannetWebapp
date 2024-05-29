import MainLayout from '@/components/layouts/MainLayout';
import GetStarted from '@/components/layouts/MainLayout/GetStarted';
import PNModal from '@/components/Modals/PNModal';
import React, { useState } from 'react';
import BlockWithImage from '@/components/Pages/Plannetlinks/SectionsV2/BlockWithImage';
import GetTextToPlannet from '@/components/layouts/MainLayout/GetTextToPlannet';
import Howitworks from '../LandingPage/SectionsV2/Howitworks';
import Introduction from './SectionsV2/Introduction';
// IMAGES
import Background from '../../../../public/assets/images/V2Images/backgroundPlannetlinks.webp';
import Mockup1 from '../../../../public/assets/images/V2Images/mockup1.webp';
import Mockup2 from '../../../../public/assets/images/V2Images/mockup2.webp';
import Mockup3 from '../../../../public/assets/images/V2Images/mockup3.webp';
import Map from './images/map.svg';
import Link from './images/link.svg';
import Money from './images/money.svg';

const explanations = [
  {
    id: 1,
    img: Map,
    text: (
      <span>
        Create the{' '}
        <b>
          perfect <br />
          trip
        </b>{' '}
        with Plannet.
      </span>
    ),
    alt: 'Create the perfect trip with Plannet.',
  },
  {
    id: 2,
    img: Link,
    text: (
      <span>
        <b>Share</b> with you <br />
        community/audience.
      </span>
    ),
    alt: 'Share with you community/audience.',
  },
  {
    id: 3,
    img: Money,
    text: (
      <span>
        Start <b>earning</b>. <br />
        And cash out right in the app
      </span>
    ),
    alt: 'Start earning. And cash out right in the app',
  },
];

const blocks = [
  {
    title: 'Create the perfect trip with Plannet.',
    description:
      'Get Plannet Links to showcase your travel experiences and help your followers do the city right! ',
    buttonText: 'Get Plannet Links',
    image: Mockup1,
    reverse: false,
    theme: '',
    maxTextWidth: '60%',
  },
  {
    title: 'Share your knowledge.',
    description: 'Showcase your travels with itineraries on your social media.',
    buttonText: '',
    image: Mockup2,
    reverse: true,
    theme: 'dark',
    maxTextWidth: '38%',
  },
  {
    title: 'Get paid for your travel expertise.',
    description:
      'Get rewarded for every booking made through your unique link. Inspire your followers to book their dream trips with Plannet, and start earning on every booking!',
    buttonText: '',
    image: Mockup3,
    reverse: false,
    theme: '',
    maxTextWidth: '51%',
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
        title={'Your own \ntravel agency.'}
        description="Get paid for your travel expertise. Plan itineraries for your community with Plannet Links and start earning!"
        buttonText="Get Plannet Links"
        theme="dark"
      />
      <Howitworks
        explanations={explanations}
        title="How it Works!"
        background="#1F133E"
        textColor="#FFFFFF"
        theme="plannet"
      />
      {blocks.map((block, index) => (
        <BlockWithImage
          handleGetStartedOpen={handleGetStartedOpen}
          title={block.title}
          description={block.description}
          buttonText={block.buttonText}
          image={block.image}
          reverse={block.reverse}
          theme={block.theme}
          maxTextWidth={block.maxTextWidth}
          key={index}
        />
      ))}
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
