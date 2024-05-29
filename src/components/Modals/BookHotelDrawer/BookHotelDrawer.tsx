import { useEffect, useState, useCallback } from 'react';
import { useInterval } from 'usehooks-ts';
import { toast } from 'react-toastify';

import { Drawer } from '@/components/Drawer';

import {
  getHotels,
  getAllianceRoomDetail,
} from '@/api/beHotel/beHotel.service';
import { type GetHotelsRequest } from '@/api/beHotel/beHotel.types';

import { getFormattedDate } from '@/lib/utils';
import { SortModal } from './SortModal';
import { type FilterInfoType } from './BookHotelDrawer.type';
import { HotelsView } from './HotelsView';
import { HotelDetail } from './HotelDetail';
import RoomDetail from './RoomDetail/RoomDetail';
import { FilterModal } from './FilterModal';
import { SearchModal } from './SearchModal';
import { PaymentStep } from './PaymentStep';

type BookHotelDrawerProps = {
  isOpen: boolean;
  onClose: Function;
  tripLeg: any;
};

export default function BookHotelDrawer({
  isOpen,
  onClose,
  tripLeg,
}: BookHotelDrawerProps) {
  const { City } = tripLeg;
  const numHotelsPerPage = 50;

  const [hotels, setHotels] = useState<any>([]);
  const [hasMoreHotelsToFetch, setHasMoreHotelsToFetch] = useState(true);
  const [restartFetch, setRestartFetch] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isHotelDetailLoading, setIsHotelDetailLoading] =
    useState<boolean>(false);

  const [isSortModalOpen, setIsSortModalOpen] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isViewRoom, setViewRoom] = useState<string>('no');
  const [hotelDetail, setHotelDetail] = useState<any>();

  const [sortBy, setSortBy] = useState<string>('best');

  const [filterInfo, setFilterInfo] = useState<FilterInfoType>({
    startDate: tripLeg.startDate,
    endDate: tripLeg.endDate,
    numAdults: tripLeg.numAdults ? tripLeg.numAdults : 1,
    numKids: tripLeg.numKids ? tripLeg.numKids : 0,
    numRooms: 1,
    City,
    minNightlyRateUsdCents: 0,
    maxNightlyRateUsdCents: 0,
    starsArr: [],
  });

  const getHotelsData = useCallback(async () => {
    if (isFetching) return;

    const newPage = currentPage + 1;

    setIsFetching(true);

    try {
      const params: GetHotelsRequest = {
        latitude: filterInfo.City.latitude,
        longitude: filterInfo.City.longitude,
        startDate: filterInfo.startDate,
        endDate: filterInfo.endDate,
        numRooms: filterInfo.numRooms,
        numAdultsPerRoom: 2,
        sortBy,
        source: 'alliance',
        page: newPage,
        numResults: numHotelsPerPage,
        isParsedRooms: true,
      };

      if (filterInfo.minNightlyRateUsdCents)
        params.minNightlyRateUsdCents = filterInfo.minNightlyRateUsdCents;
      if (filterInfo.maxNightlyRateUsdCents)
        params.maxNightlyRateUsdCents = filterInfo.maxNightlyRateUsdCents;
      if (filterInfo.starsArr.length)
        params.starsArr = [...filterInfo.starsArr];

      const { newHotels, numHotels } = await getHotels(params);

      setRestartFetch(false);
      setHasMoreHotelsToFetch(newHotels.length > 0);
      setCurrentPage(newHotels.length > 0 ? newPage : 0);

      if (sortBy === 'best') {
        setHotels((prevState: any[]) => {
          return [...prevState, ...newHotels];
        });
      } else {
        const sortedHotels = [...hotels, ...newHotels].sort(
          (hotel1: any, hotel2: any) => {
            if (sortBy === 'price_increasing')
              return (
                hotel1.minPricePerNightCents - hotel2.minPricePerNightCents
              );
            if (sortBy === 'price_decreasing')
              return (
                hotel2.minPricePerNightCents - hotel1.minPricePerNightCents
              );
            if (sortBy === 'distance')
              return (
                hotel1.hotel.location.distanceMiles -
                hotel2.hotel.location.distanceMiles
              );
            return 0;
          },
        );
        setHotels(sortedHotels);
      }
    } catch (error: any) {
      setHasMoreHotelsToFetch(false);
      setCurrentPage(0);
    } finally {
      setIsFetching(false);
    }
  }, [filterInfo, currentPage, hotels, isFetching, sortBy]);

  useInterval(
    async () => {
      if (!hasMoreHotelsToFetch) return;
      try {
        getHotelsData();
      } catch (error) {
        console.log(error);
      }
    },
    // Delay in milliseconds or null to stop it
    hasMoreHotelsToFetch &&
      isOpen &&
      !isFilterModalOpen &&
      !isSearchModalOpen &&
      !isSortModalOpen
      ? 1000
      : null,
  );

  const getHotelDetail = async (selectedHotel: any) => {
    setIsHotelDetailLoading(true);
    const { hotel, rooms } = selectedHotel;
    const firstRoom = rooms.Unknown.Unknown[0];
    const firstOffer = firstRoom.offers[0];
    try {
      const allianceRoomDetailParam = {
        numAdultsPerRoom: 1,
        numRooms: 1,
        startDate: filterInfo.startDate,
        endDate: filterInfo.endDate,
        alliancePropertyId: hotel.allianceMetadata.id,
        ratePlanCode: firstOffer.ratePlan.allianceMetadata.code,
        roomCode: firstRoom.id,
        gateway: firstOffer.ratePlan.allianceMetadata.gateway,
      };

      const response = await getAllianceRoomDetail(allianceRoomDetailParam);
      setHotelDetail(response);
      setIsHotelDetailLoading(false);
    } catch (error) {
      toast.error('The alliance service is not available!');
      setSelectedHotel(null);
      setSelectedRoom(null);
      setHotelDetail({});
      setViewRoom('no');
      setIsHotelDetailLoading(false);
    }
  };

  const initializeSearch = () => {
    setSelectedHotel(null);
    setSelectedRoom(null);
    setHotelDetail({});
    setViewRoom('no');
    setCurrentPage(0);
    setHotels([]);
  };

  useEffect(() => {
    if (isOpen || restartFetch) {
      initializeSearch();
      setHasMoreHotelsToFetch(true);
    }
  }, [isOpen, restartFetch]);

  useEffect(() => {
    setFilterInfo({
      startDate: tripLeg.startDate,
      endDate: tripLeg.endDate,
      numAdults: tripLeg.numAdults ? tripLeg.numAdults : 1,
      numKids: tripLeg.numKids ? tripLeg.numKids : 0,
      numRooms: 1,
      City: tripLeg.City,
      minNightlyRateUsdCents: 0,
      maxNightlyRateUsdCents: 0,
      starsArr: [],
    });
  }, [tripLeg]);

  useEffect(() => {
    if (selectedHotel) {
      getHotelDetail(selectedHotel);
    }
  }, [selectedHotel]);

  const handleGuestRoomUpdate = async (
    adults: number,
    kids: number,
    hotelRooms: number,
  ) => {
    const tempInfo = { ...filterInfo };
    try {
      let updated = false;
      if (hotelRooms !== filterInfo.numRooms) {
        tempInfo.numRooms = hotelRooms;
        updated = true;
      }
      if (filterInfo.numAdults !== adults || filterInfo.numKids !== kids) {
        tempInfo.numAdults = adults;
        tempInfo.numKids = kids;
        updated = true;
      }
      if (updated) {
        setFilterInfo(tempInfo);
        setSelectedHotel(null);
        setSelectedRoom(null);
        setHotelDetail({});
      }
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const handleClose = () => {
    setHasMoreHotelsToFetch(false);
    initializeSearch();
    onClose();
  };

  const handleDatesUpdate = (range: any) => {
    setFilterInfo({
      ...filterInfo,
      startDate: getFormattedDate(range[0]),
      endDate: getFormattedDate(range[1]),
    });
  };

  const getMaxWidth = () => {
    if (selectedHotel) return 'max-w-2xl';
    return 'max-w-5xl';
  };

  const renderContent = () => {
    if (selectedRoom)
      return (
        <PaymentStep
          onPrev={() => setSelectedRoom(null)}
          room={selectedRoom}
          filterInfo={filterInfo}
          hotelInfo={selectedHotel}
          tripLeg={tripLeg}
          onComplete={handleClose}
        />
      );
    if (selectedHotel)
      return {
        no: (
          <HotelDetail
            isHotelDetailLoading={isHotelDetailLoading}
            hotelInfo={selectedHotel}
            hotelDetail={hotelDetail}
            filterInfo={filterInfo}
            onDatesUpdate={handleDatesUpdate}
            onGuestRoomUpdate={handleGuestRoomUpdate}
            onPrev={() => {
              setSelectedHotel(null);
              setSelectedRoom(null);
              setHotelDetail({});
            }}
            onViewRoom={() => setViewRoom('yes')}
          />
        ),
        yes: (
          <RoomDetail
            hotelInfo={selectedHotel}
            onPrev={() => setViewRoom('no')}
            onContinue={(room: any) => setSelectedRoom(room)}
          />
        ),
      }[isViewRoom];

    return (
      <HotelsView
        isLoading={isFetching && hasMoreHotelsToFetch}
        hotels={hotels}
        filterInfo={filterInfo}
        tripLeg={tripLeg}
        onHotelSelect={(hotelInfo: any) => setSelectedHotel(hotelInfo)}
        onSortModalOpen={() => {
          setHasMoreHotelsToFetch(false);
          setIsSortModalOpen(true);
        }}
        onFilterModalOpen={() => {
          setHasMoreHotelsToFetch(false);
          setIsFilterModalOpen(true);
        }}
        onSearchModalOpen={() => {
          setHasMoreHotelsToFetch(false);
          setIsSearchModalOpen(true);
        }}
        onComplete={handleClose}
      />
    );
  };

  return (
    // <PNModal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-xl">
    <Drawer isOpen={isOpen} onClose={handleClose} maxWidth={getMaxWidth()}>
      {renderContent()}
      <SortModal
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        sortBy={sortBy}
        onChange={(newSortBy: string) => {
          setSortBy(newSortBy);
          setIsSortModalOpen(false);
          setRestartFetch(true);
        }}
      />
      <FilterModal
        isOpen={isFilterModalOpen}
        filterInfo={filterInfo}
        onClose={() => setIsFilterModalOpen(false)}
        onChange={(newFilterInfo: FilterInfoType) => {
          setFilterInfo({ ...newFilterInfo });
          setIsFilterModalOpen(false);
          setRestartFetch(true);
        }}
        onSelectHotel={(hotelInfo: any) => {
          setSelectedHotel(hotelInfo);
          setIsFilterModalOpen(false);
        }}
      />
      <SearchModal
        isOpen={isSearchModalOpen}
        filterInfo={filterInfo}
        onClose={() => setIsSearchModalOpen(false)}
        onChange={(newFilterInfo: FilterInfoType) => {
          setFilterInfo({ ...newFilterInfo });
          setIsSearchModalOpen(false);
          setRestartFetch(true);
        }}
      />
    </Drawer>
    // </PNModal>
  );
}
