import { useState } from 'react';
import { toast } from 'react-toastify';

import CitySekeleton from '@/components/Skeletons/CitySekeleton';
import { EditDateModal } from '@/components/Modals/EditDateModal';
import { getContinent, getFormattedDate } from '@/lib/utils';

import { createCity } from '@/api/city/city.service';
import {
  updateTripLegCity,
  updateTripLegDates,
} from '@/api/tripLeg/tripLeg.service';

import { queryClient } from '@/pages/_app';

import AddDestinationButton from '../ActionButtons/AddDestinationButton';

type TopCitiesProps = {
  isLoading: boolean;
  isRecommendations: boolean;
  cities: any[];
  budget: string;
  tripLegId: string;
};
export default function TopCities({
  isLoading,
  isRecommendations,
  cities,
  budget,
  tripLegId,
}: TopCitiesProps) {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<any>();

  const handleAddDestination = (city: any) => {
    setSelectedCity(city);
    setIsModalOpen(true);
  };

  const addCity = async (cityId: string, range: any[]) => {
    const { tripLeg } = await updateTripLegCity({
      TripLegId: tripLegId,
      CityId: cityId,
    });

    await updateTripLegDates({
      TripId: tripLeg.TripId,
      startDate: getFormattedDate(range[0]),
      endDate: getFormattedDate(range[1]),
      tripLegDates: [
        {
          id: tripLegId,
          startDate: getFormattedDate(range[0]),
          endDate: getFormattedDate(range[1]),
        },
      ],
    });

    queryClient.invalidateQueries(['trip', tripLeg.TripId]);

    setIsUpdating(false);
  };

  const handleAddTrip = async (range: any[]) => {
    if (!selectedCity) {
      toast.warn('City is not selected!');
      return;
    }

    try {
      setIsUpdating(true);

      if (selectedCity.id) {
        addCity(selectedCity.id, range);
      } else {
        const map = new google.maps.Map(
          document.getElementById('map') as HTMLElement,
          {
            center: { lat: selectedCity.latitude, lng: selectedCity.longitude },
            zoom: 15,
          },
        );

        const service = new google.maps.places.PlacesService(map);
        const request = {
          placeId: selectedCity.placeId,
        };

        service.getDetails(request, async (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            let continent;

            if (place.address_components) {
              for (let i = 0; i < place.address_components.length; i += 1) {
                if (place.address_components[i].types[0] === 'country') {
                  continent = getContinent(
                    place.address_components[i].short_name,
                  );
                }
              }
            }

            const { city } = await createCity({
              name: selectedCity.name,
              country: selectedCity.country,
              continent,
              placeId: selectedCity.placeId,
              longitude: selectedCity.longitude,
              latitude: selectedCity.latitude,
            });

            addCity(city.id, range);
          }
        });
      }
    } catch (error: any) {
      toast.error('Something went wrong!', error);
      setIsUpdating(false);
    }
  };

  if (isLoading || isUpdating)
    return (
      <div>
        {[...new Array(5).keys()].map((index) => {
          return (
            <div className="mb-2.5" key={`skeleton_${index}`}>
              <CitySekeleton />
            </div>
          );
        })}
      </div>
    );

  return (
    <div>
      <div id="map" />
      {cities.map((city: any) => {
        const imageUrl: string = isRecommendations
          ? city.photoUrl
          : `${city.photoUrl_CF}_360`;

        return (
          <div
            className="bg-black-500 p-2.5 my-2.5 rounded flex"
            key={`${city?.id}-${city.name}`}
          >
            <img
              className="w-20 md:w-24 h-20 md:h-24 rounded my-auto aspect-square"
              src={imageUrl}
              alt={city.name}
            />
            <div className="ml-2.5 flex flex-col grow truncate">
              <div className="text-base md:text-xl truncate">
                {city.name}, {city.country}
              </div>
              {budget ? (
                <div className="text-base md:text-xl font-bold text-primary-200 truncate">
                  {budget}/traveler
                </div>
              ) : null}
              <button
                type="button"
                className="text-sm md:text-lg text-center bg-primary text-white font-bold w-full mt-auto rounded p-1 truncate"
                onClick={() => handleAddDestination(city)}
              >
                Trip to {city.name}
              </button>
            </div>
          </div>
        );
      })}
      <AddDestinationButton onAddDestination={handleAddDestination} />
      <EditDateModal
        city={selectedCity}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dates={{
          startDate: null,
          endDate: null,
        }}
        onUpdate={handleAddTrip}
      />
    </div>
  );
}
