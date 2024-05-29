import { useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft } from 'react-icons/fa';
import dayjs from 'dayjs';

import MapIcon from '@/../public/assets/images/bookhotel/map.svg';
import SortIcon from '@/../public/assets/images/bookhotel/sort.svg';
import FilterIcon from '@/../public/assets/images/bookhotel/filter.svg';
import ListIcon from '@/../public/assets/images/bookhotel/list.svg';

import Hotels from './Hotels';
import { HotelsMap } from '../HotelsMap';

const viewTypes = [
  { label: 'Map', icon: MapIcon },
  { label: 'List', icon: ListIcon },
];

type HotelsViewProps = {
  isLoading: boolean;
  hotels: any;
  filterInfo: any;
  tripLeg: any;
  onHotelSelect: Function;
  onSortModalOpen: Function;
  onFilterModalOpen: Function;
  onSearchModalOpen: Function;
  onComplete: Function;
};

export default function HotelsView({
  isLoading,
  hotels,
  filterInfo,
  tripLeg,
  onHotelSelect,
  onSortModalOpen,
  onFilterModalOpen,
  onSearchModalOpen,
  onComplete,
}: HotelsViewProps) {
  const [viewTypeIndex, setViewTypeIndex] = useState<number>(0);
  const { startDate, endDate } = filterInfo;

  const handleViewTypeChange = () => {
    if (viewTypeIndex === 0) setViewTypeIndex(1);
    else setViewTypeIndex(0);
  };

  const renderDateRange = () => {
    if (!startDate || !endDate) return null;
    return (
      <div className="flex ml-auto my-auto text-sm md:text-lg whitespace-nowrap">
        <div className="underline underline-offset-2">
          {dayjs(startDate).format('MMM DD')}
        </div>
        <div className="mx-1">-</div>
        <div className="underline underline-offset-2">
          {dayjs(endDate).format('MMM DD')}
        </div>
      </div>
    );
  };
  return (
    <div className="p-3 md:p-6">
      <div className="relative">
        <div className="absolute bg-green w-full h-full rounded-xl bg-cover bg-no-repeat bg-[url('/assets/images/landingpage/landing_page.png')]" />
        <div className="absolute bg-gradient-to-b from-black-300 to-[#1D1D1D] w-full h-full rounded-lg" />
        <div className="relative p-5 md:p-10 z-10">
          <button
            className="p-5 flex bg-black text-white border-4 border-green rounded-lg w-full text-left"
            type="button"
            onClick={() => {
              onSearchModalOpen();
            }}
          >
            <FaChevronLeft className="my-auto text-xl md:text-3xl mr-2 md:mr-5" />
            <div className="w-full">
              <div className="text-base md:text-xl my-auto text-ellipsis overflow-hidden">
                {filterInfo.City.name}, {filterInfo.City.country}
              </div>
            </div>
            {renderDateRange()}
          </button>

          <div className="flex mt-5">
            <button
              className="flex w-1/3 justify-center border-r border-white-500"
              type="button"
              onClick={() => {
                if (viewTypeIndex === 1) return;
                onSortModalOpen();
              }}
            >
              <Image
              loading="lazy"
                className="my-auto"
                src={SortIcon}
                alt="sort"
                style={{ width: '20px', height: 'auto' }}
              />
              <div className="text-base md:text-xl ml-3.5 my-auto">Sort</div>
            </button>
            <button
              className="flex w-1/3 justify-center border-r border-white-500"
              type="button"
              onClick={() => {
                if (viewTypeIndex === 1) return;
                onFilterModalOpen();
              }}
            >
              <Image
              loading="lazy"
                className="my-auto"
                src={FilterIcon}
                alt="filter"
                style={{ width: '20px', height: 'auto' }}
              />
              <div className="text-base md:text-xl ml-3.5 my-auto">Filter</div>
            </button>
            <button
              className="flex w-1/3 justify-center"
              type="button"
              onClick={handleViewTypeChange}
            >
              <Image
              loading="lazy"
                className="my-auto"
                src={viewTypes[viewTypeIndex].icon}
                alt="map"
                style={{ width: '20px', height: 'auto' }}
              />
              <div className="text-base md:text-xl ml-3.5 my-auto">
                {viewTypes[viewTypeIndex].label}
              </div>
            </button>
          </div>
        </div>
      </div>
      {
        {
          0: (
            <Hotels
              hotels={hotels}
              onHotelSelect={onHotelSelect}
              tripLeg={tripLeg}
              onComplete={onComplete}
              isLoading={isLoading}
            />
          ),
          1: (
            <HotelsMap
              hotels={hotels}
              onHotelSelect={onHotelSelect}
              center={{
                lat: parseFloat(filterInfo.City.latitude),
                lng: parseFloat(filterInfo.City.longitude),
              }}
              stayNights={dayjs(endDate).diff(startDate, 'day')}
            />
          ),
        }[viewTypeIndex]
      }
    </div>
  );
}
