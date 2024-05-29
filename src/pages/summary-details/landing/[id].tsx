import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getGuestTripById } from '@/api/trip/trip.service';
import LoadingScreen from '@/components/Pages/Summary/GuestTrip/LoadingScreen';
import { QUERY_OPTION } from '@/lib/constants';
import SplashScreen from '@/components/SplashScreen/SplashScreen';
import { analyticsEvents } from '@/lib/analytics';

export default function LandingScreen() {
  const router = useRouter();
  const [tripId, setTripId] = useState<any>('');
  const [filter, setFilter] = useState<string>('');

  let pageUrl = '';
  if (typeof window !== 'undefined') {
    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : '';
    pageUrl = `${origin}${router.asPath}`;
  }
  const { isLoading: isLoadingTrip, data: tripData } = useQuery(
    ['trip_details'],
    () => getGuestTripById(tripId, filter),
    { ...QUERY_OPTION, enabled: !!tripId },
  );

  useEffect(() => {
    if (router.query.id) {
      setTripId(router.query.id);
    }
    if (router.query.startDate) {
      setFilter(`${router.query.startDate}/${router.query.endDate}`);
    }
  }, [router]);

  useEffect(() => {
    analyticsEvents('VIEW_PLANNER_PAGE');
  }, []);

  if (!tripId || isLoadingTrip)
    return (
      <div className="main-summary-container">
        <SplashScreen color="#fff" size={50} />
      </div>
    );

  return (
    <>
      <div className="main-summary-container">
        <LoadingScreen tripData={tripData} />
      </div>
    </>
  );
}
