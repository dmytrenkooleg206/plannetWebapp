import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { getTripById } from '@/api/trip/trip.service';

import { QUERY_OPTION } from '@/lib/constants';
import { queryClient } from '@/pages/_app';
import { updateGuests } from '@/api/itineraryEvent/itineraryEvent.service';

type SuccessFormProps = {
  tripId: string;
  eventId: string;
  onComplete: Function;
};
export default function SuccessForm({
  tripId,
  eventId,
  onComplete,
}: SuccessFormProps) {
  const [guests, setGuests] = useState<any>([]);

  const { data: tripData } = useQuery(
    ['trip', tripId],
    () => getTripById(tripId),
    QUERY_OPTION,
  );

  useEffect(() => {
    if (tripData?.users?.length) {
      const tempGuests = tripData.users
        .filter((user: any) => !user.TripGuest.isPlanner)
        .map((user: any) => ({
          selected: false,
          id: user.TripGuest.id,
          name: `${user.firstName || user.TripGuest?.firstNameOnInvite} ${
            user.lastName || user.TripGuest?.lastNameOnInvite
          }`,
        }));
      setGuests(tempGuests);
    }
  }, [tripData]);

  const handleContinue = async () => {
    if (!eventId) return;
    // const
    const guestIds = guests
      .filter((guest: any) => guest.selected)
      .map((guest: any) => guest.id);

    if (guestIds.length) {
      try {
        await updateGuests({
          ItineraryEventId: eventId,
          TripGuestIds: guestIds,
        });
        queryClient.invalidateQueries(['trip', tripId]);
      } catch (error) {
        toast.error('Error while adding guests!');
      }
    }
    onComplete();
  };
  return (
    <div className="bg-gray-113 text-white">
      <div className="bg-green flex m-auto rounded-full w-16 h-16">
        <FaCheck className="m-auto text-2xl text-white" />
      </div>
      <div className="text-lg md:text-2xl text-center font-bold mt-5 mb-10">
        Payment Successful!
      </div>
      <div className="bg-gray-113 text-white p-5 rounded-md">
        <div className="text-base md:text-xl">Guests</div>
        {guests.map((guest: any, index: number) => {
          return (
            <div
              className="flex bg-black py-2 px-4 mt-2"
              key={`guest_${guest.id}`}
            >
              <input
                type="checkbox"
                className="h-6 w-6 rounded my-auto"
                checked={guest.selected}
                onChange={() => {
                  const tempGuests = [...guests];
                  tempGuests[index].selected = !tempGuests[index].selected;
                  setGuests(tempGuests);
                }}
              />
              <div className="text-lg md:text-2xl ml-2">{guest.name}</div>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className="bg-green rounded-lg text-base md:text-xl py-2 px-10 mt-5 mx-auto flex text-white"
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
}
