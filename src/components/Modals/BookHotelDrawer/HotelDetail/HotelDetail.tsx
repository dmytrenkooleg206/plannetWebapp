import { useEffect, useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import {
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaCheck,
  FaChevronRight,
} from 'react-icons/fa';
import { Disclosure } from '@headlessui/react';
import GoogleMapReact from 'google-map-react';

import Button from '@/components/Button/Button';
import { Drawer } from '@/components/Drawer';
import { NumberSlider } from '@/components/NumberSlider';
import Loader from '@/components/Loader/Loader';

import { getFormattedDate } from '@/lib/utils';
import StarIcon from '@/../public/assets/images/bookhotel/star.svg';
import {
  type HotelImageType,
  type FilterInfoType,
} from '../BookHotelDrawer.type';

import { EditDateModal } from '../../EditDateModal';

type HotelDetailProps = {
  isHotelDetailLoading: boolean;
  hotelInfo: any;
  hotelDetail: any;
  filterInfo: FilterInfoType;
  onPrev: Function;
  onViewRoom: Function;
  onDatesUpdate: Function;
  onGuestRoomUpdate: Function;
};

export default function HotelDetail({
  isHotelDetailLoading,
  hotelInfo,
  filterInfo,
  hotelDetail,
  onPrev,
  onViewRoom,
  onDatesUpdate,
  onGuestRoomUpdate,
}: HotelDetailProps) {
  const { minPricePerNightCents, hotel } = hotelInfo;

  const [hotelImages, setHotelImages] = useState<string[]>([]);
  const [checkInOut, setCheckInOut] = useState<any>();

  const { amenities, address, description } = hotel;
  const { startDate, endDate, numAdults, numKids, numRooms } = filterInfo;
  const stayDays = dayjs(endDate).diff(startDate, 'day');
  const pricePerNight = minPricePerNightCents / 100;

  const [isAmentitiesDrawerOpen, setIsAmentitiesDrawerOpen] =
    useState<boolean>(false);
  const [isGuestsDrawerOpen, setIsGuestsDrawerOpen] = useState<boolean>(false);
  const [isDatesModalOpen, setIsDatesModalOpen] = useState<boolean>(false);

  const [adults, setAdults] = useState<number>(1);
  const [kids, setKids] = useState<number>(0);
  const [hotelRooms, setHotelRooms] = useState<number>(1);

  const [imageIndex, setImageIndex] = useState<number>(0);

  useEffect(() => {
    if (hotelDetail) {
      setHotelImages(
        hotelDetail?.hotel?.hotel?.images.map((image: HotelImageType) =>
          image.sourceImageUrl.replace('_70', '_0'),
        ),
      );
      setCheckInOut(hotelDetail?.hotel?.rooms[0].checkInOut);
    }
  }, [hotelDetail]);

  useEffect(() => {
    setAdults(numAdults);
    setKids(numKids);
    setHotelRooms(numRooms);
  }, [filterInfo]);

  return (
    <>
      <div className="p-6">
        <button
          className="bg-green text-white w-10 md:w-12 h-10 md:h-12 absolute rounded-full flex top-3 left-3 z-20"
          type="button"
          onClick={() => onPrev()}
        >
          <FaChevronLeft className="text-lg md:text-2xl m-auto" />
        </button>
        {isHotelDetailLoading ? (
          <div className="relative h-[420px] flex justify-center align-center">
            <Loader color="white" />
          </div>
        ) : (
          <div className="relative">
            <div className="h-[420px]">
              {hotelImages?.length ? (
                <Image
                  src={hotelImages[imageIndex]}
                  alt="hotel"
                  loading="lazy"
                  width={500}
                  height={281.5}
                  sizes="100vw"
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
        )}

        <div className="flex mt-5 justify-between">
          <div className="text-xl md:text-3xl font-bold pr-2">{hotel.name}</div>
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
        </div>
        <div className="text-base md:text-lg text-white-900 my-2">
          {hotel.address.city} •{' '}
          {hotel.location.distanceMiles
            ? parseFloat(hotel.location.distanceMiles).toFixed(2)
            : 0}{' '}
          mile from city center
        </div>
        <div className="bg-green p-3.5 rounded">
          <div className="text-lg md:text-2xl">
            $
            {(pricePerNight * stayDays).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="text-base md:text-lg text-white-700">
            for {stayDays} night(s),{' '}
            <span className="text-white">${pricePerNight} per night.</span>
          </div>
        </div>
        <div className="bg-black p-3.5 rounded mt-10 mb-7">
          <div className="flex justify-between">
            <div className="text-xl md:text-3xl font-bold">Amenities</div>
            <button
              className="text-green text-lg md:text-2xl underline"
              type="button"
              onClick={() => setIsAmentitiesDrawerOpen(true)}
            >
              View All
            </button>
          </div>
          {amenities.slice(0, 3).map((amenity: string) => {
            return (
              <div
                key={amenity}
                className="bg-gray-113 rounded p-3 mt-2.5 flex"
              >
                <div className="w-8 h-8 rounded-full bg-green flex ">
                  <FaCheck className="m-auto" />
                </div>
                <div className="text-white-700 text-lg md:text-2xl ml-2">
                  {amenity}
                </div>
              </div>
            );
          })}
          <div />
        </div>
        <div className="flex justify-between">
          <div className="text-lg md:text-2xl">Map</div>
          {/* <button
            className="text-green text-base md:text-xl underline"
            type="button"
            onClick={() => {}}
          >
            Get Direction
          </button> */}
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
        <div className="flex">
          <div className="w-1/2 bg-black py-3 px-5 border border-white-200 rounded-l-lg">
            <div className="text-lg md:text-2xl">Check in</div>
            <button
              className="text-base md:text-xl text-white-600 underline underline-offset-4"
              type="button"
              onClick={() => setIsDatesModalOpen(true)}
            >
              {getFormattedDate(startDate)}
            </button>
          </div>
          <div className="w-1/2 bg-black py-3 px-5 border-t border-b border-r border-white-200 rounded-r-lg">
            <div className="text-lg md:text-2xl">Check out</div>
            <button
              className="text-base md:text-xl text-white-600 underline underline-offset-4"
              type="button"
              onClick={() => setIsDatesModalOpen(true)}
            >
              {getFormattedDate(endDate)}
            </button>
          </div>
        </div>
        <div className="flex my-7">
          <div className="w-1/3 bg-black py-3 px-5 border border-white-200 rounded-l-lg">
            <button
              className="text-base md:text-xl text-white-600 underline underline-offset-4 flex mx-auto"
              type="button"
              onClick={() => setIsGuestsDrawerOpen(true)}
            >
              {numRooms} room
            </button>
          </div>
          <div className="w-1/3 bg-black py-3 px-5 border-t border-r border-b border-white-200">
            <button
              className="text-base md:text-xl text-white-600 underline underline-offset-4 flex mx-auto"
              type="button"
              onClick={() => setIsGuestsDrawerOpen(true)}
            >
              {numAdults} adults
            </button>
          </div>
          <div className="w-1/3 bg-black py-3 px-5 border-t border-b border-r border-white-200 rounded-r-lg ">
            <button
              className="text-base md:text-xl text-white-600 underline underline-offset-4 flex mx-auto"
              type="button"
              onClick={() => setIsGuestsDrawerOpen(true)}
            >
              {numKids || 'no'} children
            </button>
          </div>
        </div>
        <div className="text-lg md:text-2xl">Details</div>
        <div className="text-base text-white-700 my-3">{description}</div>
        <div className="my-8">
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
                  This property offers transfers from the airport (surcharges
                  may apply). Guests must contact the property with arrival
                  details before travel, using the contact information on the
                  booking confirmation. Front desk staff will greet guests on
                  arrival.
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
                  <div className="text-lg md:text-2xl">
                    Important Information
                  </div>
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
                  - Extra-person charges may apply and vary depending on
                  property policy
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
              <div className="bg-black p-5 rounded-lg my-5">
                <div className="text-base md:text-xl font-bold mb-2">
                  Special Check-In Instructions
                </div>
                <div className="text-lg text-white-700">
                  {` This property offers transfers from the airport (surcharges
                  may apply). Guests must contact the property with arrival
                  details before travel, using the contact information on the
                  booking confirmation. The front desk is open daily from 7 AM -
                  10 PM. This property doesn't offer after-hours check-in. Front
                  desk staff will greet guests on arrival.`}
                </div>
              </div>
              <div className="bg-black p-5 rounded-lg">
                <div className="text-base md:text-xl font-bold mb-2">
                  Policies
                </div>
                <div className="text-lg text-white-700">
                  Reservations are required for massage services and spa
                  treatments. Reservations can be made by contacting the hotel
                  prior to arrival, using the contact information on the booking
                  confirmation.
                </div>
              </div>
            </Disclosure.Panel>
          </Disclosure>
        </div>
        <Button text="View Rooms" color="green" onClick={() => onViewRoom()} />
      </div>

      <Drawer
        isOpen={isAmentitiesDrawerOpen}
        onClose={() => setIsAmentitiesDrawerOpen(false)}
      >
        <div className="p-6">
          <div className="text-lg md:text-2xl">Property ammentities</div>
          <div className="overflow-y-auto mb-2">
            {amenities.map((amenity: string) => {
              return (
                <div
                  key={amenity}
                  className=" bg-black rounded p-3 mt-2.5 flex"
                >
                  <div className="w-7 h-7 rounded-full bg-green flex ">
                    <FaCheck className="m-auto" />
                  </div>
                  <div className="text-white text-base md:text-lg ml-2 my-auto">
                    {amenity}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Drawer>

      <Drawer
        isOpen={isGuestsDrawerOpen}
        onClose={() => setIsGuestsDrawerOpen(false)}
        maxWidth="max-w-[400px]"
      >
        <div className="p-6">
          <div className="text-lg md:text-2xl">Guest(s) and Room(s)</div>
          <div className="text-black mb-5">
            <NumberSlider
              title="Adults"
              description="18+ years"
              value={adults}
              min={1}
              onChange={(val: number) => setAdults(val)}
            />
            <NumberSlider
              title="Kids"
              description="0-17 years"
              value={kids}
              onChange={(val: number) => setKids(val)}
            />
            <NumberSlider
              title="Rooms"
              description=""
              value={hotelRooms}
              min={1}
              onChange={(val: number) => setHotelRooms(val)}
            />
          </div>
          <Button
            text="Update"
            color="green"
            onClick={() => {
              setIsGuestsDrawerOpen(false);
              onGuestRoomUpdate(adults, kids, hotelRooms);
            }}
          />
        </div>
      </Drawer>

      <EditDateModal
        isOpen={isDatesModalOpen}
        onClose={() => setIsDatesModalOpen(false)}
        dates={{
          startDate,
          endDate,
        }}
        onUpdate={onDatesUpdate}
      />
    </>
  );
}
