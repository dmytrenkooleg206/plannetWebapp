/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-use-before-define */
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { useQuery, useQueryClient } from 'react-query';
import {
  createOneClickAffiliateBookingPaymentIntent,
  createOneClickBookingPaymentIntent,
} from '@/api/tripLeg/tripLeg.service';
import Loader from '@/components/Loader/Loader';
import { getGuestTripById, getTripById } from '@/api/trip/trip.service';
import { QUERY_OPTION } from '@/lib/constants';
import {
  getFormattedDate,
  getHotelBaseAmount,
  getHotelTaxAmount,
} from '@/lib/utils';
import { getPlannetCashBalance } from '@/api/wallet/wallet.service';
import { analyticsEvents } from '@/lib/analytics';
import {
  getPlannetAffiliateSelHtlIdFromLocalStorage,
  getPlannetUserFullnameFromLocalStorage,
} from '@/lib/localStorage/localStorage';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import useSummaryDatesUpdate from '@/hooks/useSummaryDatesUpdate';
import { SummaryCalendar } from '@/components/Modals/SummaryCalendar';
import PaymentCard from '../FreezePrice/PaymentCard';
import PlannetPaymentComplete from './PlannetPaymentComplete';
import PromoCodeScreen from './PromoCodeScreen';
import LoadingAfterDateChange from '../GuestTrip/LoadingAfterDateChange';

export default function PaymentDetails({ from }: any) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [bookPayment, setBookPayment] = useState<any>({
    TripLegId: 0,
    usePlannetCash: false,
    isInsurancePurchased: false,
  });

  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [traveller, setTraveller] = useState<any>(null);
  const [cancellationFee, setCancellationFee] = useState<any>(0);
  const [isCancellationFree, setIsCancellationFree] = useState<boolean>(true);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [oneClickID, setoneClickID] = useState<any>(null);
  const [tripId, setTripId] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newTotalAmount, setNewTotalAmount] = useState<number>(0);
  const [itineraryDetails, setItineraryDetails] = useState<any>([]);
  const [taxableAmount, setTaxableAmount] = useState(0);
  const [plannetCash, setPlannetCash] = useState(0);
  const [cancellationDay, setCancellationDay] = useState('');
  const [isCFAR, setIsCFAR] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoCodeDiscount, setPromoCodeDiscount] = useState(0);
  const [isPromoCodeScreenOpen, setIsPromoCodeScreenOpen] =
    useState<boolean>(false);
  const [totalAfterPromoPlannet, setTotalAfterPromoPlannet] =
    useState<number>(0);
  const [bookingFor, setBookingFor] = useState<string>('');
  const [usePlannetCash, setUsePlannetCash] = useState<boolean>(false);
  const [pageName] = useState<string>('summary-details/ocb');

  const { data: balanceData } = useQuery(
    ['balance'],
    () => getPlannetCashBalance(),
    { ...QUERY_OPTION },
  );

  useEffect(() => {
    setPlannetCash(balanceData?.PlannetCashData?.balanceCents);
  }, [balanceData, balanceData?.PlannetCashData]);

  // let isCalledQuery = false;
  const [isCalledQuery, setIsCalledQuery] = useState<boolean>(false);

  const {
    isLoading: isLoadingTrip,
    data: tripData,
    error,
    refetch: tripRefetch,
  }: any = useQuery(['trip_details'], () => getGuestTripById(tripId, filter), {
    ...QUERY_OPTION,
    enabled: isCalledQuery,
  });

  // Data update on date change
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

  if (from === 'summary-details' && tripId !== '' && filter !== '') {
    if (!isCalledQuery) setIsCalledQuery(true);
  } else if (from === 'summary' && tripId !== '') {
    if (!isCalledQuery) setIsCalledQuery(true);
  }

  useEffect(() => {
    const isDateChange = queryClient.getQueryData('is_date_change');
    if (isDateChange) {
      analyticsEvents('VIEW_SUMMARY_PAGE_WITH_PRICES_LOADING');
      checkAndUpdateKey(tripData);
    } else {
      setIsPriceFound(true);
    }
  }, [filter]);

  const handleOneClickBookingPaymentIntent = async (requestParams: any) => {
    try {
      setIsLoading(true);
      const createPaymentIntend: any =
        await createOneClickAffiliateBookingPaymentIntent(requestParams);

      const { StripeData, requiresPayment } = createPaymentIntend;
      if (!requiresPayment) {
        setPaymentComplete(true);
        return;
      }

      if (StripeData && Object.keys(StripeData).length > 0) {
        setPaymentInfo({
          publishableKey: StripeData.publishableKey,
          clientSecret: StripeData.paymentIntent.clientSecret,
          amountCents: StripeData.amountCents,
        });
        setPaymentModal(true);
      } else {
        // setPaymentComplete(true);
        // setShowDownloadAppModal(true);
        toast.error('Something went wrong! Please try again.');
      }
    } catch (err) {
      toast.error('Something went wrong with payment processing');
    } finally {
      setIsLoading(false);
    }
  };

  const summaryFlowPayment = async (bookPayment: any) => {
    try {
      setIsLoading(true);
      analyticsEvents('CLICK_PAY_NOW');
      const { oneClickBooking, StripeData, TripLegId }: any =
        await createOneClickBookingPaymentIntent(bookPayment);
      if (
        oneClickBooking.StripeData &&
        oneClickBooking.status === 'PENDING_PAYMENT'
      ) {
        setPaymentInfo({
          publishableKey: oneClickBooking.StripeData.publishableKey,
          clientSecret: oneClickBooking.StripeData.paymentIntent.clientSecret,
          amountCents: oneClickBooking.StripeData.amountCents,
        });
        setoneClickID(oneClickBooking.id);
        setPaymentModal(true);
      } else if (oneClickBooking.status === 'PAID') {
        analyticsEvents('BOOK_ONE_CLICK_BOOKING');
        // setPaymentComplete(true);
      }
    } catch (err) {
      toast.error('Something went wrong with payment processing');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = (key: any, value: any) => {
    setBookPayment((prv: any) => {
      return { ...prv, [key]: value };
    });
  };

  const handleoneClickPayment = async () => {
    if (from === 'summary-details') {
      setPaymentModal(false);
      setPaymentComplete(true);
      analyticsEvents('BOOK_ONE_CLICK_BOOKING');
      // setShowDownloadAppModal(true);
    } else {
      setPaymentModal(false);
      setPaymentComplete(true);
    }
  };

  useEffect(() => {
    if (router.query.id) {
      setTripId(router.query.id);
    }
    if (router.query.startDate) {
      setFilter(`${router.query.startDate}/${router.query.endDate}`);
      setRange([router.query.startDate, router.query.endDate]);
    }
  }, [router, router.query.startDate, setFilter, setRange]);

  const generateItenDetails = (tripData: any, itineryDetails: any = []) => {
    let twoDaysBefore = dayjs(tripData?.tripLegs[0].startDate).subtract(2, 'd');
    let iscancellationAllowed = dayjs(tripData?.tripLegs[0].startDate).diff(
      new Date(),
      'd',
    );

    if (router.query.startDate && router.query.startDate !== '') {
      const startDate: string = router.query.startDate as string;
      twoDaysBefore = dayjs(startDate).subtract(2, 'd');
      iscancellationAllowed = dayjs(startDate).diff(new Date(), 'd');
    }

    if (iscancellationAllowed && iscancellationAllowed < 2) {
      setIsCancellationFree(false);
    }

    setCancellationDay(dayjs(twoDaysBefore).format('MMMM DD, YYYY'));

    if (tripData && tripData.users && tripData.users.length > 0) {
      setTraveller(tripData?.users[0]);
    }

    const items = [];
    let taxableLoopAmount = 0;
    let fieldPrice = 0;
    let numNights = null;
    let hotelTotal = 0;
    let expTotal = 0;
    const tempDTd: any = { hotels: [], exp: [] };
    const selectedHotel = getPlannetAffiliateSelHtlIdFromLocalStorage();

    for (let i = 0; i < itineryDetails.length; i++) {
      if (itineryDetails[i].type != 'CUSTOM_EVENT') {
        let key: string = '';
        let fieldId: number = 0;

        if (
          itineryDetails[i].type == 'STAY' &&
          itineryDetails[i].HotelBookingId === selectedHotel
        ) {
          tempDTd.hotels.push(itineryDetails[i]);
          key = 'hotelBookings';
          fieldId = itineryDetails[i].HotelBookingId;
        } else if (itineryDetails[i].type == 'EVENT') {
          tempDTd.exp.push(itineryDetails[i]);
          key = 'viatorBookings';
          fieldId = itineryDetails[i].ViatorBookingId;
        }

        if (key !== '') {
          const extractChildObject: any = tripData[key].filter(
            (item: any) => item.id === fieldId,
          );

          if (itineryDetails[i].type == 'STAY') {
            numNights = extractChildObject[0].hotelObj.hotel?.numberOfNight;

            if (
              extractChildObject[0].hotelObj &&
              extractChildObject[0].hotelObj.hotel
            ) {
              const baseAmount = getHotelBaseAmount(
                extractChildObject[0].hotelObj.hotel,
              );

              taxableLoopAmount += getHotelTaxAmount(
                extractChildObject[0].hotelObj.hotel,
                Number(baseAmount),
              );

              fieldPrice = Number(baseAmount);
              hotelTotal += Number(baseAmount);
            }
          } else {
            fieldPrice = 0;

            if (
              extractChildObject[0] &&
              extractChildObject[0].viatorAvailabilityObj &&
              extractChildObject[0].viatorAvailabilityObj.bookableItems &&
              extractChildObject[0].viatorAvailabilityObj.bookableItems.length >
                0
            ) {
              fieldPrice =
                extractChildObject[0].viatorAvailabilityObj.bookableItems[0]
                  .totalPrice.FxConvertedAmounts.price.recommendedRetailPrice;

              expTotal +=
                extractChildObject[0].viatorAvailabilityObj.bookableItems[0]
                  .totalPrice.FxConvertedAmounts.price.recommendedRetailPrice;
            }
          }

          const tempData = {
            type: itineryDetails[i].type == 'STAY' ? 'Room' : 'Experience',
            id: fieldId,
            title: itineryDetails[i].name,
            priceUsdCent: extractChildObject[0].priceUsdCents,
            actualAmount: fieldPrice,
            numNights,
            ItineraryEventId: itineryDetails[i].id,
          };

          items.push(tempData);
        }
      }
    }

    const totalamount = items.reduce(
      (acc: any, cur: any) => acc + cur.actualAmount,
      0,
    );

    items.sort((a, b) => {
      if (a.type === 'Room' && b.type === 'Experience') return -1;
      if (b.type === 'Room' && a.type === 'Experience') return 1;
      return 0;
    });

    const totalExpHotel = Number(hotelTotal) + Number(expTotal);
    const totalExpHotelCFAR =
      Number(totalExpHotel) + Number((totalExpHotel * 10) / 100);

    setCancellationFee((totalExpHotelCFAR - totalExpHotel).toFixed(2));
    setTaxableAmount(taxableLoopAmount);
    setNewTotalAmount((totalamount + taxableLoopAmount).toFixed(2));
    setItineraryDetails(items);

    if (
      tempDTd.hotels &&
      tempDTd.hotels.length > 0 &&
      tempDTd.exp &&
      tempDTd.exp.length > 2
    ) {
      setIsCFAR(true);
    }
  };

  /**
   * Payment process API to create Intent
   */
  const handleComplete = async () => {
    if (from === 'summary-details') {
      const requestParams = {
        // Type: 'Web_Summary_One_Click_Booking',
        CustomItineraryTripId: tripData.trip.id,
        startDate: router.query.startDate,
        endDate: router.query.endDate,
        usePlannetCash,
        isInsurancePurchased: bookPayment.isInsurancePurchased,
        promoCode,
        ItineraryEventIds: itineraryDetails.map((i: any) => i.ItineraryEventId),
      };

      handleOneClickBookingPaymentIntent(requestParams);
    } else {
      summaryFlowPayment(bookPayment);
    }
  };

  useEffect(() => {
    if (usePlannetCash) {
      const total = (
        newTotalAmount -
        promoCodeDiscount -
        plannetCash / 100
      ).toFixed(2);

      if (Number(total) > 0) setTotalAfterPromoPlannet(Number(total));
      else setTotalAfterPromoPlannet(0);
    } else {
      setTotalAfterPromoPlannet(newTotalAmount - promoCodeDiscount);
    }
  }, [newTotalAmount, usePlannetCash, promoCodeDiscount]);

  const backToHome = () => {
    if (from === 'summary-details') {
      router.push(
        `/summary-details/${router.query.id}?startDate=${router.query.startDate}&endDate=${router.query.endDate}`,
      );
    } else {
      router.push(`/summary/${router.query.id}`);
    }
  };

  useEffect(() => {
    setBookingFor(getPlannetUserFullnameFromLocalStorage());
  }, []);

  useEffect(() => {
    if (tripData) {
      setBookPayment((prv: any) => {
        return { ...prv, TripLegId: tripData?.tripLegs[0]?.id };
      });
      // console.log(selectedHotel);
      const selHtl = getPlannetAffiliateSelHtlIdFromLocalStorage();
      if (
        !selHtl ||
        selHtl === '' ||
        selHtl === undefined ||
        selHtl === 'undefined'
      ) {
        backToHome();
      } else {
        const validHotel = tripData.hotelBookings.findIndex(
          (ht: any) => ht.id === selHtl,
        );
        if (validHotel === -1) {
          backToHome();
        } else {
          generateItenDetails(tripData, tripData?.itineraryEvents);
        }
      }
    }

    // setPageIsLoading(false);
  }, [tripData]);

  if (tripData && !tripData.itineraryEvents) {
    router.push('/');
    return null;
  }

  const updatePaymentDesign = (data: string | number) => {
    if (
      String(data) &&
      String(data).split('.') &&
      String(data).split('.').length > 0
    ) {
      return Number(data).toFixed(2);
    }
    return Number(data);
  };

  return (
    <>
      {isLoadingTrip ? (
        <div className="min-h-[100dvh] flex my-auto bg-[#1F133E] text-white">
          <Loader color="white" size={50} />
        </div>
      ) : (
        !showModalPage && (
          <>
            {!paymentComplete ? (
              <div className="bg-[#1F133E] text-white p-4 min-h-[100dvh]">
                <div className="flex justify-between">
                  <div className="flex flex-row">
                    <div>
                      <Link href="#!" onClick={backToHome} className="mt-3">
                        <IoIosArrowBack size={30} />
                      </Link>
                    </div>
                    <div className="ml-1">
                      <h2 className="text-[24px] mt-[-3px]">
                        Trip to {tripData?.tripLegs[0]?.City?.name}
                      </h2>
                      {router.query.startDate && router.query.endDate ? (
                        <button
                          className="font-light text-[18px] text-white-700 underline decoration-1 underline-offset-2"
                          onClick={handleDateSelection}
                        >
                          {`${getFormattedDate(
                            String(router.query.startDate),
                          )} - ${getFormattedDate(
                            String(router.query.endDate),
                          )}`}
                        </button>
                      ) : (
                        <button
                          className="font-light text-[18px] text-white-700"
                          onClick={handleDateSelection}
                        >
                          {`${getFormattedDate(
                            tripData?.tripLegs[0]?.startDate,
                          )} - ${getFormattedDate(
                            tripData?.tripLegs[0]?.endDate,
                          )}`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="my-2">
                  <p className="font-light text-lg">
                    Booking For:{' '}
                    <span className="font-bold">{`${bookingFor}`}</span>
                  </p>
                </div>
                <hr className="h-px bg-white-200 border-0 dark:bg-white-700" />
                <div className="pt-1">
                  {itineraryDetails &&
                    itineraryDetails.length > 0 &&
                    itineraryDetails.map((item: any) => {
                      return (
                        <div
                          className="flex justify-between mb-1"
                          key={item.id}
                        >
                          <div
                            style={{ width: '80%' }}
                            className="inline-flex gap-2 text-white text-opacity-60 text-[16px] font-[400]"
                            key={item.id}
                          >
                            <span>1</span>
                            <span>
                              {item.type} {item.title}{' '}
                              {item.type == 'Room' ? (
                                item.numNights != null && item.numNights > 1 ? (
                                  <>| {item.numNights} night(s)</>
                                ) : (
                                  <>| {item.numNights} night</>
                                )
                              ) : (
                                ''
                              )}
                            </span>
                          </div>

                          <div className="priceContent">
                            {item.actualAmount >= 0 && (
                              <p>
                                <span className="text-white text-opacity-60 text-[16px] font-[400]">
                                  $
                                  {updatePaymentDesign(
                                    Number(item.actualAmount),
                                  )}{' '}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  {isCFAR && (
                    <div className="flex justify-between mb-1">
                      <div
                        style={{ width: '80%' }}
                        className="inline-flex gap-2 text-white text-opacity-60"
                      >
                        Cancellation until {cancellationDay}
                      </div>
                      <div className="priceContent">
                        {isCancellationFree ? (
                          <p className="text-white grid text-opacity-60 inline-block">
                            <span className="text-white text-opacity-60 text-[16px] font-[400] line-through">
                              ${updatePaymentDesign(Number(cancellationFee))}
                            </span>{' '}
                            FREE
                          </p>
                        ) : (
                          <p>
                            <span className="text-white text-opacity-60 text-[16px] font-[400] ">
                              ${updatePaymentDesign(Number(cancellationFee))}{' '}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <hr className="h-px mt-1 bg-white-200 border-0 dark:bg-white-700" />
                <div className="mt-2">
                  <div className="flex justify-between">
                    <div className="inline-flex gap-2 text-white text-opacity-60 text-[16px] font-[400]">
                      Taxes & fees
                    </div>
                    <p>
                      <span className="text-white text-opacity-60 text-[16px] font-[400]">
                        ${updatePaymentDesign(taxableAmount)}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mt-1">
                    <div className="inline-flex text-white text-opacity-60 text-[16px] font-[400]">
                      Promo code
                    </div>
                    <button
                      onClick={() => setIsPromoCodeScreenOpen(true)}
                      className="flex items-center text-xs"
                    >
                      <span className="text-white-600 text-[16px] font-[400]">
                        {promoCodeDiscount
                          ? `-$${promoCodeDiscount}`
                          : 'Enter code'}
                      </span>
                      <IoIosArrowForward size={20} className="text-white-600" />
                    </button>
                  </div>
                </div>
                <hr className="h-px mt-1 bg-white-200 border-0 dark:bg-white-700" />
                <div className="py-2">
                  <div className="flex justify-between text-[18px] font-[700]">
                    <div className="inline-flex gap-2 font-extrabold">
                      Total
                    </div>
                    <p>
                      <span className="font-extrabold">
                        $
                        {updatePaymentDesign(
                          newTotalAmount - promoCodeDiscount,
                        )}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="inline-flex text-base font-normal text-[16px] font-[500] w-[52%] items-center">
                    <input
                      type="checkbox"
                      id="plannetCash"
                      name="plannetCash"
                      checked={usePlannetCash}
                      onChange={() => {
                        setUsePlannetCash(!usePlannetCash);
                      }}
                      className="rounded accent-[#7440F566] h-4 w-4 mr-1"
                    />
                    <label htmlFor="plannetCash">Pay with Plannet Cash.</label>
                  </div>
                  <span className="text-white text-opacity-60 text-[sm] font-[400] text-end">
                    Available Balance $
                    {updatePaymentDesign(Number(plannetCash / 100))}
                  </span>
                </div>

                <hr className="h-px mt-1 bg-white-200 border-0 dark:bg-white-700" />

                <div className="p-2">
                  <div className="flex justify-between  py-2">
                    <div className="inline-flex gap-2 text-base text-xl font-extrabold">
                      New Total
                    </div>
                    <p>
                      <span className="text-xl font-extrabold">
                        ${updatePaymentDesign(totalAfterPromoPlannet)}
                      </span>
                    </p>
                  </div>
                </div>
                {/* CFAR */}
                {isCFAR && (
                  <div
                    className="bg-[#7440F566] bg-white p-2 rounded-lg flex flex-start gap-2 my-1"
                    onClick={() => handlePayment('isInsurancePurchased', true)}
                  >
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
                      <p className="font-extrabold text-[20px] text-[#1f133e] font-[700]">
                        Cancel for any reason
                      </p>
                      <p className="text-[16px] text-[#1f133e] font-[400]">
                        until {cancellationDay}
                      </p>
                    </div>
                  </div>
                )}
                <p className="my-5 mb-20 payment-info">
                  You will receive a text message from one of our travel
                  coordinators to confirm dates and times for your experiences
                </p>
                <div className="mt-8">
                  <button
                    className="bg-[#7440F5] text-[#1f133e] bg-white rounded-lg h-[3rem] mb-2.5 font-bold fixed-button"
                    onClick={handleComplete}
                  >
                    {isLoading ? (
                      <Loader color="white" />
                    ) : (
                      <span>Pay Now</span>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <PlannetPaymentComplete
                isComplete
                cityName={tripData?.tripLegs[0]?.City?.name}
                backToHome={() => backToHome()}
              />
            )}

            {paymentInfo && (
              <PaymentCard
                isOpen={paymentModal}
                onClose={() => setPaymentModal(false)}
                onComplete={() => handleoneClickPayment()}
                paymentInfo={paymentInfo}
                tripId={tripId}
                amount={updatePaymentDesign(totalAfterPromoPlannet)}
                tripLegId={bookPayment.TripLegId}
                oneClickAlliance={oneClickID}
                tripRefetch={tripRefetch}
              />
            )}
          </>
        )
      )}

      <PromoCodeScreen
        isPromoCodeScreenOpen={isPromoCodeScreenOpen}
        setIsPromoCodeScreenOpen={setIsPromoCodeScreenOpen}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        setPromoCodeDiscount={setPromoCodeDiscount}
      />

      <SummaryCalendar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        range={range}
        setRange={setRange}
        handleUpdateDate={handleUpdateDate}
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
