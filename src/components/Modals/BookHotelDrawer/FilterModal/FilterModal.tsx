import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';

import Loader from '@/components/Loader/Loader';
import Button from '@/components/Button/Button';

import { useDebounce } from '@/hooks/useDebounce';

import { type GetHotelsRequest } from '@/api/beHotel/beHotel.types';

import { getHotels } from '@/api/beHotel/beHotel.service';

import SearchIcon from '@/../public/assets/images/bookhotel/search.svg';
import StarIcon from '@/../public/assets/images/bookhotel/star_outline.svg';

import PNModal from '../../PNModal';
import { type FilterInfoType } from '../BookHotelDrawer.type';

type FilterModalProps = {
  isOpen: boolean;
  onClose: Function;
  onChange: Function;
  onSelectHotel: Function;
  filterInfo: FilterInfoType;
};

const budgets = [
  { key: 'budget_1', text: '$200 - $400', min: 20000, max: 40000 },
  { key: 'budget_2', text: '$400 - $600', min: 40000, max: 60000 },
  { key: 'budget_3', text: '$600 - $800', min: 60000, max: 80000 },
  { key: 'budget_4', text: '$800+', min: 80000, max: 0 },
];
const ratings = [
  { key: 'ratings_1', text: 'Any', star: 1 },
  { key: 'ratings_2', text: '2+', star: 2 },
  { key: 'ratings_3', text: '3+', star: 3 },
  { key: 'ratings_4', text: '4+', star: 4 },
  { key: 'ratings_5', text: '5', star: 5 },
];

export default function FilterModal({
  isOpen,
  onClose,
  filterInfo,
  onChange,
  onSelectHotel,
}: FilterModalProps) {
  const [newFilterInfo, setNewFilterInfo] = useState({ ...filterInfo });

  const [searchText, setSearchText] = useState<string>('');
  const debouncedSearchText = useDebounce(searchText, 300);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [hotels, setHotels] = useState<any[]>([]);

  const getHotelsData = async (property: string) => {
    try {
      setIsLoading(true);
      const params: GetHotelsRequest = {
        latitude: filterInfo.City.latitude,
        longitude: filterInfo.City.longitude,
        startDate: filterInfo.startDate,
        endDate: filterInfo.endDate,
        numRooms: filterInfo.numRooms,
        numAdultsPerRoom: 2,
        sortBy: 'best',
        source: 'alliance',
        page: 1,
        numResults: 50,
        isParsedRooms: true,
        hotelName: property,
      };
      const { newHotels } = await getHotels(params);
      setHotels([...newHotels]);
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(
    () => {
      if (debouncedSearchText && debouncedSearchText.length > 1) {
        getHotelsData(debouncedSearchText);
      } else {
        setHotels([]);
      }
    },
    [debouncedSearchText], // Only call effect if debounced search term changes
  );

  const handleSearchTextChange = (newSearch: string) => {
    if (isLoading) return;
    setSearchText(newSearch);
  };

  const getIndex = (star: number) => {
    if (!newFilterInfo.starsArr?.length) return -1;
    return newFilterInfo.starsArr.indexOf(star);
  };

  const updateRating = (star: number) => {
    const tempStarArr = [...newFilterInfo.starsArr];
    const index = getIndex(star);
    if (index === -1) tempStarArr.push(star);
    else tempStarArr.splice(index, 1);
    setNewFilterInfo({
      ...newFilterInfo,
      starsArr: [...tempStarArr],
    });
  };

  return (
    <PNModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="flex justify-between mb-5">
        <div className="texl-xl md:text-3xl">All Filters</div>
        <button
          className="texl-lg md:text-2xl text-green"
          type="button"
          onClick={() => {
            setNewFilterInfo({
              ...newFilterInfo,
              minNightlyRateUsdCents: 0,
              maxNightlyRateUsdCents: 0,
              starsArr: [],
            });
            setSearchText('');
            setHotels([]);
          }}
        >
          Reset
        </button>
      </div>
      <div className="bg-black p-5 rounded-lg">
        <div className="text-lg md:text-2xl mb-2">Search by property name</div>
        <div className="flex flex-row bg-black border border-white-300 py-3 px-5 rounded-md">
          <Image
            className="my-auto mr-4"
            loading="lazy"
            src={SearchIcon}
            alt="location"
            style={{ width: '20px', height: 'auto' }}
          />
          <input
            className="w-full bg-black outline-none text-lg md:text-2xl"
            placeholder="e.g. Marriott"
            autoComplete="off"
            value={searchText}
            onChange={(e: any) => handleSearchTextChange(e.target.value)}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="bg-black rounded-xl p-5 my-2.5 w-full">
          <Loader color="white" />
        </div>
      ) : (
        <div className="max-h-[300px] overflow-y-auto">
          {hotels.map((hotelInfo) => {
            const { name, allianceMetadata, address } = hotelInfo.hotel;
            return (
              <button
                className="bg-black rounded-xl p-5 my-2.5 w-full text-left"
                key={`search_${allianceMetadata.id}`}
                type="button"
                onClick={() => onSelectHotel(hotelInfo)}
              >
                <div className="text-lg md:text-2xl">{name}</div>
                <div className="text-base md:text-xl text-white-700">
                  {address.line1}, {address.city}
                </div>
              </button>
            );
          })}
        </div>
      )}
      <div className="bg-black p-5 rounded-lg my-5">
        <div className="text-lg md:text-2xl mb-2">Your Budget</div>
        <div className="flex flex-wrap">
          {budgets.map((budget) => {
            return (
              <button
                key={budget.key}
                type="button"
                className={`text-lg md:text-2xl text-white-800 py-1 px-2 rounded-lg border-2 mr-4 mb-4 ${
                  newFilterInfo.minNightlyRateUsdCents === budget.min
                    ? 'bg-green border-white'
                    : 'border-white-300'
                } `}
                onClick={() => {
                  setNewFilterInfo({
                    ...newFilterInfo,
                    minNightlyRateUsdCents: budget.min,
                    maxNightlyRateUsdCents: budget.max,
                  });
                }}
              >
                {budget.text}
              </button>
            );
          })}
        </div>
      </div>
      <div className="bg-black p-5 rounded-lg mb-5">
        <div className="text-lg md:text-2xl mb-2">Filter By</div>
        <div className="text-base md:text-xl mb-2">Hotel Star Rating</div>
        <div className="flex flex-wrap">
          {ratings.map((rating) => {
            return (
              <button
                key={rating.key}
                type="button"
                className={`text-lg md:text-2xl text-white-800 py-1 px-2 rounded-lg border-2 mr-4 mb-4 flex ${
                  getIndex(rating.star) !== -1
                    ? 'bg-green border-white'
                    : 'border-white-300'
                }`}
                onClick={() => updateRating(rating.star)}
              >
                <div>{rating.text}</div>
                <Image
                  className="my-auto ml-2"
                  src={StarIcon}
                  loading="lazy"
                  alt="star"
                  style={{ width: '20px', height: 'auto' }}
                />
              </button>
            );
          })}
        </div>
      </div>
      <Button
        text="Apply"
        onClick={() => onChange(newFilterInfo)}
        color="green"
      />
    </PNModal>
  );
}
