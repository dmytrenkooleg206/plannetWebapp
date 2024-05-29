import { LoadingScreen } from '@/components/Pages/Summary';
import {
  getPlannetGuestUserTokenFromLocalStorage,
  getPlannetTokenFromLocalStorage,
  persistPlannetGuestUserTripId,
} from '@/lib/localStorage/localStorage';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Summary() {
  const router = useRouter();
  const [tripId, setTripId] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (router.query.id) setTripId(router.query.id);
  }, [router]);

  useEffect(() => {
    const guestUserToken = getPlannetTokenFromLocalStorage();
    if (!guestUserToken) {
      // persistPlannetGuestUserTripId(tripId);
      router.push('/signin');
    } else {
      setUser(guestUserToken);
    }
  }, [tripId]);
  // useEffect(() => {
  //   const guestUserToken = getPlannetGuestUserTokenFromLocalStorage();
  //   if (!guestUserToken) {
  //     persistPlannetGuestUserTripId(tripId);
  //     router.push('/login');
  //   } else {
  //     setUser(guestUserToken);
  //   }
  // }, [tripId]);

  if (typeof window == undefined) return null;
  if (user) return <LoadingScreen />;
}
