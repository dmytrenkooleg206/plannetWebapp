import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { Tab } from '@headlessui/react';

import Loader from '@/components/Loader/Loader';
import DashboardHeader from '@/components/Header/Headers/DashboardHeader';
import { ItineraryTab, GuestsTab } from '@/components/Pages/Dashboard/Tabs';
import { TripEditModal } from '@/components/Modals/TripEditModal';
import { EditDateModal } from '@/components/Modals/EditDateModal';
import TextSkeleton from '@/components/Skeletons/TextSkeleton';

import { getUserById } from '@/api/user/user.service';
import {
  getTripById,
  updateTripNameById,
  updateTripDatesById,
  updateTripPermissionsById,
} from '@/api/trip/trip.service';

import { QUERY_OPTION } from '@/lib/constants';
import { getFormattedDate } from '@/lib/utils';
import { getPlannetUserIdFromLocalStorage } from '@/lib/localStorage/localStorage';

import { queryClient } from '@/pages/_app';
import useChangeBgImage from '@/hooks/useChangeBgImage';

type TripDashboardProps = {
  tripId: string;
};

const tabs = [
  {
    text: 'Itinerary',
    image: '/assets/images/dashboard/itinerary.svg',
  },
  {
    text: 'Expenses',
    image: '/assets/images/dashboard/expenses.svg',
  },
  {
    text: 'Guests',
    image: '/assets/images/dashboard/guests.svg',
  },
  {
    text: 'Album',
    image: '/assets/images/dashboard/album.svg',
  },
  {
    text: 'Planner chat',
    image: '/assets/images/dashboard/chat.svg',
  },
];

export default function TripDashboard({ tripId }: TripDashboardProps) {
  const router: any = useRouter();
  const [isEditTripModalOpen, setIsEditTripModalOpen] =
    useState<boolean>(false);
  const [isEditDateModalOpen, setIsEditDateModalOpen] =
    useState<boolean>(false);

  const [isUpdatingName, setIsUpdatingName] = useState<boolean>(true);
  const [isUpdatingDates, setIsUpdatingDates] = useState<boolean>(true);

  const bgChangingContainer = useChangeBgImage();

  const {
    isLoading: isLoadingUser,
    data: userData,
    isError: userError,
  } = useQuery(
    'current_user',
    () => getUserById(getPlannetUserIdFromLocalStorage()),
    {
      ...QUERY_OPTION,
      onSuccess: (data: any) => {
        if (!data) router.push('/signin');
      },
    },
  );

  const {
    isLoading: isLoadingTrip,
    data: tripData,
    isError: tripError,
  } = useQuery(['trip', tripId], () => getTripById(tripId), QUERY_OPTION);

  useEffect(() => {
    if (userError) {
      router.push('/');
    }
  }, [userError, router]);

  useEffect(() => {
    if (tripError) {
      router.push('/');
    }
  }, [tripError, router]);

  useEffect(() => {
    if (tripData) {
      if (isUpdatingName) setIsUpdatingName(false);
      if (isUpdatingDates) setIsUpdatingDates(false);
    }
  }, [tripData, isUpdatingName, isUpdatingDates]);

  const handleUpdateTrip = async (newTitle: string, permissions: any) => {
    setIsUpdatingName(true);
    try {
      await updateTripNameById(tripId, newTitle);
      await updateTripPermissionsById(tripId, permissions);
      queryClient.invalidateQueries(['trip', tripId]);
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const handleUpdateDates = async (range: any[]) => {
    try {
      const datesData: any = {
        startDate: getFormattedDate(range[0]),
        endDate: getFormattedDate(range[1]),
      };

      setIsUpdatingDates(true);
      await updateTripDatesById(tripId, datesData);
      queryClient.invalidateQueries(['trip', tripId]);
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const sortedUsers = useMemo(() => {
    if (!tripData) return [];
    return tripData.users.sort((user1: any, user2: any) => {
      // Sort by user type
      if (user1.TripGuest.isPlanner && !user2.TripGuest.isPlanner) {
        return -1;
      }
      if (!user1.TripGuest.isPlanner && user2.TripGuest.isPlanner) {
        return 1;
      }
      if (user1.TripGuest.isHost && !user2.TripGuest.isHost) {
        return -1;
      }
      if (!user1.TripGuest.isHost && user2.TripGuest.isHost) {
        return 1;
      }
      if (user1.TripGuest.isCoHost && !user2.TripGuest.isCoHost) {
        return -1;
      }
      if (!user1.TripGuest.isCoHost && user2.TripGuest.isCoHost) {
        return 1;
      }

      // Sort by attendingStatus
      const attendingStatusOrder = ['YES', 'PENDING', 'NO'];
      const attendingStatus1 = attendingStatusOrder.indexOf(
        user1.TripGuest.attendingStatus,
      );
      const attendingStatus2 = attendingStatusOrder.indexOf(
        user2.TripGuest.attendingStatus,
      );
      if (attendingStatus1 !== attendingStatus2) {
        return attendingStatus1 - attendingStatus2;
      }

      // Default: Maintain the original order if all criteria are the same
      return 0;
    });
  }, [tripData?.users]);

  if (isLoadingUser || isLoadingTrip || !userData || !tripData)
    return (
      <div className="h-screen flex my-auto">
        <Loader size={50} />
      </div>
    );

  return (
    <div className="text-white">
      <div
        ref={bgChangingContainer}
        className="h-full w-full bg-[url('/assets/images/backgrounds/image-1.webp')] fixed top-0 left-0 z-[-1] bg-no-repeat bg-cover overflow-y-scroll"
      />
      <div className="h-full w-full bg-[rgba(0,0,0,0.85)] fixed top-0 left-0 z-[-1]" />

      <DashboardHeader
        user={userData.user}
        onUpdate={() => !isUpdatingName && setIsEditTripModalOpen(true)}
        tripName={tripData.trip.name}
      />
      <div className="flex pt-3.5 md:pt-7">
        <div className="max-w-[1200px] w-full mx-auto px-6 flex flex-col">
          <div className="text-white-700 text-2xl flex">
            <div className="mr-1">
              <Link href="/home">Home</Link> /
            </div>
            {isUpdatingName ? (
              <div role="status" className="max-w-sm animate-pulse flex">
                <div className="h-4 bg-white-200 rounded-full dark:bg-white-600 w-40 my-auto" />
              </div>
            ) : (
              <span className="text-white">{tripData.trip.name}</span>
            )}
          </div>
          <div className="py-3.5 md:py-7 flex flex-wrap">
            <div
              className="hidden md:block bg-black py-5 px-6 text-6xl rounded-md flex mr-auto cursor-pointer max-w-[500px] hover:border-primary border-2 border-black"
              role="presentation"
              onClick={() => !isUpdatingName && setIsEditTripModalOpen(true)}
            >
              {isUpdatingName ? (
                <TextSkeleton />
              ) : (
                <div className="flex">
                  <div className="truncate">{tripData.trip.name}</div>
                  <img
                    className="ml-2"
                    src="/assets/images/dashboard/pen.svg"
                    alt="pen"
                  />
                </div>
              )}
            </div>
            <button
              className="bg-black py-2.5 md:py-4 px-3 md:px-6 text-base md:text-3xl rounded-md flex my-auto mr-3 border-solid border-2 border-white-200 cursor-pointer hover:border-primary"
              type="button"
              onClick={() => {
                if (isUpdatingDates) return;
                setIsEditDateModalOpen(true);
              }}
            >
              <img
                className="mr-2 max-w-[30px] my-auto"
                src="/assets/images/dashboard/date.svg"
                alt="date"
              />
              {isUpdatingDates ? (
                <TextSkeleton />
              ) : (
                <div
                  className={`flex my-auto ${
                    tripData.trip.startDate
                      ? 'underline underline-offset-8'
                      : 'text-white-700'
                  }`}
                >
                  {tripData.trip.startDate
                    ? getFormattedDate(tripData.trip.startDate)
                    : 'Add Start Date'}
                </div>
              )}
            </button>
            <button
              className="bg-black py-2.5 md:py-4 px-3 md:px-6 text-base md:text-3xl rounded-md flex my-auto border-solid border-2 border-white-200 cursor-pointer hover:border-primary"
              type="button"
              onClick={() => {
                if (isUpdatingDates) return;
                setIsEditDateModalOpen(true);
              }}
            >
              <img
                className="mr-2 max-w-[30px] my-auto"
                src="/assets/images/dashboard/date.svg"
                alt="date"
              />
              {isUpdatingDates ? (
                <TextSkeleton />
              ) : (
                <div
                  className={`flex my-auto ${
                    tripData.trip.endDate
                      ? 'underline underline-offset-8'
                      : 'text-white-700'
                  }`}
                >
                  {tripData.trip.endDate
                    ? getFormattedDate(tripData.trip.endDate)
                    : 'Add End Date'}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        {' '}
        {/* Desktop */}
        <Tab.Group>
          <Tab.List className="pb-7 max-w-[1200px] w-full px-6 mx-auto">
            {tabs.map((tab) => {
              return (
                <Tab
                  key={tab.text}
                  className="ui-selected:bg-black ui-selected:focus:outline-none ui-selected:opacity-100 opacity-60 mr-8 px-4 py-2 rounded-lg"
                >
                  <div className="text-2xl flex">
                    <img className="mr-2" src={tab.image} alt="itinerary" />
                    {tab.text}
                  </div>
                </Tab>
              );
            })}
          </Tab.List>
          <Tab.Panels className="border-solid border-t border-white-150">
            <Tab.Panel className="pt-14 max-w-[1200px] w-full px-6 mx-auto">
              <ItineraryTab tripData={tripData} userId={userData.user.id} />
            </Tab.Panel>
            <Tab.Panel className="w-full flex justify-center">
              <span className="mt-10 text-3xl">Coming soon ...</span>
            </Tab.Panel>
            <Tab.Panel>
              <GuestsTab users={sortedUsers} tripId={tripData.trip.id} />
            </Tab.Panel>
            <Tab.Panel className="w-full flex justify-center">
              <span className="mt-10 text-3xl">Coming soon ...</span>
            </Tab.Panel>
            <Tab.Panel className="w-full flex justify-center">
              <span className="mt-10 text-3xl">Coming soon ...</span>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <div className="block: md:hidden">
        {' '}
        {/* Mobile */}
        <Tab.Group>
          <Tab.List className="fixed bottom-0 flex justify-between w-full border-t border-white-150">
            {tabs.slice(0, 4).map((tab, index) => {
              const s =
                index < 3
                  ? 'my-4 text-lg border-r border-white-150'
                  : 'my-4 text-lg';
              return (
                <Tab
                  key={tab.text}
                  className="ui-selected:bg-white-100 ui-selected:focus:outline-none ui-selected:opacity-100 opacity-60 w-full"
                >
                  <div className={s}>
                    <img
                      className="flex mx-auto mb-2"
                      src={tab.image}
                      alt="itinerary"
                    />
                    <div>{tab.text}</div>
                  </div>
                </Tab>
              );
            })}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel className="p-5">
              <ItineraryTab tripData={tripData} userId={userData.user.id} />
            </Tab.Panel>
            <Tab.Panel className="w-full flex justify-center">
              <span className="mt-10 text-3xl">Coming soon ...</span>
            </Tab.Panel>
            <Tab.Panel>
              <GuestsTab users={sortedUsers} tripId={tripData.trip.id} />
            </Tab.Panel>
            <Tab.Panel className="w-full flex justify-center">
              <span className="mt-10 text-3xl">Coming soon ...</span>
            </Tab.Panel>
            <Tab.Panel className="w-full flex justify-center">
              <span className="mt-10 text-3xl">Coming soon ...</span>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <TripEditModal
        trip={tripData.trip}
        isOpen={isEditTripModalOpen}
        onClose={() => setIsEditTripModalOpen(false)}
        onUpdate={handleUpdateTrip}
      />
      <EditDateModal
        isOpen={isEditDateModalOpen}
        onClose={() => setIsEditDateModalOpen(false)}
        dates={{
          startDate: tripData.trip.startDate,
          endDate: tripData.trip.endDate,
        }}
        onUpdate={handleUpdateDates}
      />
    </div>
  );
}
