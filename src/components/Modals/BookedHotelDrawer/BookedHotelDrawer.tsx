import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import Loader from '@/components/Loader/Loader';
import {
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import {
  updateGuests,
  deleteItineraryEvent,
} from '@/api/itineraryEvent/itineraryEvent.service';
import { Disclosure } from '@headlessui/react';
import GoogleMapReact from 'google-map-react';

import { Drawer } from '@/components/Drawer';
import Button from '@/components/Button/Button';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';

import { getFormattedDate } from '@/lib/utils';

import { queryClient } from '@/pages/_app';

import StarIcon from '@/../public/assets/images/bookhotel/star.svg';
import UsersIcon from '@/../public/assets/images/bookhotel/users.svg';
import RoomIcon from '@/../public/assets/images/bookhotel/room.svg';
import { CustomStayModal } from '../CustomStayModal';

type BookedHotelDrawerProps = {
  isOpen: boolean;
  onClose: Function;
  itineraryEvent: any;
  users: any;
  tripLeg: any;
};
export default function BookedHotelDrawer({
  isOpen,
  onClose,
  itineraryEvent: itineraryEventParam,
  users,
  tripLeg,
}: BookedHotelDrawerProps) {
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  const [itineraryEvent, setItineraryEvent] = useState<any>(null);
  const [showHours, setShowHours] = useState<boolean>(false);
  const [isRemovingGuest, setIsRemovingGuest] = useState<boolean>(false);

  useEffect(() => {
    setItineraryEvent(itineraryEventParam);
  }, [itineraryEventParam]);

  const handleDeleteStay = async () => {
    try {
      setIsOpenConfirmModal(false);
      onClose();
      await deleteItineraryEvent({
        ItineraryEventId: itineraryEvent.id,
      });
      queryClient.invalidateQueries(['trip', tripLeg.TripId]);
      toast.success('Deleted Stay successfully');
    } catch (error) {
      toast.error('Error while deleting Stay');
    }
  };

  const onRemoveGuest = async (user: any) => {
    setIsRemovingGuest(true);
    const tripGuestIds: string[] = [];

    itineraryEvent.ItineraryEventGuests.forEach((guest: any) => {
      if (user.TripGuest.id !== guest.TripGuestId)
        tripGuestIds.push(guest.TripGuestId);
    });

    try {
      await updateGuests({
        ItineraryEventId: itineraryEvent.id,
        TripGuestIds: tripGuestIds,
      });
      queryClient.invalidateQueries(['trip', tripLeg.TripId]);
    } catch (error) {
      toast.error('Error while removing guests!');
    } finally {
      setIsRemovingGuest(false);
    }
  };

  const renderContent = () => {
    if (!itineraryEvent || itineraryEvent.type !== 'STAY') return null;
    if (!itineraryEvent.AllianceHotelBooking) {
      const { name, address, startDateOffset, endDateOffset, BusinessEntity } =
        itineraryEvent;
      const { hours, phoneNumber, latitude, longitude } = BusinessEntity;
      const hoursArr = hours ? hours.split(',') : [];
      return (
        <div className="p-6">
          <div className="h-[340px]">
            <Image
              src={`${BusinessEntity.photoUrl_CF}_720`}
              alt="hotel"
              width={500}
              height={281.5}
              sizes="100vw"
              loading="lazy"
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="text-xl md:text-3xl font-bold pr-2 mt-5">{name}</div>
          <div className="flex bg-black p-3.5 rounded-md my-5">
            <div className="w-1/2">
              <div className="text-lg md:text-2xl">Start Date</div>
              <div className="text-base md:text-xl text-white-600">
                {dayjs(tripLeg.startDate)
                  .add(startDateOffset, 'day')
                  .format('MMM DD, YYYY')}
              </div>
            </div>
            <div className="w-1/2">
              <div className="text-lg md:text-2xl">End Date</div>
              <div className="text-base md:text-xl text-white-600">
                {dayjs(tripLeg.startDate)
                  .add(endDateOffset, 'day')
                  .format('MMM DD, YYYY')}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-5">
            <div className="text-lg md:text-2xl">Map</div>
          </div>
          <div className="w-full h-[280px] mt-3.5">
            <GoogleMapReact
              yesIWantToUseGoogleMapApiInternals
              bootstrapURLKeys={{
                key: process.env.NEXT_PUBLIC_GOOGLE_MAP as string,
              }}
              defaultCenter={{
                lat: parseFloat(latitude),
                lng: parseFloat(longitude),
              }}
              defaultZoom={14}
              onGoogleApiLoaded={({ map, maps }) => {
                const marker = new maps.Marker({
                  position: {
                    lat: parseFloat(latitude),
                    lng: parseFloat(longitude),
                  },
                  map,
                  title: 'hotel',
                });
              }}
            />
          </div>
          <div className="bg-black rounded-md p-4 mt-7">
            <div className="text-base md:text-xl">{address}</div>
            <div className="flex mt-7 text-base md:text-xl ">
              <div className="text-gray-814">Phone</div>
              <div className="ml-5 underline underline-offset-4">
                {phoneNumber}
              </div>
            </div>
            <div className="flex mt-3 text-base md:text-xl ">
              <div className="flex">
                <div className="text-gray-814">Hours</div>
                <button
                  className="flex ml-5 mt-1 mb-auto text-gray-814"
                  type="button"
                  onClick={() => setShowHours(!showHours)}
                >
                  {!showHours ? (
                    <FaChevronDown className="my-auto mr-2" />
                  ) : (
                    <FaChevronUp className="my-auto mr-2" />
                  )}
                </button>
              </div>
              {hoursArr.length ? (
                <div className="">
                  <div>{hoursArr[0]}</div>
                  {showHours && (
                    <div>
                      {hoursArr.slice(1).map((hour: string) => (
                        <div key={hour}>{hour}</div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div />
              )}
            </div>
          </div>
          <div className="text-lg md:text-2xl font-bold mt-5 mb-2">Website</div>
          <div className="bg-black text-lg md:text-xl p-4 rounded-md text-white-800 mb-8 text-ellipsis overflow-hidden">
            {itineraryEvent.websiteUrl}
          </div>
          <Button
            text="Edit Stay"
            color="green"
            onClick={() => setIsOpenEditModal(true)}
          />
          <div className="mt-5">
            <Button
              text="Delete Stay"
              color="red"
              onClick={() => setIsOpenConfirmModal(true)}
            />
          </div>
        </div>
      );
    }
    const { description1, ItineraryEventGuests } = itineraryEvent;
    const { hotel, rooms } =
      itineraryEvent.AllianceHotelBooking.allianceHotelObj;
    const {
      adults,
      children,
      rooms: numRooms,
    } = itineraryEvent.AllianceHotelBooking.allianceReservationParameters;
    const { checkInOut } = rooms[0];
    const { address } = hotel;
    const {
      roomCostPrice,
      roomCostTaxAmount,
      roomCostTotalAmount,
      inDate,
      outDate,
    } = itineraryEvent.AllianceHotelBooking.allianceReservationParameters;
    const { images: hotelImages } = hotel;
    const stayNights = dayjs(outDate).diff(inDate, 'day');
    return (
      <div className="p-6">
        <div className="relative">
          <div className="h-[420px]">
            {hotelImages?.length ? (
              <Image
                src={hotelImages[imageIndex].sourceImageUrl.replace(
                  '_70',
                  '_0',
                )}
                alt="hotel"
                width={500}
                height={281.5}
                sizes="100vw"
                loading="lazy"
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="bg-black w-full" />
            )}
          </div>
          <div
            role="presentation"
            className="absolute right-0 top-0 w-1/4 h-full hover:bg-black-300 cursor-pointer flex"
            onClick={() => {
              if (hotelImages?.length > imageIndex + 1)
                setImageIndex(imageIndex + 1);
            }}
          >
            <FaChevronRight className="ml-auto mr-5 my-auto text-5xl" />
          </div>
          <div
            role="presentation"
            className="absolute left-0 top-0 w-1/4 h-full hover:bg-black-300 cursor-pointer flex"
            onClick={() => {
              if (imageIndex > 0) setImageIndex(imageIndex - 1);
            }}
          >
            <FaChevronLeft className="mr-auto ml-5 my-auto text-5xl" />
          </div>
          <div className="absolute right-5 bottom-3 bg-black-400 px-3 py-1 rounded-lg">
            {imageIndex + 1} / {hotelImages?.length}
          </div>
        </div>

        <div className="flex mt-5 justify-between">
          <div className="text-xl md:text-3xl font-bold pr-2">{hotel.name}</div>
          <div className="rounded-md bg-green px-3.5 py-1 mb-auto">Booked</div>
        </div>
        {/* <div className="text-base md:text-lg text-white-900 my-2">
          {hotel.address.city} •{' '}
          {hotel.location.distanceMiles
            ? parseFloat(hotel.location.distanceMiles).toFixed(2)
            : 0}{' '}
          mile from city center
        </div> */}
        <div className="flex mb-2 shrink-0 mt-1">
          <Image
            className="mt-0.5 mb-auto"
            src={StarIcon}
            alt="star"
            loading="lazy"
            style={{ width: '20px', height: 'auto' }}
          />
          <div className="text-lg md:text-xl text-white-600 ml-2">
            {hotel.numStars} star hotel
          </div>
        </div>

        <div className="bg-black p-3.5 rounded-md">
          <div className="flex">
            <div className="w-1/2 bg-black py-3 px-5 border border-white-200 rounded-l-lg">
              <div className="text-lg md:text-2xl">Check in</div>
              <div className="text-base md:text-xl text-white-600 underline underline-offset-4">
                {getFormattedDate(inDate)}
              </div>
            </div>
            <div className="w-1/2 bg-black py-3 px-5 border-t border-b border-r border-white-200 rounded-r-lg">
              <div className="text-lg md:text-2xl">Check out</div>
              <div className="text-base md:text-xl text-white-600 underline underline-offset-4">
                {getFormattedDate(outDate)}
              </div>
            </div>
          </div>
          <div className="flex pb-2 mt-2">
            <div className="w-1/2">
              <div className="flex mb-2">
                <Image
                loading="lazy"
                  className="my-auto"
                  src={UsersIcon}
                  alt="user"
                  style={{ width: '20px', height: 'auto' }}
                />
                <div className="text-base md:text-xl ml-2.5">Guests</div>
              </div>
              <div className="text-base md:text-xl text-white-600">
                {adults} adult(s)
              </div>
              <div className="text-base md:text-xl text-white-600">
                {children} children
              </div>
            </div>
            <div className="w-1/2">
              <div className="flex mb-2">
                <Image
                loading="lazy"
                  className="my-auto"
                  src={RoomIcon}
                  alt="room"
                  style={{ width: '20px', height: 'auto' }}
                />
                <div className="text-base md:text-xl ml-2.5">Room</div>
              </div>
              <div className="text-base md:text-xl text-green">
                {numRooms} room(s)
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black p-3.5 mt-5 rounded-md">
          <div className="text-lg md:text-2xl flex justify-start">
            Guests
            {isRemovingGuest && (
              <div className="w-16 ml-5">
                <Loader color="white" />
              </div>
            )}
          </div>
          {ItineraryEventGuests.map((guest: any) => {
            const user = users.find(
              (user: any) => user.TripGuest.id === guest.TripGuestId,
            );
            if (!user) return null;
            return (
              <div
                key={guest.id}
                className="flex my-2 justify-between items-center"
              >
                <div className="flex">
                  <Image
                    className="rounded flex"
                    width={48}
                    height={48}
                    loading="lazy"
                    src={
                      user?.profilePictureUrl_CF
                        ? `${user.profilePictureUrl_CF}_720`
                        : '/assets/images/planneritem/profile_placeholder.png'
                    }
                    alt="avatar"
                  />
                  <div className="text-base md:text-xl ml-2 my-auto">
                    {user.firstName || user.TripGuest.firstNameOnInvite}{' '}
                    {user.lastName || user.TripGuest.lastNameOnInvite}
                  </div>
                </div>
                <button
                  className="bg-black w-10 md:w-12 h-10 md:h-12 text-white flex z-20"
                  type="button"
                  onClick={() => onRemoveGuest(user)}
                >
                  <FaTrash className="text-lg md:text-2xl m-auto text-white" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between mt-5">
          <div className="text-lg md:text-2xl">Map</div>
        </div>
        <div className="w-full h-[280px] mt-3.5">
          <GoogleMapReact
            yesIWantToUseGoogleMapApiInternals
            bootstrapURLKeys={{
              key: process.env.NEXT_PUBLIC_GOOGLE_MAP as string,
            }}
            defaultCenter={{
              lat: hotel.location.latitude,
              lng: hotel.location.longitude,
            }}
            defaultZoom={14}
            onGoogleApiLoaded={({ map, maps }) => {
              const marker = new maps.Marker({
                position: {
                  lat: hotel.location.latitude,
                  lng: hotel.location.longitude,
                },
                map,
                title: hotel.name,
              });
            }}
          />
        </div>
        <div className="text-base md:text-xl text-white-700 my-5">
          {address.line1}, {address.city}, {address.countryCode},{' '}
          {address.postalCode}
        </div>

        <div className="text-lg md:text-2xl">Details</div>
        <div className="text-base md:text-lg text-white-600 mt-5 mb-3">
          {description1}
        </div>
        <div className="bg-black rounded-md p-3 mb-5">
          <div className="flex px-2 border-r border-t border-l border-white-600 bg-white-300">
            <div className="w-1/2 border-r border-white-300 p-1">
              Description
            </div>
            <div className="w-1/2 text-right text-white-600 p-1">Amount</div>
          </div>
          <div className="flex px-2 border-r border-t border-l border-white-600">
            <div className="w-1/2 border-r border-white-300 p-1">
              ${(roomCostPrice / stayNights).toFixed(2)} x {stayNights} night(s)
            </div>
            <div className="w-1/2 text-right text-white-600 p-1">
              ${roomCostPrice}
            </div>
          </div>
          <div className="flex px-2 border border-white-600">
            <div className="w-1/2 border-r border-white-300 p-1">
              Taxes and fees
            </div>
            <div className="w-1/2 text-right text-white-600 p-1">
              ${roomCostTaxAmount}
            </div>
          </div>
          <div className="flex px-2 border-r border-b border-l border-white-600">
            <div className="w-1/2 border-r border-white-300 p-1">Total</div>
            <div className="w-1/2 text-right p-1">${roomCostTotalAmount}</div>
          </div>
        </div>

        <Disclosure>
          <Disclosure.Button className="text-xl p-3 border-t border-white-300 w-full">
            {({ open }) => (
              <div className="flex justify-between">
                <div className="text-lg md:text-2xl">Policies</div>
                {!open ? <FaChevronDown /> : <FaChevronUp />}
              </div>
            )}
          </Disclosure.Button>
          <Disclosure.Panel className="mx-3">
            <div className="bg-black p-5 rounded-lg">
              <div className="text-base md:text-xl font-bold mb-2">
                Check-in
              </div>
              <div className="text-lg text-white-700">
                Check-in time is{' '}
                {checkInOut?.checkInTime ? checkInOut?.checkInTime : ''}.
              </div>
              <div className="text-lg text-white-700 my-3">
                You must be 18 to check in this property.
              </div>
              <div className="text-lg text-white-700">
                This property offers transfers from the airport (surcharges may
                apply). Guests must contact the property with arrival details
                before travel, using the contact information on the booking
                confirmation. Front desk staff will greet guests on arrival.
              </div>
            </div>
            <div className="bg-black p-5 rounded-lg my-5">
              <div className="text-base md:text-xl font-bold mb-2">
                Check-out
              </div>
              <div className="text-lg text-white-700">
                Check-out time is{' '}
                {checkInOut?.checkOutTime ? checkInOut?.checkOutTime : ''}.
              </div>
            </div>
          </Disclosure.Panel>
        </Disclosure>
        <Disclosure>
          <Disclosure.Button className="text-xl p-3 border-t border-white-300 w-full">
            {({ open }) => (
              <div className="flex justify-between">
                <div className="text-lg md:text-2xl">Important Information</div>
                {!open ? <FaChevronDown /> : <FaChevronUp />}
              </div>
            )}
          </Disclosure.Button>
          <Disclosure.Panel className="mx-3">
            <div className="bg-black p-5 rounded-lg">
              <div className="text-base md:text-xl font-bold mb-2">
                Instructions
              </div>
              <div className="text-lg text-white-700 li">
                - Extra-person charges may apply and vary depending on property
                policy
                <br /> - Government-issued photo identification and a credit
                card, debit card, or cash deposit may be required at check-in
                for incidental charges
                <br />- Special requests are subject to availability upon
                check-in and may incur additional charges; special requests
                cannot be guaranteed
                <br />- Safety features at this property include a fire
                extinguisher, a smoke detector, a security system, and a first
                aid kit
                <br />- Be prepared: check the latest COVID-19 travel
                requirements and measures in place for this destination before
                you travel
              </div>
            </div>
            <div className="bg-black p-5 rounded-lg my-5">
              <div className="text-base md:text-xl font-bold mb-2">
                Cancellation Info
              </div>
              <div className="text-lg text-white-700 li">Non refundable</div>
            </div>
          </Disclosure.Panel>
        </Disclosure>
      </div>
    );
  };
  return (
    <Drawer isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      {renderContent()}
      <ConfirmModal
        isOpen={isOpenConfirmModal}
        isDark
        onConfirm={() => handleDeleteStay()}
        onClose={() => setIsOpenConfirmModal(false)}
        text="Delete Stay?"
      />
      <CustomStayModal
        isOpen={isOpenEditModal}
        onClose={() => setIsOpenEditModal(false)}
        tripLeg={tripLeg}
        itineraryEvent={itineraryEvent}
        isUpdate
        onComplete={(updatedItineraryEvent: any) =>
          setItineraryEvent({
            ...updatedItineraryEvent,
            BusinessEntity: updatedItineraryEvent.Business,
          })
        }
      />
    </Drawer>
  );
}
