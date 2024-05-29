import { getTripById } from '@/api/trip/trip.service';
import { assignBestItinerary } from '@/api/tripLeg/tripLeg.service';
import { DownloadModal } from '@/components/Modals/DownloadModal';
import { QUERY_OPTION } from '@/lib/constants';
import { persistPlannetGuestUserTripId } from '@/lib/localStorage/localStorage';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

const messages = [
  {
    icon: 'loading',
    msg: 'Looking for the perfect hotel',
  },
  {
    icon: 'check',
    msg: 'Looking for the perfect hotel',
  },
  {
    icon: 'loading',
    msg: 'Searching for unique experiences',
  },
  {
    icon: 'check',
    msg: 'Searching for unique experiences',
  },
  {
    icon: 'loading',
    msg: 'Finding the best deals for you',
  },
  {
    icon: 'check',
    msg: 'Finding the best deals for you',
  },
];

const LoadingContent = () => {
  const router = useRouter();
  const [lastCount, setLastCount] = useState(0);
  const [tripId, setTripId] = useState<any>('');
  const [modalShow, setModalShow] = useState<boolean>(false);

  useEffect(() => {
    if (router.query.id) {
      setTripId(router.query.id);
      persistPlannetGuestUserTripId(router.query.id);
    }
  }, [router]);

  const {
    isLoading: isLoadingTrip,
    data: tripData,
    refetch,
  } = useQuery(['trip', tripId], () => getTripById(tripId), {
    ...QUERY_OPTION,
    enabled: !tripId ? false : true,
  });

  const callAssignBestItinerary = async () => {
    if (
      tripData.tripLegs[0].CityId === '0' ||
      tripData.tripLegs[0].budgetThreshold === 'T_NOT_SURE' ||
      tripData.tripLegs[0].startDate === null
    ) {
      setModalShow(true);
      return;
    }
    try {
      let budget: string = '2000';
      if (
        tripData &&
        tripData.tripLegs[0] &&
        tripData.tripLegs[0].budgetThreshold === 'T_2K_3K'
      )
        budget = '3000';
      else if (
        tripData &&
        tripData.tripLegs[0] &&
        (tripData.tripLegs[0]?.budgetThreshold === 'T_3K_4K' ||
          tripData.tripLegs[0]?.budgetThreshold === 'T_4K_PLUS')
      )
        budget = '4000';

      await assignBestItinerary({
        TripLegId: tripData?.tripLegs[0].id,
        budget,
      });
    } catch (error) {
      console.log('err', error);
      router.push(`/`);
    }
    refetch();
    router.push(`/summary/${tripId}`);
  };

  useEffect(() => {
    setTimeout(() => {
      if (lastCount < messages.length) {
        setLastCount((last) => last + 1);
      }
    }, 2000);
  }, [lastCount]);

  useEffect(() => {
    if (tripData) {
      if (!tripData.itineraryEvents || !tripData.itineraryEvents.length) {
        callAssignBestItinerary();
      } else {
        router.push(`/summary/${tripId}`);
      }
    }
  }, [tripData]);

  return (
    <>
      <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-full p-6 text-center">
        <Image
          className="mx-auto"
          alt=""
          width={160}
          height={160}
          src="/assets/images/summary/summaryLoader.gif"
        />
        <div className="flex mt-10 items-center justify-center">
          {messages[lastCount] && messages[lastCount].icon == 'loading' && (
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="gray"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>

              <span className="sr-only">Loading...</span>
            </div>
          )}

          {messages[lastCount] && messages[lastCount].icon == 'check' && (
            <Image
              className="mr-2"
              alt=""
              width={20}
              height={13}
              src="/assets/images/summary/icon-check.svg"
            />
          )}
          <p className="text-center">
            {messages[lastCount] && messages[lastCount].msg}
          </p>
        </div>
      </div>
      <DownloadModal isOpen={modalShow} onClose={() => setModalShow(true)} />
    </>
  );
};

export default LoadingContent;
