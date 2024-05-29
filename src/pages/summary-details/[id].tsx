import Loader from '@/components/Loader/Loader';
import { GuestDashboard } from '@/components/Pages/Summary';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
export default function SummaryDashboard() {
  const router = useRouter();
  const [tripId, setTripId] = useState<any>('');
  useEffect(() => {
    if (router.query.id) {
      setTripId(router.query.id);
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
        <GuestDashboard tripId={tripId} />
      </div>
    </>
  );
}
