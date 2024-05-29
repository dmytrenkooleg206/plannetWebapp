import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getPlannetTokenFromLocalStorage } from '@/lib/localStorage/localStorage';
import { Dashboard } from '@/components/Pages/Summary';
import Loader from '@/components/Loader/Loader';

export default function SummaryDashboard() {
  const router = useRouter();
  const [tripId, setTripId] = useState<any>('');

  useEffect(() => {
    if (router.query.id) {
      setTripId(router.query.id);
    }
  }, [router]);

  useEffect(() => {
    // const guestUserToken = getPlannetTokenFromLocalStorage();
    // if (!guestUserToken) {
    //   router.push('/signin');
    // }
  }, []);

  if (!tripId)
    return (
      <div className="h-screen flex my-auto">
        <Loader color="white" size={50} />
      </div>
    );

  return (
    <div className="main-summary-container">
      <Dashboard tripId={tripId} />
    </div>
  );
}
