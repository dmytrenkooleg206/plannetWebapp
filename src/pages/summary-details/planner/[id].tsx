import { getGuestTripById } from '@/api/trip/trip.service';
import Loader from '@/components/Loader/Loader';
import PlannerDetailPage from '@/components/Pages/Summary/Planner/PlannerPage';
import { QUERY_OPTION } from '@/lib/constants';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

export default function PlannerPage() {
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
    { ...QUERY_OPTION, enabled: !tripId ? false : true },
  );

  useEffect(() => {
    if (router.query.id) {
      setTripId(router.query.id);
    }
    if (router.query.startDate) {
      setFilter(`${router.query.startDate}/${router.query.endDate}`);
    }
  }, [router]);

  if (!tripId && isLoadingTrip) {
    return (
      <div className="main-summary-container">
        <div className="h-screen flex my-auto">
          <Loader size={50} color="white" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="main-summary-container">
        <PlannerDetailPage tripData={tripData} />
      </div>
    </>
  );
}
