import Loader from '@/components/Loader/Loader';
import ExperienceDetailsPage from '@/components/Pages/Summary/Experiences/ExperienceDetailsPage';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function experienceDetails() {
  const router = useRouter();
  const [tripId, setTripId] = useState<string>('');
  const [expId, setExpId] = useState<string>('');
  useEffect(() => {
    if (router.query.id) {
      setTripId(String(router.query.id));
      setExpId(String(router.query.expId));
    }
  }, [router]);

  if (!tripId)
    return (
      <div className="min-h-[100dvh] flex my-auto bg-[#1F133E] text-white">
        <Loader color="white" size={50} />
      </div>
    );
  return (
    <>
      <div className="main-summary-container">
        <ExperienceDetailsPage tripId={tripId} expId={expId} />
      </div>
    </>
  );
}
