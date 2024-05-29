import Loader from '@/components/Loader/Loader';
import TripSavedForLater from '@/components/Pages/Summary/GuestTrip/TripSavedForLater';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function savedForLater() {
  const router = useRouter();
  const [tripId, setTripId] = useState<any>('');
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    if (router.query.id) {
      setTripId(router.query.id);
    }
    if (router.query.startDate) {
      setFilter(`${router.query.startDate}/${router.query.endDate}`);
    }
  }, [router.query.id]);

  if (!tripId)
    return (
      <div className="main-summary-container">
        <div className="h-screen flex my-auto">
          <Loader size={50} />
        </div>
      </div>
    );

  return (
    <>
      <div className="main-summary-container">
        <TripSavedForLater tripId={tripId} filter={filter} />
      </div>
    </>
  );
}
