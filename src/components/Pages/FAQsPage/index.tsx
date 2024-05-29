import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import MainLayout from '@/components/layouts/MainLayout';
import GetStarted from '@/components/layouts/MainLayout/GetStarted';
import PNModal from '@/components/Modals/PNModal';
import { QUERY_OPTION } from '@/lib/constants';
import GetTextToPlannet from '@/components/layouts/MainLayout/GetTextToPlannet';
import { getALLFAQs } from '@/api/fag/faq.service';
import Background from '../../../../public/assets/images/V2Images/faq.png';
import BackgroundMobile from '../../../../public/assets/images/V2Images/faq.webp';
// import Careers from './SectionsV2/Careers';
import Introduction from './Introduction';
import FAQContent from './FAQContent';

export default function FAQsPage() {
  const [getStartedOpen, setGetStartedOpen] = useState<boolean>(false);
  const [faqs, setFaqs] = useState<any>(null);

  const handleGetStartedOpen = (open: boolean) => () => {
    setGetStartedOpen(open);
  };

  const { isSuccess, data } = useQuery('faqs', getALLFAQs, QUERY_OPTION);

  useEffect(() => {
    if (isSuccess && data) {
      console.log('####', data);
      setFaqs(data);
    }
  }, [isSuccess, data]);

  return (
    <MainLayout>
      <Introduction
        background={Background}
        backgroundMobile={BackgroundMobile}
        title="FAQs"
        description="Frequently asked questions about Plannet!"
        theme="Faq"
      />
      <FAQContent contentFAQs={faqs} />
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
