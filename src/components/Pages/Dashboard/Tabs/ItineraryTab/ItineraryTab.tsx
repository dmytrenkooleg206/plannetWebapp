import { useEffect, useState } from 'react';

import { BUDGETS } from '@/lib/constants';

import { useGetDestinationRecommendations } from '@/hooks/queries/useGetDestinationRecommendations';
import { useGetV4HomeFeed } from '@/hooks/queries/useGetV4HomeFeed';
import TopCities from './Destinations/TopCities';
import Destinations from './Destinations/Destinations';
import ArrivalLocation from './ActionButtons/ArrivalLocation';
import DepartureLocation from './ActionButtons/DepartureLocation';

type ItineraryTabProps = {
  tripData: any;
  userId: string;
};

export default function ItineraryTab({ tripData, userId }: ItineraryTabProps) {
  const [traveler, setTraveler] = useState<any>();
  const [travelerTrip, setTravelerTrip] = useState<any>();

  useEffect(() => {
    if (tripData && tripData.users) {
      const traveler = tripData.users.find((user: any) => user.id === userId);
      setTraveler(traveler);
      setTravelerTrip(tripData);
    }
  }, [tripData]);

  const hasArrivalAndDeparture = () => {
    if (!traveler) return false;
    if (traveler.HomeBaseDuffelAirportId || traveler.HomeBaseDuffelCityId)
      return true;
    if (
      (traveler.TripGuest.ArrivalDuffelCityId ||
        traveler.TripGuest.ArrivalDuffelAirportId) &&
      (traveler.TripGuest.DepartureDuffelCityId ||
        traveler.TripGuest.DepartureDuffelAirportId)
    )
      return true;
    return false;
  };

  const {
    data: recommendationData,
    isLoading: isDestinationRecommendationsLoading,
  } = useGetDestinationRecommendations(
    {
      month: tripData.tripLeg.month,
      temp: tripData.tripLeg.temp,
      persona: tripData.tripLeg.persona,
      latitude: tripData.tripLeg.City.latitude,
      longitude: tripData.tripLeg.City.longitude,
      distancePreference: tripData.tripLeg.distancePreference,
      travelType: tripData.tripLeg.travelType,
    },
    { enabled: !!tripData.tripLeg },
  );

  const { data: v4HomeFeed, isLoading: isV4HomeFeedLoading } =
    useGetV4HomeFeed();

  const renderCities = () => {
    if (!hasArrivalAndDeparture()) return null;

    const { tripLeg, tripLegs, itineraryEvents, users } = travelerTrip;
    const { budgetThreshold } = tripLeg;

    if (tripLegs?.filter((tripLeg: any) => tripLeg.CityId !== '0')?.length)
      return (
        <Destinations
          tripLegs={tripLegs}
          itineraryEvents={itineraryEvents}
          users={users}
        />
      );

    return (
      <TopCities
        isLoading={isDestinationRecommendationsLoading || isV4HomeFeedLoading}
        cities={
          recommendationData?.destinationRecommendations.length
            ? recommendationData?.destinationRecommendations
            : v4HomeFeed?.TopDestinationsData?.cities
        }
        isRecommendations={
          recommendationData?.destinationRecommendations.length > 0
        }
        budget={BUDGETS[budgetThreshold]}
        tripLegId={tripLeg.id}
      />
    );
  };

  return (
    <div className="flex flex-col mb-20">
      {!hasArrivalAndDeparture() && (
        <div className="text-bold text-5xl pb-7">
          Start planning your trip here
        </div>
      )}
      <div className="max-w-[440px] w-full">
        <DepartureLocation traveler={traveler} />
        {renderCities()}
        <ArrivalLocation traveler={traveler} />
      </div>
    </div>
  );
}
