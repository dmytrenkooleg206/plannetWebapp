import { getGuestTripById } from '@/api/trip/trip.service';
import { analyticsEvents } from '@/lib/analytics';
import { getFormattedDateYMD } from '@/lib/utils';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';

const useSummaryDatesUpdate = ({ tripData, tripId, pageName }: any) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [range, setRange] = useState<any>(
    router.query.startDate
      ? [router.query.startDate, router.query.endDate]
      : [],
  );

  //   console.log(range);

  const [filter, setFilter] = useState<string>(
    router.query.startDate
      ? `${router.query.startDate}/${router.query.endDate}`
      : '',
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [isPriceFound, setIsPriceFound] = useState<boolean>(false);
  const [afterDateChangeLoader, setAfterDateChangeLoader] =
    useState<boolean>(false);
  const [showModalPage, setShowModalPage] = useState<boolean>(false);
  //   const [recursionCount, setRecursionCount] = useState<number>(0);

  const updateHotelDataInCache = (tripResp: any, cacheObject: any) => {
    if (tripResp && tripResp.hotelBookings) {
      for (let trip of cacheObject.hotelBookings) {
        const hotelIndex = tripResp.hotelBookings.findIndex(
          (item: any) => item.id == trip.id,
        );
        trip.reservationParameters =
          tripResp.hotelBookings[hotelIndex].reservationParameters;

        if (trip && trip.hotelObj && trip.hotelObj.hotel) {
          trip.hotelObj.hotel['room'] =
            tripResp.hotelBookings[hotelIndex].hotelObj.hotel.room;
        }
      }
    }

    if (tripResp && tripResp.viatorBookings) {
      for (let exp of cacheObject.viatorBookings) {
        const hotelIndex = tripResp.viatorBookings.findIndex(
          (item: any) => item.id == exp.id,
        );
        exp.viatorAvailabilityObj =
          tripResp.viatorBookings[hotelIndex].viatorAvailabilityObj;
      }
    }

    return tripResp;
  };

  const setPricesState = (tripData: any) => {
    const getCacheTrip: any = queryClient.getQueryData(['trip_details']);
    tripData = updateHotelDataInCache(tripData, getCacheTrip);
    queryClient.setQueryData('trip_details', tripData);
    setIsPriceFound(true);
  };
  let recursionCount = 0;
  const checkAndUpdateKey = async (data: any) => {
    if (tripData) {
      try {
        const result = await getGuestTripById(tripId, filter);
        if (result) {
          setPricesState(result);
          queryClient.setQueryData('is_date_change', false);
          analyticsEvents('VIEW_SUMMARY_PAGE_WITH_PRICES_LOADED');
        }
      } catch (e) {
        setIsPriceFound(false);
        console.log('err', e);
        //show loader
        // setAfterDateChangeLoader(true);
        // setShowModalPage(true);
        // if (recursionCount < 2) {
        //   console.log(recursionCount);
        //   recursionCount++;
        //   checkAndUpdateKey('');
        // }
      }
    }
  };

  /** DatePicker Event */
  const handleDateSelection = () => {
    setIsOpen(true);
    setShowModalPage(true);
  };

  const handleUpdateDate = async () => {
    if (!range.length) return;
    if (
      range[0] !== '' &&
      range[0].toISOString().split('T')[0] !== '' &&
      range[1] !== '' &&
      range[1].toISOString().split('T')[0] !== ''
    ) {
      setFilter(
        `${getFormattedDateYMD(range[0])}/${getFormattedDateYMD(range[1])}`,
      );
    }

    analyticsEvents('ADD_TRAVEL_DATES');
    setIsPriceFound(false);
    setIsOpen(false);
    queryClient.setQueryData('is_date_change', true);
    //show loader
    setAfterDateChangeLoader(true);

    router.push(
      `/${pageName}/${tripId}?startDate=${getFormattedDateYMD(
        range[0],
      )}&endDate=${getFormattedDateYMD(range[1])}`,
    );
  };

  return {
    checkAndUpdateKey,
    isPriceFound,
    setIsPriceFound,
    afterDateChangeLoader,
    setAfterDateChangeLoader,
    showModalPage,
    setShowModalPage,
    handleDateSelection,
    handleUpdateDate,
    range,
    setRange,
    filter,
    setFilter,
    isOpen,
    setIsOpen,
  };
};

export default useSummaryDatesUpdate;
