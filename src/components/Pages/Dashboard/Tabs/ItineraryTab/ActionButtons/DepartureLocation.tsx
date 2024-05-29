import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';

import LocationSekeleton from '@/components/Skeletons/LocationSkeleton';
import { SearchLocationModal } from '@/components/Modals/SearchLocationModal';

import { getAllAirports } from '@/api/beFlight/beFlight.service';
import { updateDepartureLocation } from '@/api/tripGuest/tripGuest.service';

import { QUERY_OPTION } from '@/lib/constants';

import { queryClient } from '@/pages/_app';

type DepartureLocationProps = {
  traveler: any;
};
export default function DepartureLocation({
  traveler,
}: DepartureLocationProps) {
  const { data, isLoading } = useQuery(
    'all_airports',
    getAllAirports,
    QUERY_OPTION,
  );
  const [location, setLocation] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && data && traveler) {
      const { airports, cities } = data;
      const { TripGuest } = traveler;
      let depature: string = '';
      if (TripGuest.DepartureDuffelCityId) {
        const city = cities.find(
          (city: any) => city.id === TripGuest.DepartureDuffelCityId,
        );
        if (city) depature = `${city.name}, ${city.countryName}`;
      } else if (TripGuest.DepartureDuffelAirportId) {
        const airport = airports.find(
          (airport: any) => airport.id === TripGuest.DepartureDuffelAirportId,
        );
        if (airport) depature = `${airport.cityName}, ${airport.countryName}`;
      } else if (traveler.HomeBaseDuffelCityId) {
        const city = cities.find(
          (city: any) => city.id === traveler.HomeBaseDuffelCityId,
        );
        if (city) depature = `${city.name}, ${city.countryName}`;
      } else if (traveler.HomeBaseDuffelAirportId) {
        const airport = airports.find(
          (airport: any) => airport.id === traveler.HomeBaseDuffelAirportId,
        );
        if (airport) depature = `${airport.cityName}, ${airport.countryName}`;
      }
      if (depature) setLocation(depature);
      setIsUpdating(false);
    }
  }, [traveler, data, isLoading]);

  const handleLocationSelect = async (newLocation: any) => {
    setIsModalOpen(false);
    setIsUpdating(true);
    try {
      const data = {
        tripGuestId: traveler.TripGuest.id,
        DepartureDuffelAirportId: null,
        DepartureDuffelCityId: null,
      };
      if (newLocation.type === 'airport')
        data.DepartureDuffelAirportId = newLocation.id;
      else data.DepartureDuffelCityId = newLocation.id;
      const { tripGuest } = await updateDepartureLocation(data);
      queryClient.invalidateQueries(['trip', tripGuest.TripId]);
    } catch (error) {
      toast.error('Something went wrong!');
      setIsUpdating(false);
    }
  };

  if (isUpdating) return <LocationSekeleton />;
  return (
    <>
      {location ? (
        <button
          className="flex w-full bg-[#2F3D4F] rounded-md py-3 md:py-4 px-3 md:px-5 justify-between mb-5 text-left"
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          <div>
            <div className="text-sm md:text-lg text-white-800">
              Departure Location
            </div>
            <div className="text-base md:text-xl truncate font-medium underline underline-offset-4">
              {location}
            </div>
          </div>
          <div className="w-4 md:w-6 flex my-auto">
            <img
              className="my-auto"
              src="/assets/images/dashboard/pen.svg"
              alt="pen"
            />
          </div>
        </button>
      ) : (
        <button
          className="bg-blue p-2 md:p-3 flex rounded-lg max-w-[440px] w-full mr-auto mb-2.5"
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="bg-black-500 px-2 py-3 rounded-md">
            <img
              className=""
              src="/assets/images/dashboard/plane.svg"
              alt="plane"
            />
          </div>
          <div className="text-base md:text-xl my-auto ml-3">
            Add Departure Location
          </div>
        </button>
      )}
      <SearchLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Departing From"
        onLocationSelect={handleLocationSelect}
      />
    </>
  );
}
