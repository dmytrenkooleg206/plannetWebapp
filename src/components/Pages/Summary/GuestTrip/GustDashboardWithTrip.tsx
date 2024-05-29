import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Image from 'next/image';
import dayjs from 'dayjs';
import { getGuestTripById } from '@/api/trip/trip.service';
import { QUERY_OPTION } from '@/lib/constants';
import { DownloadModal } from '@/components/Modals/DownloadModal';
import { getFormattedDate, getFormattedDateYMD } from '@/lib/utils';
import { LoginFormModal } from '@/components/Modals/SummaryLogin';
import { addOrDelete } from '@/api/fevorite/fevorite.service';
import {
  getPlannetTokenFromLocalStorage,
  getPlannetUserIdFromLocalStorage,
} from '@/lib/localStorage/localStorage';
import { NotificationModal } from '@/components/Modals/NotificationModal';
import { SummaryCalendar } from '@/components/Modals/SummaryCalendar';
import { toast } from 'react-toastify';
import Link from 'next/link';
import ExperienceCard from '../Dashboard/ExperienceCard';
import HotelCard from '../Dashboard/HotelCard';
import TotalCostCard from '../Dashboard/TotalCostCard';
import NoTripFound from '../LoadingScreen/NoTripFound';
import LoadingTrip from '../LoadingScreen/LoadingTrip';
import ItineraryDailyList from './ItineraryDailyList';
import FooterNav from '../Dashboard/FooterNav';
import GuestLoadingContent from '../LoadingScreen/GuestLodingContent';
import GuestFooter from './GuestFooter';

export default function GuestDashboardWithDate({ tripId }: any) {
  const router = useRouter();

  const [showDownloadAppModal, setShowDownloadAppModal] =
    useState<boolean>(false);

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const [range, setRange] = useState<any>(
    router.query.startDate
      ? [router.query.startDate, router.query.endDate]
      : [],
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>(
    router.query.startDate
      ? `${router.query.startDate}/${router.query.endDate}`
      : '',
  );

  const [isCFAR, setIsCFAR] = useState<boolean>(false);
  const [isShowData, setIsShowData] = useState<boolean>(false);
  const [cloningSource, setCloningSource] = useState('');
  const [isFavourite, setIsFavourite] = useState<boolean>(false);

  const [openNotificationModal, setOpenNotificationModal] =
    useState<boolean>(false);

  const [showModalPage, setShowModalPage] = useState<boolean>(false);
  const {
    isLoading: isLoadingTrip,
    data: tripData,
    error,
    refetch,
  }: any = useQuery(
    ['trip_details_dates'],
    () => getGuestTripById(tripId, filter),
    {
      ...QUERY_OPTION,
    },
  );

  const findAlreadySavedTrip = (tripData: any) => {
    if (
      tripData &&
      tripData.favoriteTrips &&
      Array.isArray(tripData.favoriteTrips)
    ) {
      const foundUser = tripData.favoriteTrips.some(
        (fav: any) => fav.UserId == getPlannetUserIdFromLocalStorage(),
      );

      if (foundUser) {
        setIsFavourite(true);
      }
    }
  };

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

  let hotelTotal = 0;
  let expTotal = 0;
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
        tempDTd.hotels.push(event);
        const hotel = tripData.hotelBookings.find(
          (ht: any) => ht.id === event.HotelBookingId,
        );

        if (range.length > 0) {
          hotelTotal += hotel.priceUsdCents;
        }

        images.push(hotel.hotelObj.hotel.image);
      } else if (
        event.type === 'EVENT' &&
        !tempDTd.exp.find((eh: any) => eh.id === event.id)
      ) {
        if (range.length > 0) {
          const exp = tripData.viatorBookings.find(
            (ht: any) => ht.id === event.ViatorBookingId,
          );
          expTotal += exp.priceUsdCents;
        }

        tempDTd.exp.push(event);

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
  }

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
      // await refetch();
    }
    setIsOpen(false);
    setShowModalPage(false);
    router.push(
      `/summary-details/${tripId}?startDate=${getFormattedDateYMD(
        range[0],
      )}&endDate=${getFormattedDateYMD(range[1])}`,
    );
  };
  /** DatePicker Event End */

  const saveForLater = async () => {
    try {
      const saveLater = await addOrDelete({ TripId: tripData.trip.id });

      if (saveLater && saveLater.message !== 'Favorite added successfully') {
        setIsFavourite(false);
        setOpenNotificationModal(true);
      } else {
        setIsFavourite(true);
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
    if (!getPlannetTokenFromLocalStorage()) {
      setShowModalPage(true);
      setCloningSource('saveforlater');
      setShowLoginModal(true);
    } else {
      await saveForLater();
    }
  };

  const handleForSaveURL = async () => {
    let URL = window.location.href;
    navigator.clipboard.writeText(URL);
    toast.success('Plannet Link Copied');
  };

  useEffect(() => {
    if (tempDTd.hotels.length === 1 && tempDTd.exp.length === 3) {
      setIsCFAR(true);
    }
  }, [tempDTd.hotels, tempDTd.exp]);

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
            <div className="bg-[#1F133E] text-white h-[100%]">
              <div className=" bg-[#1F133E] p-4 min-h-[100vh]">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-[24px] font-bold">
                      Trip to {tripData?.tripLegs[0].City.name}
                    </h2>
                    {range.length < 2 || filter === '' ? (
                      <button
                        className="inline-flex flex-col items-center underline "
                        onClick={handleDateSelection}
                      >
                        Add Travel Dates
                      </button>
                    ) : (
                      <p className="font-light text-[20px] text-white-700">
                        {range.length > 1 &&
                          `${getFormattedDate(range[0])} - ${getFormattedDate(
                            range[1],
                          )}`}
                      </p>
                    )}

                    {/* <p className="font-light text-[20px] text-white-700">
                  {tripData?.tripLegs[0]?.numAdults} Adults
                </p> */}
                  </div>
                  <Link
                    href={
                      range.length < 2 || filter === ''
                        ? `/summary-details/planner/${router.query.id}`
                        : `/summary-details/planner/${router.query.id}?startDate=${router.query.startDate}&endDate=${router.query.endDate}`
                    }
                  >
                    <Image
                      className="border border-2 border-white rounded"
                      src={
                        tripData.planner.profilePictureUrl ||
                        '/assets/images/summary/loadingProfile.png'
                      }
                      width={50}
                      height={50}
                      alt="profile"
                    />
                  </Link>
                </div>

                {/* CFAR */}
                {isCFAR && range.length === 2 && (
                  <div className="bg-[#7440F5] p-2 rounded-[8px] flex flex-start gap-2 mt-4">
                    <Image
                      src="/assets/images/summary/icon-verified.svg"
                      width={33}
                      height={33}
                      alt="verifed"
                    />
                    <div>
                      <p className="font-bold text-[20px]">
                        You are saving $
                        {(
                          (hotelTotal + expTotal) / 100 -
                          ((hotelTotal + expTotal) / 100 -
                            (hotelTotal + expTotal) / 1000)
                        ).toFixed(2)}
                      </p>
                      <p className="text-sm font-light">
                        on free cancellation until {twoDaysBeforeStr}
                      </p>
                    </div>
                  </div>
                )}
                {/* CFAR */}

                <TotalCostCard
                  sliderImages={images}
                  totalCost={hotelTotal + expTotal}
                  className="mt-4"
                  isPriceVisible={range.length < 2 ? false : true}
                />

                {tempDTd.hotels.map((hotel: any) => (
                  <HotelCard
                    key={hotel.id}
                    selectedHotel={hotel || {}}
                    isLoading={isLoadingTrip}
                    isOpen={() => setShowDownloadAppModal(true)}
                    className="mt-4"
                    hotelId={hotel.HotelBookingId}
                    isPriceVisible={range.length < 2 ? false : true}
                    hotels={tripData.hotelBookings}
                  />
                ))}

                <ExperienceCard
                  selectedProducts={tempDTd.exp}
                  isLoading={isLoadingTrip}
                  expTotal={expTotal}
                  expDiscount={0}
                  isOpen={() => setShowDownloadAppModal(true)}
                  className="mt-4"
                  isPriceVisible={range.length < 2 ? false : true}
                  tripId={tripId}
                />
                <ItineraryDailyList customEvents={tempDTd.custEvents} />
              </div>

              {range.length < 2 || filter === '' ? (
                <GuestFooter
                  saveForLater={handleSaveForLater}
                  addTravelDates={handleDateSelection}
                  share={handleForSaveURL}
                />
              ) : (
                <FooterNav
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
    </>
  );
}
