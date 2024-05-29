import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import HotelDetails from '@/components/Pages/Summary/Hotel/HotelDetails';
import Loader from '@/components/Loader/Loader';

export default function hotelDetails() {
  const router = useRouter();
  const [tripId, setTripId] = useState<any>('');
  const [hotelId, setHotelId] = useState<any>('');

  useEffect(() => {
    if (router.query.id) {
      setTripId(router.query.id);
      setHotelId(router.query.hotelId);
    }
  }, [router]);

  if (!tripId)
    return (
      <div className="main-summary-container">
        <div className="h-screen flex my-auto bg-[#1F133E] text-white">
          <Loader color="white" size={50} />
        </div>
      </div>
    );
  return (
    <>
      <div className="main-summary-container">
        <HotelDetails tripId={tripId} hotelId={hotelId} />
      </div>
    </>
  );
}
