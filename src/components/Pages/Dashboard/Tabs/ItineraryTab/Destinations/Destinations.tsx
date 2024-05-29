import { useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { FaChevronUp, FaPlus } from 'react-icons/fa';
import { Disclosure } from '@headlessui/react';
import dayjs from 'dayjs';

import { EditDateModal } from '@/components/Modals/EditDateModal';
import { BookHotelDrawer } from '@/components/Modals/BookHotelDrawer';
import { SelectLocationModal } from '@/components/Modals/SelectLocationModal';

import { getFormattedDate } from '@/lib/utils';

import {
  addTripLeg,
  updateTripLegCity,
  updateTripLegDates,
} from '@/api/tripLeg/tripLeg.service';
import { TripLegObject } from '@/api/tripLeg/tripLeg.types';

import { queryClient } from '@/pages/_app';

import { BookedHotelDrawer } from '@/components/Modals/BookedHotelDrawer';
import AddDestinationButton from '../ActionButtons/AddDestinationButton';

type DestinationsProps = {
  tripLegs: any;
  itineraryEvents: any;
  users: any;
};
export default function Destinations({
  tripLegs,
  itineraryEvents,
  users,
}: DestinationsProps) {
  const [isDestinationModalOpen, setIsDestinationModalOpen] =
    useState<boolean>(false);
  const [isDatesModalOpen, setIsDatesModalOpen] = useState<boolean>(false);
  const [isBookHotelDrawerOpen, setIsBookHotelDrawerOpen] =
    useState<boolean>(false);

  const [selectedCity, setSelectedCity] = useState<any>();
  const [selectedTripLeg, setSelectedTripLeg] = useState<any>();
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const [selectedItineraryEvent, setSelectedItineraryEvent] =
    useState<any>(null);

  const handleAddDestination = (city: any, isUpdate: boolean = false) => {
    setSelectedCity(city);
    setIsDatesModalOpen(true);
    setIsUpdate(isUpdate);
  };

  const getSortedTripLegDates = (newTripLeg: TripLegObject) => {
    const tripLegDates = tripLegs.map((tripLeg: TripLegObject) => {
      if (tripLeg.id === newTripLeg.id) return newTripLeg;
      return {
        id: tripLeg.id,
        startDate: tripLeg.startDate,
        endDate: tripLeg.endDate,
      };
    });
    if (!newTripLeg.id) tripLegDates.push(newTripLeg);
    tripLegDates.sort((dates1: TripLegObject, dates2: TripLegObject) => {
      if (!dates1.startDate) return 1;
      if (!dates2.startDate) return -1;
      const diffStartDate = dayjs(dates1.startDate).diff(dates2.startDate);
      if (diffStartDate > 0) return 1;
      if (diffStartDate < 0) return -1;

      const diffEndDate = dayjs(dates1.endDate).diff(dates2.endDate);
      if (diffEndDate > 0) return 1;
      if (diffEndDate < 0) return -1;

      return 0;
    });
    return tripLegDates;
  };

  const handleAddOrUpdate = async (
    range: any,
    updateSelectedTripLeg: boolean = false,
  ) => {
    if (!selectedCity) {
      toast.warn('City is not selected!');
      return;
    }
    try {
      if (!isUpdate) {
        await addTripLeg({
          TripId: tripLegs[0].TripId,
          CityId: selectedCity.id,
          startDate: getFormattedDate(range[0]),
          endDate: getFormattedDate(range[1]),
          tripLegDates: getSortedTripLegDates({
            id: null,
            startDate: getFormattedDate(range[0]),
            endDate: getFormattedDate(range[1]),
          }),
        });
        toast.success('New destination is added!');
      } else {
        if (selectedTripLeg.City.id !== selectedCity.id)
          await updateTripLegCity({
            TripLegId: selectedTripLeg.id,
            CityId: selectedCity.id,
          });
        const { tripLegs: resTripLegs } = await updateTripLegDates({
          TripId: tripLegs[0].TripId,
          startDate: getFormattedDate(range[0]),
          endDate: getFormattedDate(range[1]),
          tripLegDates: getSortedTripLegDates({
            id: selectedTripLeg.id,
            startDate: getFormattedDate(range[0]),
            endDate: getFormattedDate(range[1]),
          }),
        });
        if (updateSelectedTripLeg) {
          const item = resTripLegs.find(
            (tripLeg: any) => tripLeg.id === selectedTripLeg.id,
          );
          if (item) setSelectedTripLeg(item);
        }
        toast.success('Successfully updated!');
      }
      queryClient.invalidateQueries(['trip', tripLegs[0].TripId]);
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const getDateArray = (tripLeg: any) => {
    if (!tripLeg.startDate || !tripLeg.endDate) return [];
    const diff = dayjs(tripLeg.endDate).diff(tripLeg.startDate, 'day');
    return [...new Array(diff + 1).keys()];
  };

  const handleDestinationClick = (tripLeg: any) => {
    setSelectedTripLeg(tripLeg);
    setIsDestinationModalOpen(true);
  };

  const handleDateClick = (city: any, tripLeg: any) => {
    setSelectedTripLeg(tripLeg);
    setIsDatesModalOpen(true);
    setIsUpdate(true);
    setSelectedCity(city);
  };

  const handleAddStay = (tripLeg: any) => {
    setSelectedTripLeg(tripLeg);
    setSelectedCity(tripLeg.City);
    setIsBookHotelDrawerOpen(true);
    setIsUpdate(true);
  };

  return (
    <div>
      {tripLegs.map((tripLeg: any, index: number) => {
        const { id, City, startDate, endDate } = tripLeg;
        return (
          <div key={id}>
            {index === 0 ? (
              <div className="bg-black rounded-md p-2 md:p-4 mb-2.5 md:mb-5">
                <div className="text-lg md:text-2xl mb-2.5">Flight</div>
                <button
                  className="bg-blue p-2 md:p-4 flex rounded-md w-full"
                  type="button"
                >
                  <div className="bg-black-500 px-2 py-3 rounded-md w-12 h-12">
                    <img
                      className="m-auto"
                      src="/assets/images/dashboard/plane.svg"
                      alt="plane"
                    />
                  </div>
                  <div className="text-base md:text-xl my-auto ml-3">
                    Add Flight
                  </div>
                </button>
              </div>
            ) : null}

            <button
              className="flex w-full bg-black rounded-md p-3 md:p-4 mb-2.5 md:mb-5 border border-white-150"
              type="button"
              onClick={() => handleDestinationClick(tripLeg)}
            >
              <div className="text-lg md:text-2xl truncate underline underline-offset-4 md:underline-offset-8">
                {City.name}, {City.country}
              </div>
              <div className="w-3 md:w-4 ml-2 my-auto">
                <img src="/assets/images/dashboard/pen.svg" alt="pen" />
              </div>
            </button>

            <div className="flex flex-row justify-between mb-2.5 md:mb-5">
              <button
                className="flex bg-black rounded-md p-2 md:p-4 border border-white-150 w-full mr-2 justify-center"
                type="button"
                onClick={() => handleDateClick(City, tripLeg)}
              >
                <div className="text-base md:text-2xl underline underline-offset-4 md:underline-offset-8 text-white-800 my-auto">
                  {startDate ? getFormattedDate(startDate) : 'Start Date'}
                </div>
                <div className="w-3 md:w-4 ml-2 my-auto">
                  <img src="/assets/images/dashboard/pen.svg" alt="pen" />
                </div>
              </button>
              <button
                className="flex bg-black rounded-md p-2 md:p-4 border border-white-150 w-full ml-2 justify-center"
                type="button"
                onClick={() => handleDateClick(City, tripLeg)}
              >
                <div className="text-base md:text-2xl underline underline-offset-4 md:underline-offset-8 text-white-800">
                  {endDate ? getFormattedDate(endDate) : 'End Date'}
                </div>
                <div className="w-3 md:w-4 ml-2 my-auto">
                  <img src="/assets/images/dashboard/pen.svg" alt="pen" />
                </div>
              </button>
            </div>

            <div className="bg-black rounded-md p-2 md:p-4 mb-2.5 md:mb-5">
              <div className="text-lg md:text-2xl mb-2.5">Stay</div>
              {itineraryEvents.map((itineraryEvent: any) => {
                if (
                  itineraryEvent.TripLegId !== id ||
                  itineraryEvent.type !== 'STAY'
                )
                  return null;
                if (!itineraryEvent.AllianceHotelBooking) {
                  return (
                    <button
                      key={`stay_${itineraryEvent.id}`}
                      type="button"
                      className="w-full text-left bg-gray-113 p-3 rounded-md mb-5"
                      onClick={() => {
                        setSelectedTripLeg(tripLeg);
                        setSelectedItineraryEvent(itineraryEvent);
                      }}
                    >
                      {itineraryEvent?.BusinessEntity &&
                        itineraryEvent?.BusinessEntity.photoUrl_CF != '' && (
                          <Image
                          loading="lazy"
                            src={`${itineraryEvent.BusinessEntity.photoUrl_CF}_720`}
                            alt="hotel"
                            width={500}
                            height={375}
                            sizes="100vw"
                            className="w-full h-full max-h-[200px] object-cover rounded"
                          />
                        )}
                      <div className="flex justify-between mt-2.5">
                        <div>
                          <div className="text-lg md:text-2xl font-bold">
                            {itineraryEvent.name}
                          </div>
                          <div className="text-base md:text-xl text-white-600">
                            {dayjs(tripLeg.startDate)
                              .add(itineraryEvent.startDateOffset, 'day')
                              .format('MMM DD, YYYY')}{' '}
                            -{' '}
                            {dayjs(tripLeg.startDate)
                              .add(itineraryEvent.endDateOffset, 'day')
                              .format('MMM DD, YYYY')}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                }
                const { hotel } =
                  itineraryEvent.AllianceHotelBooking.allianceHotelObj;
                const { inDate, outDate } =
                  itineraryEvent.AllianceHotelBooking
                    .allianceReservationParameters;
                return (
                  <button
                    key={`stay_${itineraryEvent.id}`}
                    type="button"
                    className="w-full text-left bg-gray-113 p-3 rounded-md mb-5"
                    onClick={() => {
                      setSelectedTripLeg(tripLeg);
                      setSelectedItineraryEvent(itineraryEvent);
                    }}
                  >
                    <Image
                    loading="lazy"
                      src={hotel.images[0].sourceImageUrl.replace('_70', '_0')}
                      alt="hotel"
                      width={500}
                      height={375}
                      sizes="100vw"
                      className="w-full h-full max-h-[200px] object-cover rounded"
                    />
                    <div className="flex justify-between mt-2.5">
                      <div>
                        <div className="text-lg md:text-2xl font-bold">
                          {hotel.name}
                        </div>
                        <div className="text-base md:text-xl text-white-600">
                          {dayjs(inDate).format('MMM DD YYYY')} -{' '}
                          {dayjs(outDate).format('MMM DD YYYY')}
                        </div>
                      </div>
                      <div className="bg-green mb-auto py-1 px-2.5 text-base md:text-xl rounded">
                        Booked
                      </div>
                    </div>
                  </button>
                );
              })}
              <button
                className="bg-green p-2 md:p-4 flex w-full rounded-lg"
                type="button"
                onClick={() => handleAddStay(tripLeg)}
              >
                <div className="bg-black-500 px-2 py-3 rounded-md w-12 h-12">
                  <img
                    className="m-auto"
                    src="/assets/images/dashboard/stay.svg"
                    alt="stay"
                  />
                </div>
                <div className="text-base md:text-xl my-auto ml-3">
                  Add Stay
                </div>
              </button>
            </div>
            <div className="bg-black rounded-md p-3 md:p-5 pb-1 mb-2.5 md:mb-5">
              <Disclosure defaultOpen>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between mb-2.5">
                      <div className="text-lg md:text-2xl">Itinerary</div>
                      <FaChevronUp
                        className={`${
                          !open ? 'rotate-180 transform' : ''
                        } h-4 md:h-5 w-4 md:w-5 my-auto`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel>
                      {getDateArray(tripLeg).map((day) => {
                        const date: any = dayjs(startDate).add(day, 'days');
                        return (
                          <Disclosure key={`itinerary_${id}_${day}`}>
                            {({ open }) => (
                              <div className="mb-5">
                                <Disclosure.Button
                                  className={`flex w-full justify-between rounded-t-md bg-gray-333 p-4 ${
                                    !open ? 'rounded-b-md' : ''
                                  }`}
                                >
                                  <div className="flex flex-row">
                                    <div className="text-sm md:text-lg font-bold mr-5">
                                      DAY {day + 1}
                                    </div>
                                    <div className="text-sm md:text-base my-auto text-white-600">
                                      {getFormattedDate(date)}
                                    </div>
                                  </div>
                                  <FaChevronUp
                                    className={`${
                                      !open ? 'rotate-180 transform' : ''
                                    } h-4 md:h-5 w-4 md:w-5 my-auto`}
                                  />
                                </Disclosure.Button>
                                <Disclosure.Panel className="bg-gray-26 p-4">
                                  <div className="flex flex-row m-auto justify-center py-7 bg-gray-15 rounded-xl border-dashed border border-red cursor-pointer">
                                    <FaPlus className="h-4 md:h-5 w-4 md:w-5" />
                                    <div className="text-sm md:text-lg font-bold ml-1">
                                      Add Event
                                    </div>
                                  </div>
                                </Disclosure.Panel>
                              </div>
                            )}
                          </Disclosure>
                        );
                      })}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>

            <div className="bg-black rounded-md p-2 md:p-4 mb-2.5 md:mb-5">
              <div className="text-lg md:text-2xl mb-2.5">Flight</div>
              <button
                className="bg-blue p-2 md:p-4 flex rounded-md w-full"
                type="button"
              >
                <div className="bg-black-500 px-2 py-3 rounded-md w-12 h-12">
                  <img
                    className="m-auto"
                    src="/assets/images/dashboard/plane.svg"
                    alt="plane"
                  />
                </div>
                <div className="text-base md:text-xl my-auto ml-3">
                  Add Flight
                </div>
              </button>
            </div>
          </div>
        );
      })}
      <AddDestinationButton onAddDestination={handleAddDestination} />
      <SelectLocationModal
        isDark
        isOpen={isDestinationModalOpen}
        onClose={() => {
          setIsDestinationModalOpen(false);
        }}
        onAddCity={handleAddDestination}
        isUpdate
      />
      <EditDateModal
        city={selectedCity}
        isOpen={isDatesModalOpen}
        onClose={() => setIsDatesModalOpen(false)}
        dates={{
          startDate: null,
          endDate: null,
        }}
        onUpdate={handleAddOrUpdate}
      />
      {selectedTripLeg && (
        <BookHotelDrawer
          isOpen={isBookHotelDrawerOpen}
          onClose={() => {
            setIsBookHotelDrawerOpen(false);
          }}
          tripLeg={selectedTripLeg}
        />
      )}
      {selectedItineraryEvent && (
        <BookedHotelDrawer
          isOpen={!!selectedItineraryEvent}
          onClose={() => setSelectedItineraryEvent(null)}
          itineraryEvent={selectedItineraryEvent}
          users={users}
          tripLeg={selectedTripLeg}
        />
      )}
    </div>
  );
}
