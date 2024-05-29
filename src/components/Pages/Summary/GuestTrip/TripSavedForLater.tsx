import { getGuestTripById } from '@/api/trip/trip.service';
import Loader from '@/components/Loader/Loader';
import { QUERY_OPTION } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useQuery } from 'react-query';

export default function TripSavedForLater({ tripId, filter }: any) {
  const router = useRouter();
  const { isLoading: isLoadingTrip, data: tripData }: any = useQuery(
    ['trip_details'],
    () => getGuestTripById(tripId, filter),
    {
      ...QUERY_OPTION,
    },
  );

  const backToHome = () => {
    router.push(
      router.query.startDate && router.query.startDate !== ''
        ? `/summary-details/${router.query.id}?startDate=${router.query.startDate}&endDate=${router.query.endDate}`
        : `/summary-details/${router.query.id}`,
    );
  };

  return (
    <>
      {isLoadingTrip ? (
        <div className="min-h-[100dvh] flex my-auto">
          <Loader size={50} color="white" />
        </div>
      ) : (
        <div className="min-h-[100dvh] w-full bg-[#1F133E] pt-16 text-white text-center">
          <div className="mt-8">
            <Image
              className="mx-auto my-8"
              alt=""
              width={120}
              height={120}
              src="/assets/images/summary/heart-image.png"
            />
          </div>
          <div className="mt-8 ">
            <p className="text-[24px]  text-center font-[400]">
              You just saved <br />
              Trip To{' '}
              <span className="font-[700]">
                {tripData.tripLegs[0].City.name}
              </span>
            </p>
          </div>

          {/* <div className="mt-20">
            <Image
              className="mx-auto"
              alt=""
              width={120}
              height={120}
              src="/assets/images/summary/logo.png"
            />
          </div>
          <div className="flex justify-center mt-4">
            <Link href={`${process.env.NEXT_PUBLIC_APP_STORE}`} target="blank">
              <img
                className="max-w-[190px] w-full h-full pr-2"
                src="/assets/images/landingpage/app_store.png"
                alt="app store"
              />
            </Link>
          </div> */}
          <div className="mt-20">
            <div className="flex flex-col items-center justify-center mt-4">
              <p className="text-xl leading-5 font-bold">
                Download the Plannet App
              </p>
              <p className="text-lg font-light mb-3">to view your favorites</p>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_STORE}`}
                target="blank"
              >
                <Image
                  width={400}
                  height={400}
                  className="max-w-[190px] w-full h-full pr-2"
                  src="/assets/images/landingpage/app_store.webp"
                  alt="app store"
                />
              </Link>
            </div>
          </div>

          <div className="absolute bottom-8 w-full">
            <button onClick={() => backToHome()}>
              <p className="text-[16px] font-[300] underline ">Back to trip</p>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
