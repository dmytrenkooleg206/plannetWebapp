import FreezePricePage from '@/components/Pages/Summary/FreezePrice/FreezePrice';
import { getPlannetTokenFromLocalStorage } from '@/lib/localStorage/localStorage';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function price() {
  const router = useRouter();
  useEffect(() => {
    const guestUserToken = getPlannetTokenFromLocalStorage();
    if (!guestUserToken) {
      router.push('/signin');
    }
  }, []);
  return (
    <div className="main-summary-container">
      <FreezePricePage from="summary" />
    </div>
  );
}
