import Loader from '@/components/Loader/Loader';
import FreezePricePage from '@/components/Pages/Summary/FreezePrice/FreezePrice';
import { getPlannetTokenFromLocalStorage } from '@/lib/localStorage/localStorage';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
export default function price() {
  const router = useRouter();

  const [tripId, setTripId] = useState<any>('');

  useEffect(() => {
    if (router.query.id) {
      setTripId(router.query.id);
    }
  }, [router]);

  useEffect(() => {
    const guestUserToken = getPlannetTokenFromLocalStorage();
    if (!guestUserToken) {
      router.push('/signin');
    }
  }, []);

  if (!tripId)
    return (
      <div className="h-screen flex my-auto bg-[#1F133E] text-white">
        <Loader color="white" size={50} />
      </div>
    );

  return (
    <>
      <div className="main-summary-container">
        <FreezePricePage from="summary-details" />
      </div>
    </>
  );
}
