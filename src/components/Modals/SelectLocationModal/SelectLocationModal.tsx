import { useEffect, useState, useRef } from 'react';
import { useQuery } from 'react-query';
import Autocomplete from 'react-google-autocomplete';

import Button from '@/components/Button/Button';
import Loader from '@/components/Loader/Loader';

import { useOnLoadImages } from '@/hooks/useOnLoadImages';

import { getHomeV4feed } from '@/api/home/home.service';
import { createCity, uploadCityPhoto } from '@/api/city/city.service';

import { getContinent } from '@/lib/utils';
import { QUERY_OPTION } from '@/lib/constants';
import PNModal from '../PNModal';

type SelectLocationModalProps = {
  onClose: Function;
  isOpen: boolean;
  onAddCity: Function;
  isUpdate?: boolean;
  isDark?: boolean;
};

type CitiesProps = {
  cities: any[];
  selectedCity: number;
  onSelectCity: Function;
  isDark?: boolean;
};
function Cities({
  cities,
  selectedCity,
  onSelectCity,
  isDark = false,
}: CitiesProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imagesLoaded = useOnLoadImages(wrapperRef);

  return (
    <div className="h-[300px] overflow-y-auto flex flex-col" ref={wrapperRef}>
      {cities.map((city, index) => {
        let style = isDark ? 'bg-black' : 'bg-white';
        if (index === selectedCity) style = `${style} border-primary`;
        else if (isDark) style = `${style} border-black`;
        else style = `${style} border-white`;
        return (
          <button
            key={city.id}
            className={`p-2.5 rounded mb-4 flex border text-left ${style}`}
            type="button"
            onClick={() => onSelectCity(index)}
          >
            {!imagesLoaded && (
              <div role="status" className="animate-pulse flex items-center">
                <div className="flex items-center justify-center w-14 h-14 bg-gray rounded">
                  <svg
                    className="w-5 h-5 text-white"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 640 512"
                  >
                    <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                  </svg>
                </div>
              </div>
            )}
            <img
              className="w-14 h-14 rounded my-auto"
              src={`${city.photoUrl_CF}_360`}
              style={{ display: imagesLoaded ? 'block' : 'none' }}
              alt={city.name}
            />
            <div className="flex flex-col justify-between ml-4">
              <div className="text-lg md:text-2xl">{city.name}</div>
              <div className="text-base md:text-xl opacity-60">
                {city.country}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function SelectLocationModal({
  onClose,
  isOpen,
  isUpdate = false,
  isDark = false,
  onAddCity,
}: SelectLocationModalProps) {
  const { data, isLoading: isFetching } = useQuery(
    'home_v4_feed',
    getHomeV4feed,
    QUERY_OPTION,
  );

  const [cities, setCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<number>(-1);
  const [place, setPlace] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isFetching && data) {
      setCities(data.TopDestinationsData.cities);
    }
  }, [isFetching, data]);

  const handleClose = () => {
    setSelectedCity(-1);
    onClose();
  };

  const handleCreateCity = async (place: any) => {
    if (isLoading) return;
    let placeId;
    let placeName;
    let locality;
    let country;
    let continent;
    let longitude;
    let latitude;

    if (place) {
      placeId = place.place_id;
      longitude = place.geometry
        ? place.geometry.location.lng().toFixed(3)
        : '';
      latitude = place.geometry ? place.geometry.location.lat().toFixed(3) : '';

      if (place.address_components) {
        for (let i = 0; i < place.address_components.length; i += 1) {
          if (place.address_components[i].types[0] === 'country') {
            country = place.address_components[i].long_name;
            continent = getContinent(place.address_components[i].short_name);
          }

          if (
            place.address_components[i].types[0] === 'locality' ||
            place.address_components[i].types[1] === 'locality' ||
            place.address_components[i].types[2] === 'locality'
          ) {
            locality = place.address_components[i].long_name;
          }
        }
      }
      placeName = place.name ? place.name : locality;
    }

    setIsLoading(true);
    try {
      const { city } = await createCity({
        name: placeName,
        country,
        continent,
        placeId,
        longitude,
        latitude,
      });
      // if (!city.photoUrl_CF) {
      //   const map = new google.maps.Map(
      //     document.getElementById('map') as HTMLElement,
      //     {
      //       center: { lat: -33.866, lng: 151.196 },
      //       zoom: 15,
      //     },
      //   );
      //   const service = new google.maps.places.PlacesService(map);
      //   const request = {
      //     placeId,
      //     fields: ['photos'],
      //   };
      //   service.getDetails(request, async (place, status) => {
      //     if (
      //       status === google.maps.places.PlacesServiceStatus.OK &&
      //       place &&
      //       place.photos
      //     ) {
      //       const photoUrl = place.photos[0].getUrl();
      //       // console.log(photoUrl);
      //     }
      //   });
      //   // const {
      //   //   photo_reference: photoReference,
      //   //   height,
      //   //   width,
      //   // } = data.result.photos[0];
      //   // const photoRes = await axios.get(
      //   //   `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoReference}&sensor=false&maxheight=${height}&maxwidth=${width}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP}`,
      //   //   {
      //   //     responseType: 'blob',
      //   //   },
      //   // );

      //   // const formData = new FormData();
      //   // formData.append('image', photoRes.data, 'image');
      //   // formData.append('CityId', city.id);
      //   // const { city: updatedCity } = await uploadCityPhoto(formData);
      //   // city = { ...updatedCity };
      // } else {
      //   onAddCity(city, isUpdate);
      //   setPlace(`${city?.name}, ${city?.country}`);
      //   handleClose();
      // }
      onAddCity(city, isUpdate);
      setPlace(`${city?.name}, ${city?.country}`);
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCities = () => {
    if (isFetching)
      return (
        <div className="my-5">
          <Loader color="secondary" />
        </div>
      );
    return (
      <Cities
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        isDark={isDark}
      />
    );
  };

  return (
    <PNModal
      isDark={isDark}
      maxWidth="max-w-[500px]"
      isOpen={isOpen}
      onClose={handleClose}
    >
      <div className="text-xl md:text-3xl font-medium">Location</div>
      <div className="relative">
        <Autocomplete
          // type="text"
          id="autocomplete"
          className={`relative flex my-5 pl-12 pr-5 py-4 border border-black-300 rounded-lg text-2xl font-light w-full outline-none ${
            isDark ? 'bg-black' : 'bg-white'
          }`}
          placeholder="Search location"
          inputAutocompleteValue={place}
          defaultValue={place}
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP}
          onPlaceSelected={(newPlace) => {
            handleCreateCity(newPlace);
          }}
        />
        <img
          className="absolute left-5 top-[21px]"
          src="/assets/images/registration/search.svg"
          alt="search"
        />
      </div>
      <div className="text-lg md:text-2xl font-medium mb-4">
        Popular Destinations
      </div>
      {renderCities()}
      <div className="mt-5">
        <Button
          onClick={() => {
            if (selectedCity >= 0 && !isLoading) {
              onAddCity(cities[selectedCity], isUpdate);
              handleClose();
            }
          }}
          text={isUpdate ? 'Update' : 'Add'}
          isDisabled={!(selectedCity >= 0)}
          isLoading={isLoading}
        />
      </div>
      <div id="map" />
    </PNModal>
  );
}
