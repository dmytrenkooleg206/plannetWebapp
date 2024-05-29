import { useState } from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import dayjs from 'dayjs';

import { Drawer } from '@/components/Drawer';
import { NumberSlider } from '@/components/NumberSlider';

import SearchIcon from '@/../public/assets/images/bookhotel/search.svg';
import DateIcon from '@/../public/assets/images/bookhotel/calendar.svg';
import UserIcon from '@/../public/assets/images/bookhotel/user.svg';
import { type FilterInfoType } from '../BookHotelDrawer.type';
import PNModal from '../../PNModal';

import { EditDateModal } from '../../EditDateModal';
import { SelectLocationModal } from '../../SelectLocationModal';

type SearchModalProps = {
  isOpen: boolean;
  filterInfo: FilterInfoType;
  onClose: Function;
  onChange: Function;
};
export default function SearchModal({
  isOpen,
  onClose,
  onChange,
  filterInfo,
}: SearchModalProps) {
  const [newFilterInfo, setNewFilterInfo] = useState({ ...filterInfo });
  const [isDatesModalOpen, setIsDatesModalOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] =
    useState<boolean>(false);
  const [isGuestsDrawerOpen, setIsGuestsDrawerOpen] = useState<boolean>(false);

  return (
    <>
      <PNModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
        <button
          className="bg-black w-10 md:w-12 h-10 md:h-12 absolute rounded-full flex top-3 right-3 z-20"
          type="button"
          onClick={() => onClose()}
        >
          <FaTimes className="text-lg md:text-2xl m-auto" />
        </button>
        <div className="relative">
          <div className="absolute bg-green w-full h-full rounded-xl bg-cover bg-no-repeat bg-[url('/assets/images/landingpage/landing_page.png')]" />
          <div className="absolute bg-gradient-to-b from-black-300 to-[#1D1D1D] w-full h-full rounded-lg" />
          <div className="relative p-5 md:p-10 z-10">
            <div className="text-center text-3xl md:text-4xl sm:text-3xl my-auto truncate mx-auto">
              Edit your search
            </div>
            <div className="flex flex-col mt-5 bg-black border rounded-t-md border-white-150">
              <button
                className="h-16 flex items-center px-8 py-3 w-full border-b border-white-150 flex"
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
              >
                <Image
                  loading="lazy"
                  className="my-auto"
                  src={SearchIcon}
                  alt="location"
                  style={{ width: '20px', height: 'auto' }}
                />
                <div className="text-lg md:text-2xl text-white-600 ml-4">
                  {newFilterInfo.City.name}, {newFilterInfo.City.country}
                </div>
              </button>
              <button
                className="h-16 flex items-center px-8 py-3 w-full border-b border-white-150"
                type="button"
                onClick={() => setIsDatesModalOpen(true)}
              >
                <Image
                  loading="lazy"
                  className="my-auto"
                  src={DateIcon}
                  alt="date"
                  style={{ width: '20px', height: 'auto' }}
                />
                <div className="text-lg md:text-2xl text-white-600 ml-4">
                  {dayjs(newFilterInfo.startDate).format('ddd, MMM DD')} -{' '}
                  {dayjs(newFilterInfo.endDate).format('ddd, MMM DD')}
                </div>
              </button>
              <button
                className="h-16 flex items-center px-8 py-3 w-full"
                type="button"
                onClick={() => setIsGuestsDrawerOpen(true)}
              >
                <Image
                  className="my-auto"
                  loading="lazy"
                  src={UserIcon}
                  alt="user"
                  style={{ width: '20px', height: 'auto' }}
                />
                <div className="text-lg md:text-2xl text-white-600 ml-4">
                  {newFilterInfo.numRooms} room · {newFilterInfo.numAdults}{' '}
                  adult · {newFilterInfo.numKids ? newFilterInfo.numKids : 'No'}{' '}
                  children
                </div>
              </button>
            </div>
            <button
              className="w-full bottom-0 left-0 bg-green py-4 text-white rounded-b-lg px-7 text-lg md:text-xl font-bold"
              type="button"
              onClick={() => onChange(newFilterInfo)}
            >
              Search Hotels
            </button>
          </div>
        </div>
      </PNModal>
      <EditDateModal
        isOpen={isDatesModalOpen}
        onClose={() => setIsDatesModalOpen(false)}
        dates={{
          startDate: newFilterInfo.startDate,
          endDate: newFilterInfo.endDate,
        }}
        onUpdate={(range: any) => {
          setNewFilterInfo({
            ...newFilterInfo,
            startDate: dayjs(range[0]).format('YYYY-MM-DD'),
            endDate: dayjs(range[1]).format('YYYY-MM-DD'),
          });
          setIsDatesModalOpen(false);
        }}
      />
      <SelectLocationModal
        isDark
        isOpen={isLocationModalOpen}
        onClose={() => {
          setIsLocationModalOpen(false);
        }}
        onAddCity={(city: any) => {
          setNewFilterInfo({
            ...newFilterInfo,
            City: city,
          });
          setIsLocationModalOpen(false);
        }}
      />

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
              value={newFilterInfo.numAdults}
              min={1}
              onChange={(val: number) =>
                setNewFilterInfo({ ...newFilterInfo, numAdults: val })
              }
            />
            <NumberSlider
              title="Kids"
              description="0-17 years"
              value={newFilterInfo.numKids}
              onChange={(val: number) =>
                setNewFilterInfo({ ...newFilterInfo, numKids: val })
              }
            />
            <NumberSlider
              title="Rooms"
              description=""
              value={newFilterInfo.numRooms}
              min={1}
              onChange={(val: number) =>
                setNewFilterInfo({ ...newFilterInfo, numRooms: val })
              }
            />
          </div>
        </div>
      </Drawer>
    </>
  );
}
