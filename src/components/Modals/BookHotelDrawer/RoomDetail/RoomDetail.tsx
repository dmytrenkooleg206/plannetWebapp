import { useEffect, useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import { Disclosure } from '@headlessui/react';
import { FaChevronDown, FaChevronUp, FaChevronLeft } from 'react-icons/fa';

import UsersIcon from '@/../public/assets/images/bookhotel/users.svg';
import NoRefundIcon from '@/../public/assets/images/bookhotel/norefund.svg';
import PayNowIcon from '@/../public/assets/images/bookhotel/paynow.svg';

type RoomDetailProps = {
  hotelInfo: any;
  onPrev: Function;
  onContinue: Function;
};
export default function RoomDetail({
  hotelInfo,
  onPrev,
  onContinue,
}: RoomDetailProps) {
  const { hotel, rooms } = hotelInfo;
  const [roomDetails, setRoomDetails] = useState<any>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  useEffect(() => {
    const details: any = [];
    if (rooms.Deluxe.Unknown)
      details.push({
        key: 'Deluxe',
        typeName: 'Deluxe Room',
        rooms: [...rooms.Deluxe.Unknown],
      });
    else if (rooms.Standard.Unknown)
      details.push({
        key: 'Standard',
        typeName: 'Standard Room',
        rooms: [...rooms.Standard.Unknown],
      });
    else if (rooms.Suite.Unknown)
      details.push({
        key: 'Suite',
        typeName: 'Suite',
        rooms: [...rooms.Suite.Unknown],
      });
    else if (rooms.Unknown.Unknown)
      details.push({
        key: 'Special',
        typeName: 'Special Offers',
        rooms: [...rooms.Unknown.Unknown],
      });
    setRoomDetails(details);
  }, [rooms]);

  const getTotalPrice = (room: any) => {
    const { checkInOut, offers } = room;
    const { nightlyRate } = offers[0];
    const perNight = nightlyRate.FxConvertedAmounts.rateCents / 100;
    const stayDays = dayjs(checkInOut.checkOutDate).diff(
      checkInOut.checkInDate,
      'day',
    );
    return (perNight * stayDays).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="relative flex flex-col h-full">
      <div className="w-full p-6 grow">
        <div className="relative">
          <div className="absolute bg-green w-full h-full rounded-xl bg-cover bg-no-repeat bg-[url('/assets/images/landingpage/landing_page.png')]" />
          <div className="absolute bg-gradient-to-b from-black-300 to-black-900 w-full h-full rounded-lg" />
          <div className="relative p-5 md:p-10 z-10">
            <div className="text-xl md:text-3xl">{hotel.name}</div>
          </div>
        </div>
        <button
          className="bg-green text-white w-10 md:w-12 h-10 md:h-12 absolute rounded-full flex top-3 left-3 z-20"
          type="button"
          onClick={() => onPrev()}
        >
          <FaChevronLeft className="text-lg md:text-2xl m-auto" />
        </button>
        <div className="grow">
          {roomDetails.map((detail: any) => {
            const { rooms } = detail;
            return (
              <div className="mt-5" key={detail.key}>
                <Disclosure defaultOpen>
                  <Disclosure.Button className="w-full">
                    {({ open }) => (
                      <div
                        className={`flex justify-between p-5 bg-black text-white w-full rounded-t-lg ${
                          !open ? 'rounded-b-lg' : ''
                        }`}
                      >
                        <div className="text-xl md:text-3xl font-bold">
                          {detail.typeName}
                        </div>
                        {!open ? (
                          <FaChevronDown className="text-3xl my-auto" />
                        ) : (
                          <FaChevronUp className="text-3xl my-auto" />
                        )}
                      </div>
                    )}
                  </Disclosure.Button>
                  <Disclosure.Panel className="bg-black px-5 py-2">
                    {rooms?.map((room: any) => {
                      const { checkInOut, offers } = room;
                      const { nightlyRate, description } = offers[0];
                      const perNight =
                        nightlyRate.FxConvertedAmounts.rateCents / 100;
                      const stayDays = dayjs(checkInOut.checkOutDate).diff(
                        checkInOut.checkInDate,
                        'day',
                      );
                      return (
                        <button
                          key={room.id}
                          type="button"
                          className="border-t border-white-200 py-5 text-left w-full"
                          onClick={() => setSelectedRoom(room)}
                        >
                          <div className="flex">
                            <Image
                            loading="lazy"
                              src={UsersIcon}
                              alt="users"
                              style={{ width: '20px', height: 'auto' }}
                            />
                            <div className="text-green text-base md:text-xl ml-2">
                              Price for 2 adults
                            </div>
                          </div>
                          <div className="flex flex-wrap my-2.5 text-base md:text-xl text-white-500">
                            <span className="text-white text-lg md:text-2xl font-bold mr-2">
                              ${perNight.toFixed(2)}
                            </span>
                            <span className="mt-auto">/ Night</span>
                            <span className="text-white text-lg md:text-2xl font-bold mx-2">
                              • ${getTotalPrice(room)}
                            </span>
                            <span className="mt-auto"> for </span>
                            <span className="mx-1 text-white text-lg md:text-2xl font-bold">
                              {stayDays}
                            </span>
                            <span className="mt-auto"> night(s) </span>
                            {selectedRoom?.id === room.id ? (
                              <div className="w-7 h-7 bg-white rounded-full ml-auto border-4 border-green flex">
                                <div className="w-3 h-3 bg-green rounded-full m-auto" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 bg-white rounded-full ml-auto" />
                            )}
                          </div>
                          <div className="text-base md:text-xl text-white-500">
                            {description}
                          </div>
                          <div className="flex my-2.5">
                            <Image
                            loading="lazy"
                              src={NoRefundIcon}
                              alt="no refund"
                              style={{ width: '20px', height: 'auto' }}
                            />
                            <div className="text-base md:text-xl text-white-500 ml-2">
                              Non refundable
                            </div>
                          </div>
                          <div className="flex">
                            <Image
                            loading="lazy"
                              src={PayNowIcon}
                              alt="pay now"
                              style={{ width: '20px', height: 'auto' }}
                            />
                            <div className="text-base md:text-xl text-white-500 ml-2">
                              Pay now
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </Disclosure.Panel>
                </Disclosure>
              </div>
            );
          })}
        </div>
      </div>
      {selectedRoom && (
        <div className="sticky bottom-0 left-0 bg-green py-5 px-7 flex justify-between">
          <div>
            <div className="text-lg md:text-2xl font-bold">
              {getTotalPrice(selectedRoom)}
            </div>
            <div className="text-base md:text-xl text-white-600">
              Price for 2 adults
            </div>
          </div>
          <button
            className="bg-white text-green rounded-lg px-7 text-lg md:text-2xl font-bold"
            type="button"
            onClick={() => onContinue(selectedRoom)}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
