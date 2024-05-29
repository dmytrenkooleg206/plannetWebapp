/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from 'react';
import { PaymentDetails } from '@/components/Pages/Summary';
import { useRouter } from 'next/router';
import { getPlannetTokenFromLocalStorage } from '@/lib/localStorage/localStorage';

export default function paymentDetails() {
  const router = useRouter();

  useEffect(() => {
    const guestUserToken = getPlannetTokenFromLocalStorage();
    if (!guestUserToken) {
      router.push('/signin');
    }
  }, []);

  return (
    <div className="main-summary-container">
      <PaymentDetails from="summary" />
    </div>
  );
}
