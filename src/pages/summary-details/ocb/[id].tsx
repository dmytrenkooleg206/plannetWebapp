import React, { useEffect, useState } from 'react';
import { PaymentDetails } from '@/components/Pages/Summary';
import { useRouter } from 'next/router';
import { getPlannetTokenFromLocalStorage } from '@/lib/localStorage/localStorage';
import Loader from '@/components/Loader/Loader';

export default function paymentDetails() {
  const router = useRouter();

  const [tripId, setTripId] = useState<any>('');

  useEffect(() => {
    if (router.query.id) {
      setTripId(router.query.id);
    }
  }, [router.query.id]);

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
        <PaymentDetails from="summary-details" />
      </div>
    </>
  );
}
