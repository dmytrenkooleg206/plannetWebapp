import { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { Menu, Transition } from '@headlessui/react';
import dayjs from 'dayjs';

import { Drawer } from '@/components/Drawer';
import Loader from '@/components/Loader/Loader';
import PNModal from '@/components/Modals/PNModal';
import Button from '@/components/Button/Button';
import { ImageToBlob } from '@/components/ImageToBlob';

import { useDebounce } from '@/hooks/useDebounce';

import { queryClient } from '@/pages/_app';
import { getFormattedDate } from '@/lib/utils';

import {
  createItineraryEvent,
  updateItineraryEvent,
} from '@/api/itineraryEvent/itineraryEvent.service';

import SearchIcon from '@/../public/assets/images/bookhotel/search.svg';
import {
  createBusinessEntity,
  uploadPhotoBusinessEntity,
} from '@/api/businessEntity/businessEntity.service';

type CustomStayModalProps = {
  isOpen: boolean;
  onClose: Function;
  tripLeg: any;
  onComplete: Function;
  isUpdate?: boolean;
  itineraryEvent?: any;
};

export default function CustomStayModal({
  isOpen,
  isUpdate = false,
  onClose,
  tripLeg,
  itineraryEvent,
  onComplete,
}: CustomStayModalProps) {
  const [title, setTitle] = useState<string>('');
  const [website, setWebsite] = useState<string>('');

  const [searchText, setSearchText] = useState<string>('');
  const debouncedSearchText = useDebounce(searchText, 300);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [options, setOptions] = useState<string[]>([]);
  const [places, setPlaces] = useState<any[]>([]);

  const [location, setLocation] = useState<string>('');

  const [place, setPlace] = useState<any>();
  const [photo, setPhoto] = useState<any>(null);
  const [blob, setBlob] = useState<any>(null);

  const [isLocationDrawerOpen, setIsLocationDrawerOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (tripLeg.startDate && tripLeg.endDate) {
      const diff = dayjs(tripLeg.endDate).diff(tripLeg.startDate, 'day');
      const options: string[] = [];
      for (let i = 0; i <= diff; i += 1) {
        options.push(
          dayjs(tripLeg.startDate).add(i, 'day').format('MMM DD, YYYY'),
        );
      }
      setOptions(options);
      setStartDate(tripLeg.startDate);
      setEndDate(tripLeg.endDate);
    }
  }, [tripLeg]);

  useEffect(() => {
    if (isOpen && itineraryEvent) {
      setTitle(itineraryEvent.name);
      setStartDate(
        dayjs(tripLeg.startDate)
          .add(itineraryEvent.startDateOffset, 'day')
          .format('MMM DD, YYYY'),
      );
      setEndDate(
        dayjs(tripLeg.startDate)
          .add(itineraryEvent.endDateOffset, 'day')
          .format('MMM DD, YYYY'),
      );
      setLocation(itineraryEvent.BusinessEntity.address);
      setWebsite(itineraryEvent.websiteUrl);
      setPhoto(null);
    }
  }, [itineraryEvent, isOpen]);

  const getPlacesData = async (searchStr: string) => {
    setIsLoading(true);
    try {
      const map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          center: {
            lat: parseFloat(tripLeg.City.latitude),
            lng: parseFloat(tripLeg.City.longitude),
          },
          zoom: 15,
        },
      );

      const service = new google.maps.places.PlacesService(map);
      const request: any = {
        query: searchStr,
        location: {
          lat: parseFloat(tripLeg.City.latitude),
          lng: parseFloat(tripLeg.City.longitude),
        },
        radius: 1000,
      };

      service.textSearch(request, async (results: any, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK)
          setPlaces(results);
      });
    } catch (error) {
      toast.error('There is no available data!');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(
    () => {
      if (debouncedSearchText && debouncedSearchText.length > 1) {
        getPlacesData(debouncedSearchText);
      } else {
        setPlaces([]);
      }
    },
    [debouncedSearchText], // Only call effect if debounced search term changes
  );

  const handleSearchTextChange = (newSearch: string) => {
    if (isLoading) return;
    setSearchText(newSearch);
  };

  const handleAddCustomStay = async () => {
    if (!title || !startDate || !endDate || !location) {
      toast.warn('Please fill the fields!');
      return;
    }
    if (!isUpdate && !place) return;
    if (isLoading) return;
    setIsLoading(true);
    try {
      let businessEntityId;
      if (blob) {
        const { businessEntity } = await createBusinessEntity({
          name: place.name,
          placeId: place.place_id,
          address: place.formatted_address,
          longitude: place.geometry.location.lng(),
          latitude: place.geometry.location.lat(),
          websiteUrl: place.website,
          phoneNumber: place.international_phone_number,
          rating: place.rating,
          hours: place.current_opening_hours?.weekday_text?.join(','),
          priceLevel: '-1',
          type: '',
          CityId: tripLeg.City.id,
        });

        const formData = new FormData();
        formData.append('image', blob);
        formData.append('BusinessEntityId', businessEntity.id);
        await uploadPhotoBusinessEntity(formData);
        businessEntityId = businessEntity.id;
      }
      if (isUpdate) {
        const response = await updateItineraryEvent({
          ItineraryEventId: itineraryEvent.id,
          name: title,
          address: location,
          websiteUrl: website,
          startDateOffset: dayjs(startDate).diff(tripLeg.startDate, 'day'),
          endDateOffset: dayjs(endDate).diff(tripLeg.startDate, 'day'),
          BusinessEntityId:
            businessEntityId || itineraryEvent.BusinessEntity.id,
        });
        onComplete(response.itineraryEvent);
        toast.success('Updated Successfully!');
      } else {
        await createItineraryEvent({
          type: 'STAY',
          name: title,
          address: location,
          attendingStatus: 'YES',
          TripLegId: tripLeg.id,
          websiteUrl: website,
          startDateOffset: dayjs(startDate).diff(tripLeg.startDate, 'day'),
          endDateOffset: dayjs(endDate).diff(tripLeg.startDate, 'day'),
          stayRank: '0',
          BusinessEntityId: businessEntityId,
        });
        toast.success('Added Successfully!');
      }
      setPhoto(null);
      setBlob(null);
      queryClient.invalidateQueries(['trip', tripLeg.TripId]);
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCity = (place: any) => {
    try {
      const map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          center: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          zoom: 15,
        },
      );

      const service = new google.maps.places.PlacesService(map);

      service.getDetails(
        { placeId: place.place_id },
        async (place: any, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const { website } = place;
            setPlace(place);
            setLocation(place.formatted_address);
            setWebsite(website);
            setPhoto(place.photos[0]);
            setSearchText('');
            setIsLocationDrawerOpen(false);
          }
        },
      );
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <>
      <PNModal isOpen={isOpen} onClose={() => onClose()}>
        <div className="text-xl md:text-3xl font-bold mb-5">
          {isUpdate ? 'Edit Custom Stay' : 'Add Custom Stay'}
        </div>
        <div className="text-lg md:text-2xl font-bold my-2">Title</div>
        <input
          className="w-full bg-black outline-none text-lg md:text-xl p-3 rounded-md"
          placeholder="Stay title"
          autoComplete="off"
          value={title}
          onChange={(e: any) => setTitle(e.target.value)}
        />
        <div className="text-lg md:text-2xl font-bold mt-5 mb-2">Date</div>
        <div className="flex justify-between text-lg md:text-xl underline text-center ">
          <div className="bg-black rounded-md p-3 w-[calc(50%-10px)]">
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="underline">
                {startDate ? getFormattedDate(startDate) : 'Start Date'}
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute p-2 mt-2 rounded-md bg-gray-212 shadow-lg focus:outline-none overflow-y-auto max-h-[300px]">
                  {options.map((option: string) => {
                    return (
                      <Menu.Item key={option}>
                        <button
                          className="p-2 bg-black rounded-md my-1 text-base"
                          type="button"
                          onClick={() => {
                            setStartDate(option);
                            if (
                              endDate &&
                              dayjs(endDate).diff(option, 'day') < 0
                            )
                              setEndDate('');
                          }}
                        >
                          {option}
                        </button>
                      </Menu.Item>
                    );
                  })}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          <div className="bg-black rounded-md p-3 w-[calc(50%-10px)]">
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="underline">
                {endDate ? getFormattedDate(endDate) : 'End Date'}
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute p-2 mt-2 rounded-md bg-gray-212 shadow-lg focus:outline-none overflow-y-auto max-h-[300px]">
                  {options.map((option: string) => {
                    return (
                      <Menu.Item key={option}>
                        <button
                          className="p-2 bg-black rounded-md my-1 text-base"
                          type="button"
                          onClick={() => {
                            setEndDate(option);
                            if (
                              startDate &&
                              dayjs(startDate).diff(option, 'day') > 0
                            )
                              setStartDate('');
                          }}
                        >
                          {option}
                        </button>
                      </Menu.Item>
                    );
                  })}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <div className="text-lg md:text-2xl font-bold mt-5 mb-2">Location</div>
        <button
          className="flex flex-row bg-black py-3 px-5 rounded-md w-full text-left"
          type="button"
          onClick={() => setIsLocationDrawerOpen(true)}
        >
          <Image
          loading="lazy"
            className="my-auto mr-4"
            src={SearchIcon}
            alt="location"
            style={{ width: '20px', height: 'auto' }}
          />
          <div
            className={`text-lg md:text-xl ${
              location ? 'text-white' : 'text-white-600'
            }`}
          >
            {location || 'Search location or address'}
          </div>
        </button>
        <div className="text-lg md:text-2xl font-bold mt-5 mb-2">Website</div>
        <input
          className="w-full bg-black outline-none text-lg md:text-xl p-3 rounded-md mb-8"
          placeholder="Paste your reservation link here"
          autoComplete="off"
          value={website}
          onChange={(e: any) => setWebsite(e.target.value)}
        />
        <Button
          isLoading={!!photo || isLoading}
          text={isUpdate ? 'Update' : 'Add'}
          color="green"
          onClick={handleAddCustomStay}
        />
      </PNModal>
      <Drawer
        isOpen={isLocationDrawerOpen}
        onClose={() => setIsLocationDrawerOpen(false)}
      >
        <div className="p-6">
          <div className="text-lg md:text-2xl font-bold mt-5 mb-2">
            Location
          </div>
          <div className="flex flex-row bg-black border border-white-300 py-3 px-5 rounded-md">
            <Image
            loading="lazy"
              className="my-auto mr-4"
              src={SearchIcon}
              alt="location"
              style={{ width: '20px', height: 'auto' }}
            />
            <input
              className="w-full bg-black outline-none text-lg md:text-2xl"
              placeholder="Searech location or address"
              autoComplete="off"
              value={searchText}
              onChange={(e: any) => handleSearchTextChange(e.target.value)}
            />
          </div>
          {isLoading ? (
            <div className="bg-black rounded-xl p-5 my-2.5 w-full">
              <Loader color="white" />
            </div>
          ) : (
            <div className="overflow-y-auto">
              {places.map((place) => {
                return (
                  <button
                    className="bg-black rounded-xl p-5 my-2.5 w-full text-left"
                    key={`search_${place.place_id}`}
                    type="button"
                    onClick={() => handleSelectCity(place)}
                  >
                    <div className="text-lg md:text-2xl">{place.name}</div>
                    <div className="text-base md:text-xl text-white-700">
                      {place.formatted_address}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Drawer>
      {photo && (
        <ImageToBlob
          src={photo.getUrl({
            maxWidth: 600,
          })}
          onSetBlob={(blob: any) => {
            setBlob(blob);
            setPhoto(null);
          }}
        />
      )}
    </>
  );
}
