import React, { use, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from 'react-query';
import Image from 'next/image';
import dayjs from 'dayjs';
import Link from 'next/link';
import { getGuestTripById } from '@/api/trip/trip.service';
import { QUERY_OPTION } from '@/lib/constants';
import { DownloadModal } from '@/components/Modals/DownloadModal';
import { getFormattedDate } from '@/lib/utils';
import { LoginFormModal } from '@/components/Modals/SummaryLogin';
import { addOrDelete } from '@/api/fevorite/fevorite.service';
import {
  getPlannetTokenFromLocalStorage,
  getPlannetUserIdFromLocalStorage,
  getPlannetUserStatusFromLocalStorage,
} from '@/lib/localStorage/localStorage';
import { NotificationModal } from '@/components/Modals/NotificationModal';
import { SummaryCalendar } from '@/components/Modals/SummaryCalendar';
import Loader from '@/components/Loader/Loader';
import { SummaryLinkModal } from '@/components/Modals/SummaryLinkModal';
import { analyticsEvents } from '@/lib/analytics';
import useSummaryDatesUpdate from '@/hooks/useSummaryDatesUpdate';
import ExperienceCard from '../Dashboard/ExperienceCard';
import HotelCard from '../Dashboard/HotelCard';
import TotalCostCard from '../Dashboard/TotalCostCard';
import NoTripFound from '../LoadingScreen/NoTripFound';
import LoadingTrip from '../LoadingScreen/LoadingTrip';
import ItineraryDailyList from './ItineraryDailyList';
import FooterNav from '../Dashboard/FooterNav';
import GuestLoadingContent from '../LoadingScreen/GuestLodingContent';
import GuestFooter from './GuestFooter';
import LoadingAfterDateChange from './LoadingAfterDateChange';

export default function GuestDashboard({ tripId }: any) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDownloadAppModal, setShowDownloadAppModal] =
    useState<boolean>(false);

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isOpenShareModal, setIsOpenShareModal] = useState<boolean>(false);
  const [isCFAR, setIsCFAR] = useState<boolean>(false);
  const [isShowData, setIsShowData] = useState<boolean>(false);
  const [cloningSource, setCloningSource] = useState('');
  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const [openNotificationModal, setOpenNotificationModal] =
    useState<boolean>(false);
  const [pageName] = useState<string>('summary-details');
  const [selectedHotelId, setSelectedHotelId] = useState<string>('');
  const [CFARAmount, setCFARAmount] = useState<number>(0);

  const {
    isLoading: isLoadingTrip,
    data: tripData,
    error,
  }: any = useQuery(['trip_details'], () => getGuestTripById(tripId, filter), {
    ...QUERY_OPTION,
  });

  const {
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
  } = useSummaryDatesUpdate({ tripData, tripId, pageName });

  const findAlreadySavedTrip = (tripData: any) => {
    if (
      tripData &&
      tripData.favoriteTrips &&
      Array.isArray(tripData.favoriteTrips)
    ) {
      queryClient.setQueryData('favoriteTrip', tripData.favoriteTrips);
      const foundUser = tripData.favoriteTrips.some(
        (fav: any) => fav.UserId == getPlannetUserIdFromLocalStorage(),
      );

      if (foundUser) {
        setIsFavourite(true);
      }
    } else {
      queryClient.setQueryData('favoriteTrip', []);
    }
  };

  useEffect(() => {
    const isDateChange = queryClient.getQueryData('is_date_change');
    if (isDateChange) {
      analyticsEvents('VIEW_SUMMARY_PAGE_WITH_PRICES_LOADING');
      checkAndUpdateKey(tripData);
    } else {
      setIsPriceFound(true);
    }
  }, [filter]);

  useEffect(() => {
    if (tripData && Object.keys(tripData).length > 0) {
      findAlreadySavedTrip(tripData);
      setIsShowData(true);
    }
  }, [tripData, isShowData]);

  let twoDaysBefore = dayjs(tripData?.tripLegs[0].startDate).subtract(2, 'd');
  let twoDaysBeforeStr = dayjs(twoDaysBefore).format('MMM DD');

  if (router.query.startDate && router.query.startDate !== '') {
    const startDate: string = router.query.startDate as string;
    twoDaysBefore = dayjs(startDate).subtract(2, 'd');
    twoDaysBeforeStr = dayjs(twoDaysBefore).format('MMM DD');
  }

  const hotelTotal = 0;
  const expTotal = 0;
  // let CFARAmount = 0;
  const images: string[] = [];
  if (tripData?.tripLegs[0]?.City?.photoUrl) {
    images.push(tripData?.tripLegs[0]?.City?.photoUrl);
  }

  const tempDTd: any = { hotels: [], exp: [], custEvents: [] };
  if (tripData) {
    tripData?.itineraryEvents.forEach((event: any) => {
      if (
        event.type === 'STAY' &&
        !tempDTd.hotels.find((eh: any) => eh.id === event.id)
      ) {
        const hotel = tripData.hotelBookings.find(
          (ht: any) => ht.id === event.HotelBookingId,
        );
        let eventPrice = 0;
        // if (
        //   range.length > 0 &&
        //   hotel.hotelObj &&
        //   hotel.hotelObj.room &&
        //   hotel.hotelObj.room.price &&
        //   hotel.hotelObj.room.price.FxConvertedAmounts &&
        //   hotel.hotelObj.room.price.FxConvertedAmounts.totalCents
        // ) {
        //   hotelTotal +=
        //     hotel.hotelObj.room.price.FxConvertedAmounts.totalCents / 100;
        //   eventPrice =
        //     hotel.hotelObj.room.price.FxConvertedAmounts.totalCents / 100;
        // }
        if (
          range.length > 0 &&
          hotel.hotelObj &&
          hotel.hotelObj.hotel &&
          hotel.hotelObj.hotel.averageNightlyRateCents &&
          hotel.hotelObj.hotel.numberOfNight
        ) {
          // hotelTotal +=
          //   (hotel.hotelObj.hotel.averageNightlyRateCents *
          //     hotel.hotelObj.hotel.numberOfNight) /
          //   100;
          eventPrice =
            (hotel.hotelObj.hotel.averageNightlyRateCents *
              hotel.hotelObj.hotel.numberOfNight) /
            100;
        }

        tempDTd.hotels.push({ ...event, eventPrice });
        images.push(hotel.hotelObj.hotel.image);
      } else if (
        event.type === 'EVENT' &&
        !tempDTd.exp.find((eh: any) => eh.id === event.id)
      ) {
        let eventPrice = 0;
        if (range.length > 0) {
          const exp = tripData.viatorBookings.find(
            (ht: any) => ht.id === event.ViatorBookingId,
          );
          if (
            exp &&
            exp.viatorAvailabilityObj &&
            exp.viatorAvailabilityObj.bookableItems &&
            exp.viatorAvailabilityObj.bookableItems.length > 0
          ) {
            // expTotal +=
            //   exp.viatorAvailabilityObj.bookableItems[0].totalPrice
            //     .FxConvertedAmounts.price.recommendedRetailPrice;
            eventPrice =
              exp.viatorAvailabilityObj.bookableItems[0].totalPrice
                .FxConvertedAmounts.price.recommendedRetailPrice;
          }
        }
        tempDTd.exp.push({ ...event, eventPrice });
        if (
          event.viatorProductDetails &&
          event.viatorProductDetails.images &&
          event.viatorProductDetails.images.length > 0
        ) {
          const maxwidth = event.viatorProductDetails.images[0].variants.filter(
            (vr: any) => vr.width >= 720,
          );

          images.push(maxwidth[0].url);
        }
      } else if (event.type === 'CUSTOM_EVENT') {
        tempDTd.custEvents.push(event);
      }
    });

    // const totalExpHotel = Number(hotelTotal) + Number(expTotal);
    // const totalExpHotelCFAR =
    //   Number(totalExpHotel) + Number((totalExpHotel * 10) / 100);

    // CFARAmount = totalExpHotelCFAR - totalExpHotel;
  }
  /** DatePicker Event End */

  /** Update Trip Cache */
  const updateInsertFavorite = (type: string) => {
    if (type === 'add') {
      queryClient.setQueryData('favoriteTrip', [
        ...tripData.favoriteTrips,
        {
          TripId: tripData.trip.id,
          UserId: getPlannetUserIdFromLocalStorage(),
        },
      ]);
    } else {
      const favoriteTripData = queryClient.getQueryData('favoriteTrip');
      if (favoriteTripData && Array.isArray(favoriteTripData)) {
        const filteredData = favoriteTripData.filter(
          (fav: any) => fav.UserID != getPlannetUserIdFromLocalStorage(),
        );
        queryClient.setQueryData('favoriteTrip', filteredData);
      }
    }
  };

  const saveForLater = async () => {
    try {
      analyticsEvents('SAVE_FOR_LATER');
      const saveLater = await addOrDelete({ TripId: tripData.trip.id });

      if (saveLater && saveLater.message !== 'Favorite added successfully') {
        setIsFavourite(false);
        setOpenNotificationModal(true);
        updateInsertFavorite('remove');
        setTimeout(() => {
          setOpenNotificationModal(false);
        }, 2000);
      } else {
        setIsFavourite(true);
        updateInsertFavorite('add');
        router.push(
          range.length === 2
            ? `/summary-details/saved/${tripId}?startDate=${router.query.startDate}&endDate=${router.query.endDate}`
            : `/summary-details/saved/${tripId}`,
        );
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleSaveForLater = async () => {
    if (
      !getPlannetTokenFromLocalStorage() ||
      getPlannetUserStatusFromLocalStorage() === 'APPROVED'
    ) {
      setShowModalPage(true);
      setCloningSource('saveforlater');
      setShowLoginModal(true);
    } else {
      await saveForLater();
    }
  };

  const handleClickPlannet = async () => {
    if (!getPlannetTokenFromLocalStorage()) {
      setShowModalPage(true);
      setCloningSource('textPlannet');
      setShowLoginModal(true);
    } else {
      window.location.href = `sms:+1(917)932-2005;?&body=Hey Plannet Team, I am interested in having you plan my trip! I am interested in having flights, hotels, experiences and restaurant reservations booked for me! I liked this trip ${process.env.NEXT_PUBLIC_CURRENT_URL}${router.asPath}`;
    }
  };

  const handleForSaveURL = async () => {
    analyticsEvents('SHARE');
    setIsOpenShareModal(true);
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_CURRENT_URL}summary-details/landing/${tripId}`,
    );
    setTimeout(() => {
      setIsOpenShareModal(false);
    }, 2000);
  };

  useEffect(() => {
    if (tempDTd.hotels.length > 0 && tempDTd.exp.length > 2) {
      setIsCFAR(true);
    }
  }, [tempDTd.hotels, tempDTd.exp]);

  useEffect(() => {
    if (selectedHotelId !== '') {
      const expTotal = tempDTd.exp.reduce(
        (acc: any, cur: any) => acc + cur.eventPrice,
        0,
      );

      const hotelTotal =
        tempDTd.hotels.find((ht: any) => ht.HotelBookingId === selectedHotelId)
          ?.eventPrice || 0;

      const totalExpHotel = Number(hotelTotal) + Number(expTotal);
      const totalExpHotelCFAR =
        Number(totalExpHotel) + Number((totalExpHotel * 10) / 100);

      setCFARAmount(totalExpHotelCFAR - totalExpHotel);
    }
  }, [selectedHotelId, isPriceFound]);

  if (
    !isLoadingTrip &&
    tripData &&
    tripData.trip &&
    tripData.trip.type !== 'CUSTOM_ITINERARIES' &&
    tripData.trip.type !== 'AFFILIATE_ITINERARIES'
  ) {
    return <NoTripFound />;
  }

  if (
    !isLoadingTrip &&
    error &&
    Object.keys(error).length > 0 &&
    error.response &&
    error.response.data &&
    error.response.data.message === 'Trip does not exist'
  ) {
    return <NoTripFound />;
  }

  return (
    <>
      {!showModalPage && (
        <>
          {!isLoadingTrip && !error && isShowData ? (
            <div className="bg-[#1F133E] text-white min-h-[100dvh] pb-[15vh]">
              <div className=" bg-[#1F133E] p-4">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-[24px] font-bold">
                      Trip to {tripData?.tripLegs[0].City.name}
                    </h2>
                    {range.length < 2 || filter === '' ? (
                      <button
                        className="inline-flex text-white-700 font-medium flex-col items-center underline decoration-1 underline-offset-2"
                        onClick={handleDateSelection}
                      >
                        Add Travel Dates
                      </button>
                    ) : (
                      <button
                        className="font-medium text-[18px] text-white-700 underline decoration-1 underline-offset-2"
                        onClick={handleDateSelection}
                      >
                        {range.length > 1 &&
                          `${getFormattedDate(range[0])} - ${getFormattedDate(
                            range[1],
                          )}`}
                      </button>
                    )}

                    {/* <p className="font-light text-[20px] text-white-700">
                  {tripData?.tripLegs[0]?.numAdults} Adults
                </p> */}
                  </div>
                  <div className="flex gap-3 item-center">
                    <span
                      onClick={handleForSaveURL}
                      className="w-12 h-12 rounded-lg flex justify-center items-center text-3xl bg-white-100 cursor-pointer"
                    >
                      <img
                        className="h-7 w-7"
                        src="/assets/images/summary/shareLogo.svg"
                        alt=""
                      />
                    </span>
                    <Link
                      href={
                        range.length < 2 || filter === ''
                          ? `/summary-details/planner/${router.query.id}`
                          : `/summary-details/planner/${router.query.id}?startDate=${router.query.startDate}&endDate=${router.query.endDate}`
                      }
                    >
                      <img
                        className="border border-2 border-white rounded"
                        src={
                          tripData.planner.profilePictureUrl ||
                          '/assets/images/summary/planner-plchldr.png'
                        }
                        width={50}
                        height={50}
                        alt="profile"
                      />
                    </Link>
                  </div>
                </div>

                {/* CFAR */}
                {isCFAR &&
                  range.length === 2 &&
                  tempDTd &&
                  tempDTd.hotels &&
                  tempDTd.exp &&
                  tempDTd.hotels.length > 0 &&
                  tempDTd.exp.length > 2 && (
                    <div className="bg-white p-2 rounded-[8px] flex flex-start gap-2 mt-4">
                      {/* <Image
                        src="/assets/images/summary/icon-verified.svg"
                        width={33}
                        height={33}
                        alt="verifed"
                      /> */}
                      <div className="flex justify-center items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="33"
                          height="33"
                          viewBox="0 0 34 34"
                          fill="none"
                        >
                          <path
                            d="M17 1.32813L3.98438 6.73207V13.3013C3.98438 21.8029 9.1288 29.4591 17 32.6719C24.8711 29.4591 30.0156 21.8029 30.0156 13.3013V6.73207L17 1.32813Z"
                            stroke="#1f133e"
                            strokeWidth="2.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M11.8203 15.9445L15.532 19.6562L22.1797 13.0087"
                            stroke="#1f133e"
                            strokeWidth="2.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      <div>
                        <p className="font-bold text-[#1f133e] text-[20px] flex">
                          You are saving
                          {isPriceFound ? (
                            ` $${CFARAmount.toFixed(2)}`
                          ) : (
                            <Loader color="#fff" />
                          )}
                        </p>
                        <p className="text-sm font-light text-[#1f133e]">
                          on free cancellation until {twoDaysBeforeStr}
                        </p>
                      </div>
                    </div>
                  )}
                {/* CFAR */}

                <TotalCostCard
                  sliderImages={images}
                  totalCost={+hotelTotal + +expTotal}
                  className="mt-4"
                  isPriceFound={isPriceFound}
                  isPriceVisible={!(range.length < 2)}
                />

                {tempDTd.hotels && tempDTd.hotels.length > 0 && (
                  <HotelCard
                    itenaryEvents={tripData?.itineraryEvents}
                    key="hotel_listing"
                    isLoading={isLoadingTrip}
                    isOpen={() => setShowDownloadAppModal(true)}
                    isPriceFound={isPriceFound}
                    className="mt-4"
                    isPriceVisible={!(range.length < 2)}
                    hotels={tripData.hotelBookings}
                    avgPrice={
                      tripData.hotelAvgNightlyRate
                        ? tripData.hotelAvgNightlyRate
                        : 0
                    }
                    setSelectedHotelId={setSelectedHotelId}
                  />
                )}

                <ExperienceCard
                  selectedProducts={tempDTd.exp}
                  isLoading={isLoadingTrip}
                  expTotal={expTotal}
                  isPriceFound={isPriceFound}
                  expDiscount={0}
                  isOpen={() => setShowDownloadAppModal(true)}
                  className="mt-4"
                  isPriceVisible={!(range.length < 2)}
                  tripId={tripId}
                  avgPrice={
                    tripData.viatorAvgExperiencePrice
                      ? tripData.viatorAvgExperiencePrice
                      : 0
                  }
                />

                <ItineraryDailyList customEvents={tempDTd.custEvents} />
              </div>

              {range.length < 2 || filter === '' ? (
                <GuestFooter
                  cliclPlannet={handleClickPlannet}
                  saveForLater={handleSaveForLater}
                  addTravelDates={handleDateSelection}
                  share={handleForSaveURL}
                  isFavourite={isFavourite}
                />
              ) : (
                <FooterNav
                  isPriceFound={isPriceFound}
                  isFavourite={isFavourite}
                  setShowDownloadAppModal={setShowDownloadAppModal}
                  tripData={tripData}
                  setShowLoginModal={setShowLoginModal}
                  setCloningSource={setCloningSource}
                  saveForLater={saveForLater}
                  setShowModalPage={setShowModalPage}
                />
              )}
            </div>
          ) : !isLoadingTrip && !error && !isShowData && range.length < 1 ? (
            <GuestLoadingContent tripData={tripData} />
          ) : (
            <LoadingTrip />
          )}
        </>
      )}
      <SummaryCalendar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        range={range}
        setRange={setRange}
        handleUpdateDate={handleUpdateDate}
        setShowModalPage={setShowModalPage}
      />

      <SummaryLinkModal
        isOpenShareModal={isOpenShareModal}
        onClose={() => setIsOpenShareModal(false)}
      />

      <NotificationModal
        isOpen={openNotificationModal}
        onClose={() => setOpenNotificationModal(false)}
      />

      <DownloadModal
        isOpen={showDownloadAppModal}
        onClose={() => setShowDownloadAppModal(false)}
      />

      <LoginFormModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        cloningSource={cloningSource}
        saveForLater={saveForLater}
        setShowModalPage={setShowModalPage}
      />

      <LoadingAfterDateChange
        isOpen={afterDateChangeLoader}
        range={range}
        tripData={tripData}
        isPriceFound={isPriceFound}
        setAfterDateChangeLoader={setAfterDateChangeLoader}
        setShowModalPage={setShowModalPage}
      />
    </>
  );
}
