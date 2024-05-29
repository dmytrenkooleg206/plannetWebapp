/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable consistent-return */
/* eslint-disable eqeqeq */
import {
  createPaymentIntent,
  createPaymentIntentV4,
} from '@/api/priceFreeze/priceFreeze.service';
import { getGuestTripById, getTripById } from '@/api/trip/trip.service';
import { QUERY_OPTION } from '@/lib/constants';
import Loader from '@/components/Loader/Loader';
import { getPlannetCashBalance } from '@/api/wallet/wallet.service';
import { DownloadModal } from '@/components/Modals/DownloadModal';
import { analyticsEvents } from '@/lib/analytics';
import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { getPlannetAffiliateSelHtlIdFromLocalStorage } from '@/lib/localStorage/localStorage';
import FreezePriceComplete from './FreezePriceComplete';
import PaymentCard from './PaymentCard';

export default function FreezePricePage({ from }: any) {
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [freezePricePayload, setFreezePricePayload] = useState<any>({});
  const [total, setTotal] = useState<any>();
  const [diffInDays, setDiffInDays] = useState(0);
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [tripId, setTripId] = useState<any>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [freezePercentage, setfreezePercentage] = useState<any>({
    hotel: 0,
    exp: 0,
    flight: 0,
  });
  const [separateTotal, setSeparateTotal] = useState<any>({
    hotel: 0,
    exp: 0,
  });
  const [paymentProcess, setPaymentProcess] = useState<boolean>(false);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [filter, setFilter] = useState<string>('');
  const [showDownloadAppModal, setShowDownloadAppModal] =
    useState<boolean>(false);

  const [freezeDuration, setFreezeDuration] = useState<string>('');
  const [selectedItineraryEvents, setSelectedItineraryEvents] = useState([]);

  useEffect(() => {
    if (router.query.id) {
      setTripId(router.query.id);
    }
    if (router.query.startDate) {
      setFilter(`${router.query.startDate}/${router.query.endDate}`);
    }

    if (document !== undefined) {
      document.body.scrollTo(0, 0);
    }
  }, [router, router.query.startDate]);

  const {
    isLoading: isLoadingTrip,
    data: tripData,
    refetch: tripRefetch,
  } = useQuery(['trip_details'], () => getGuestTripById(tripId, filter), {
    ...QUERY_OPTION,
    enabled: !!tripId,
  });

  const { data: balanceData } = useQuery(
    ['balance'],
    () => getPlannetCashBalance(),
    { ...QUERY_OPTION },
  );

  useEffect(() => {
    setfreezePercentage((prv: any) => {
      return {
        ...prv,
        hotel: balanceData?.PlannetCashData?.priceFreezePercentageForHotels,
        exp: balanceData?.PlannetCashData?.priceFreezePercentageForTours,
      };
    });
  }, [balanceData]);

  const handleComplete = () => {
    analyticsEvents('BOOK_PRICE_FREEZE');
    if (from === 'summary-details') {
      // setShowDownloadAppModal(true);
      setPaymentProcess(true);
      setPaymentComplete(true);
      setPaymentModal(false);
    } else {
      setPaymentComplete(true);
      setPaymentModal(false);
    }
  };

  /**
   * Freeze Price
   */
  const handleFreezeNow = async () => {
    if (diffInDays < 7) {
      setPaymentComplete(false);
      setPaymentProcess(true);
      return;
    }

    try {
      analyticsEvents('CLICK_PAY_NOW_PRICE_FREEZE');
      setIsButtonLoading(true);
      if (router.query.startDate) {
        const { priceFreeze, StripeData }: any = await createPaymentIntentV4({
          Type: 'Web_Summary_Price_Freeze',
          CustomItineraryTripId: tripData.trip.id,
          startDate: router.query.startDate,
          endDate: router.query.endDate,
          ItineraryEventIds: selectedItineraryEvents.map((i: any) => i.id),
        });

        setPaymentInfo({
          publishableKey: StripeData?.publishableKey,
          clientSecret: StripeData?.paymentIntent?.clientSecret,
          amountCents: StripeData?.amountCents,
        });
      } else {
        const { priceFreezes, StripeData, TripLegId }: any =
          await createPaymentIntent(freezePricePayload);

        setPaymentInfo({
          publishableKey: StripeData.publishableKey,
          clientSecret: StripeData.paymentIntent.clientSecret,
          amountCents: StripeData.amountCents,
        });
      }

      setPaymentModal(true);
    } catch (error: any) {
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setIsButtonLoading(false);
    }
  };

  const checkPriceCompleted = (id: number, type: string) => {
    if (tripData && tripData.priceFreeze && tripData.priceFreeze.length > 0) {
      const filterKey = type === 'hotel' ? 'HotelBookingId' : 'ViatorBookingId';
      const isFreezed = tripData.priceFreeze.some(
        (item: any) => item[filterKey] == id && item.status === 'PAID',
      );

      if (isFreezed) {
        setPaymentProcess(true);
        setPaymentComplete(true);
        return;
      }

      return isFreezed;
    }

    return false;
  };

  useEffect(() => {
    if (
      separateTotal.hotel >= 0 &&
      separateTotal.exp >= 0 &&
      freezePercentage.hotel &&
      freezePercentage.exp
    ) {
      const hotelValue = (separateTotal.hotel * freezePercentage.hotel) / 100;
      const expValue = (separateTotal.exp * freezePercentage.exp) / 100;

      const finalResult = hotelValue + expValue;
      if (finalResult > 0) setCostPrice(finalResult);
    }
  }, [separateTotal, freezePercentage]);

  useEffect(() => {
    setIsLoading(true);
    const selectedHotel = getPlannetAffiliateSelHtlIdFromLocalStorage();
    if (tripData) {
      if (
        !selectedHotel ||
        selectedHotel === '' ||
        selectedHotel === undefined ||
        selectedHotel === 'undefined'
      ) {
        backToHome();
      } else {
        const validHotel = tripData.hotelBookings.findIndex(
          (ht: any) => ht.id === selectedHotel,
        );
        if (validHotel === -1) {
          backToHome();
        } else {
          const payload: any = {
            TripId: tripData.trip.id,
            hotelBookings: [],
            viatorBookings: [],
            usePlannetCash: true,
          };

          let foundPriceFreeze = false;

          tripData.hotelBookings?.forEach((book: any) => {
            if (selectedHotel === book.id) {
              if (checkPriceCompleted(book.id, 'hotel')) {
                foundPriceFreeze = true;
              }

              let hotelPrice = 0;
              if (
                book.hotelObj &&
                book.hotelObj.hotel &&
                book.hotelObj.hotel.totalAfterTaxesCent
              ) {
                hotelPrice = book.hotelObj.hotel.totalAfterTaxesCent;
              }

              payload.hotelBookings.push({
                HotelBookingId: book.id,
                frozenBookingPriceUsdCents: Number(hotelPrice),
              });
            }
          });

          tripData.viatorBookings?.forEach((book: any) => {
            if (checkPriceCompleted(book.id, 'exp')) {
              foundPriceFreeze = true;
            }

            let expPrice = 0;
            if (
              book?.viatorAvailabilityObj &&
              book?.viatorAvailabilityObj.bookableItems &&
              book?.viatorAvailabilityObj.bookableItems[0] &&
              book?.viatorAvailabilityObj.bookableItems[0].totalPrice &&
              book?.viatorAvailabilityObj.bookableItems[0].totalPrice
                .FxConvertedAmounts &&
              book?.viatorAvailabilityObj.bookableItems[0].totalPrice
                .FxConvertedAmounts.price
            ) {
              expPrice =
                book?.viatorAvailabilityObj.bookableItems[0].totalPrice
                  .FxConvertedAmounts.price.recommendedRetailPriceCents;
            }

            payload.viatorBookings.push({
              ViatorBookingId: book.id,
              frozenBookingPriceUsdCents: Number(expPrice),
            });
          });

          const ItineraryEventIds = tripData?.itineraryEvents.filter(
            (ie: any) => {
              if (ie.type === 'EVENT' || ie.HotelBookingId === selectedHotel)
                return ie.id;
            },
          );

          setSelectedItineraryEvents(ItineraryEventIds);

          const hotel = payload.hotelBookings.reduce((acc: any, cur: any) => {
            return acc + cur.frozenBookingPriceUsdCents;
          }, 0);

          const exp = payload.viatorBookings.reduce(
            (acc: any, cur: any) => acc + cur.frozenBookingPriceUsdCents,
            0,
          );

          setSeparateTotal({
            hotel,
            exp,
          });

          setTotal(Number(hotel + exp));
          setFreezePricePayload(payload);
          const diff = dayjs(
            router.query.startDate && router.query.startDate !== ''
              ? router.query.startDate
              : tripData?.tripLegs[0]?.startDate,
          ).diff(dayjs(), 'days');
          setDiffInDays(diff);
          setIsLoading(false);

          if (diff >= 60) setFreezeDuration('14 days');
          else if (diff >= 30) setFreezeDuration('7 days');
          else if (diff >= 14) setFreezeDuration('48 hours');
          else setFreezeDuration('');
        }
      }
    }
  }, [tripData]);

  const backToHome = () => {
    if (from === 'summary-details') {
      router.push(
        `/summary-details/${router.query.id}?startDate=${router.query.startDate}&endDate=${router.query.endDate}`,
      );
    } else {
      router.push(`/summary/${router.query.id}`);
    }
  };

  if (tripData && !tripData.itineraryEvents) {
    router.push('/');
    return null;
  }
  return (
    <>
      {/* ----------------Freeze Price--------------------------------------- */}
      {isLoading ? (
        <div className="min-h-[100dvh] flex my-auto bg-[#1F133E] text-white">
          <Loader color="white" size={50} />
        </div>
      ) : (
        <>
          {!paymentProcess && diffInDays > 7 ? (
            <div className="w-full bg-[#1F133E]  text-white items-center justify-center min-h-[100dvh]">
              <div className=" bg-white text-center  item-center justify-center p-7 border-0">
                <div className="flex">
                  <Link href="#!" onClick={backToHome}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="black"
                      className="w-8 h-8 text-lg md:text-2xl m-auto"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                      />
                    </svg>
                  </Link>
                </div>
                <div>
                  <Image
                    className="mx-auto"
                    alt=""
                    width={96}
                    height={96}
                    src="/assets/images/summary/freeze_icon.svg"
                  />
                  <h1 className="text-[#7440F5] text-[30px] font-[900] leading-[29.91px] mt-4">
                    Book later when you’re ready
                  </h1>
                  <p className="text-[gray] text-[18px] font-[400] mt-4">
                    Stay safe from price increases while you plan your trip!
                  </p>
                </div>
              </div>
              <div className="mt-[-1px] w-full bg-[url('/assets/images/summary/Vector.svg')] bg-no-repeat bg-cover pt-12 bg-bottom  p-7 border-0 md:p-[3.4rem]" />
              <div className="bg-[#1F133E]">
                <div className="mt-5 text-center text-white">
                  {diffInDays >= 7 && (
                    <p className="text-[24px] font-[200]">
                      Freeze prices for{' '}
                      <span className="font-bold">{freezeDuration}</span>
                    </p>
                  )}
                </div>

                <div className=" flex mt-5 mx-auto justify-center text-center">
                  <div
                    className="bg-[#1C0E40]"
                    style={{
                      padding: '1rem',
                      borderTopLeftRadius: '10px',
                      border: '1px solid #fff',
                      borderBottomLeftRadius: '10px',
                    }}
                  >
                    <p className="text-[18px]">Frozen Price</p>
                    <p className="text-[18px]">${(total / 100).toFixed(2)}</p>
                  </div>
                  <div
                    className="bg-[#1C0E40]"
                    style={{
                      padding: '1rem',
                      borderTopRightRadius: '10px',
                      border: '1px solid #fff',
                      borderBottomRightRadius: '10px',
                    }}
                  >
                    <p className="font-bold text-[18px]">Cost of Freeze</p>
                    {costPrice >= 0 ? (
                      <p className="font-bold text-[20px]">
                        ${(costPrice / 100).toFixed(2)}
                      </p>
                    ) : (
                      <Loader color="white" />
                    )}
                  </div>
                </div>
                <div className="p-4 md:text-center">
                  <p className="mt-5 font-[300]">
                    <span className="font-bold ">
                      Plannet covers up to $500 per traveler if the price goes
                      up.
                    </span>{' '}
                    If the price goes down, pay the new low price.
                  </p>
                  <p className="mt-5 font-[300]">
                    <span className="font-bold ">
                      Protect yourself from price increases.
                    </span>{' '}
                    Pay this one time fee and book later when you are ready.
                    This payment goes towards your total booking cost.
                  </p>
                </div>
                <div className="mb-20" />
                <div className="p-4 md:flex md:items-center md:justify-center mt-5 ">
                  <button
                    className=" bg-[#7440F5] p-3 rounded-[8px] flex text-center items-center justify-center fixed-button"
                    onClick={handleFreezeNow}
                  >
                    <Image
                      className="mr-2"
                      alt=""
                      width={33}
                      height={32}
                      src="/assets/images/summary/freeze_btn.svg"
                    />
                    {isButtonLoading ? (
                      <Loader color="white" />
                    ) : (
                      costPrice && (
                        <p className="text-[20px] font-bold">
                          Freeze Now for ${(costPrice / 100).toFixed(2)}
                        </p>
                      )
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <FreezePriceComplete
              isComplete={paymentComplete}
              cityName={tripData?.tripLegs[0]?.City?.name}
              backHome={() => backToHome()}
            />
          )}

          {paymentInfo && (
            <PaymentCard
              isOpen={paymentModal}
              onClose={() => setPaymentModal(false)}
              onComplete={() => handleComplete()}
              paymentInfo={paymentInfo}
              tripId={tripId}
              tripLegId={tripData?.tripLegs[0]?.id}
              amount={(costPrice / 100).toFixed(2)}
              tripRefetch={tripRefetch}
              // oneClickAlliance={freezeId}
            />
          )}
        </>
      )}
      <DownloadModal
        isOpen={showDownloadAppModal}
        onClose={() => setShowDownloadAppModal(false)}
      />
    </>
  );
}
