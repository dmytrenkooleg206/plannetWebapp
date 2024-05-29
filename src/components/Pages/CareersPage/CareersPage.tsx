import MainLayout from '@/components/layouts/MainLayout';
import React from 'react';
import BackgroundMobile from '../../../../public/assets/images/V2Images/backgroundCareer-mobile.webp';
import Background from '../../../../public/assets/images/V2Images/career-desktop.png';
import Careers from './SectionsV2/Careers';
import Introduction from './Introduction';

export default function CareersPage() {
  return (
    <MainLayout>
      <Introduction
        background={Background}
        backgroundMobile={BackgroundMobile}
        title="Join Us"
        description="Please email hello@plannet.io with your resume and the position you are interested in! We are excited for you to join us and help build our community on it’s mission to see the world together."
        theme="careers"
      />
      <Careers />
    </MainLayout>
  );
}
