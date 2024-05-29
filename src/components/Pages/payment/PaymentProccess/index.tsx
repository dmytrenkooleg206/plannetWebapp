/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable no-case-declarations */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { GoDotFill } from 'react-icons/go';
import Button from '@/components/Button/Button';
import {
  getPlannetAffiliateSelHtlIdFromLocalStorage,
  getPlannetUserFullnameFromLocalStorage,
  persistPlannetPhoneCodeInLocalStorage,
} from '@/lib/localStorage/localStorage';
import { useQuery } from 'react-query';
import { getPlannetCashBalance } from '@/api/wallet/wallet.service';
import { QUERY_OPTION } from '@/lib/constants';
import dayjs from 'dayjs';
import { getHotelBaseAmount, getHotelTaxAmount } from '@/lib/utils';
import { getGuestTripById } from '@/api/trip/trip.service';
import useSummaryDatesUpdate from '@/hooks/useSummaryDatesUpdate';
import styles from './index.module.scss';
import Logo from './images/logo.svg';
import Congrates from './Congrates';
import PaymentCardLists from './PaymentCardLists';
import PromoCodeScreen from '../../Summary/PaymentDetails/PromoCodeScreen';

type PaymentProccessProps = {
  phoneCode: string;
  isVerified: boolean;
  onVerifyShow: Function;
};

const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRETE_KEY);

export default function PaymentProccess({
  phoneCode,
  onVerifyShow,
  isVerified,
}: PaymentProccessProps) {
  const [bookPayment, setBookPayment] = useState<any>({
    TripLegId: 0,
    usePlannetCash: false,
    isInsurancePurchased: false,
  });
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchedCard, setIsFetchedCard] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [promoCodeDiscount, setPromoCodeDiscount] = useState(0);
  const [isPromoCodeScreenOpen, setIsPromoCodeScreenOpen] =
    useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string>('');
  const [customerId, setCustomerId] = useState<any>();
  const [cards, setCards] = useState<any>(null);
  const [selectedCard, setSelectedCard] = useState<any>();
  const [defaultCard, setDefaultCard] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState<number>(2900.0);
  const [usePlannetCash, setUsePlannetCash] = useState<boolean>(false);
  const [plannetCash, setPlannetCash] = useState(0);
  const [isCFAR, setIsCFAR] = useState<boolean>(true);
  const [cancellationDay, setCancellationDay] = useState('');
  const [isCancellationFree, setIsCancellationFree] = useState<boolean>(true);
  const [traveller, setTraveller] = useState<any>(null);
  const [cancellationFee, setCancellationFee] = useState<any>(0);
  const [newTotalAmount, setNewTotalAmount] = useState<number>(0);
  const [itineraryDetails, setItineraryDetails] = useState<any>([]);
  const [taxableAmount, setTaxableAmount] = useState(0);
  const [tripId, setTripId] = useState<any>(null);
  const [isCalledQuery, setIsCalledQuery] = useState<boolean>(true);
  const [pageName] = useState<string>('checkout');
  const [bookingFor, setBookingFor] = useState<string>('TEST');
  const [totalAfterPromoPlannet, setTotalAfterPromoPlannet] =
    useState<number>(0);

  const router = useRouter();

  const { data: balanceData } = useQuery(
    ['balance'],
    () => getPlannetCashBalance(),
    { ...QUERY_OPTION },
  );

  const {
    isLoading: isLoadingTrip,
    data: tripData,
    error,
    refetch: tripRefetch,
  }: any = useQuery(
    ['trip_details'],
    () => getGuestTripById('144a41e9-4a7c-4e7e-9bf8-a404407faf02', ''),
    {
      ...QUERY_OPTION,
      enabled: isCalledQuery,
    },
  );

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

  const backToHome = () => {
    router.push(
      `/checkout/${router.query.id}?startDate=${router.query.startDate}&endDate=${router.query.endDate}`,
    );
  };

  const fetchCards = useCallback(async (cusId: any) => {
    setIsFetchedCard(false);
    const paymentMethods = await stripe.customers.listPaymentMethods(cusId, {
      type: 'card',
    });
    if (defaultCard) {
      const newArray = [...paymentMethods.data];
      const index = newArray.findIndex((card) => card.id === defaultCard);
      if (index !== -1 && index !== 0) {
        [newArray[0], newArray[index]] = [newArray[index], newArray[0]];
        setCards(newArray);
      }
    } else setCards(paymentMethods?.data);
    setIsFetchedCard(true);
  }, []);

  const fetchCustomers = useCallback(async (phone: any) => {
    const { data } = await stripe.customers.list({
      email: `${phone}@mail.com`,
      limit: 1,
    });
    if (data.length) {
      setCustomerId(data[0].id);
    }
  }, []);

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
  const handleGoBack = () => {
    if (progress) {
      router.push('/checkout');
      setProgress(0);
    } else {
      router.push('/');
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    switch (progress) {
      case 0:
        setIsLoading(false);
        onVerifyShow(true);
        break;
      case 1:
        setIsLoading(false);
        const paymentIntent = await stripe.paymentIntents.create({
          amount: totalAmount,
          currency: 'usd',
          payment_method_types: ['card'],
          payment_method: selectedCard,
          customer: customerId,
        });
        await stripe.paymentIntents
          .confirm(paymentIntent.id, {
            payment_method: selectedCard,
          })
          .then(() => setIsPaid(true));
        break;
      default:
        break;
    }
  };

  const handlePayment = (key: any, value: any) => {
    setBookPayment((prv: any) => {
      return { ...prv, [key]: value };
    });
  };

  useEffect(() => {
    if (router.query.id) {
      setTripId(router.query.id);
    }
    // setBookingFor(getPlannetUserFullnameFromLocalStorage());
  }, []);

  useEffect(() => {
    setPlannetCash(balanceData?.PlannetCashData?.balanceCents);
  }, [balanceData, balanceData?.PlannetCashData]);

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
  }, [backToHome, generateItenDetails, tripData]);

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

  useEffect(() => {
    console.log('###', tripId);
  }, [tripData]);

  useEffect(() => {
    if (localStorage.getItem('defaultCard')) {
      setDefaultCard(localStorage.getItem('defaultCard'));
    }
  }, []);

  useEffect(() => {
    if (phoneCode) fetchCustomers(phoneCode);
  }, [fetchCustomers, phoneCode]);

  useEffect(() => {
    if (customerId) fetchCards(customerId);
  }, [customerId, fetchCards]);

  useEffect(() => {
    if (isVerified) {
      console.log(4);

      if (isFetchedCard) {
        if (cards.length === 0) {
          console.log('#$#$', cards);
          router.push({
            pathname: '/addPayment',
            query: { beforeRoute: 'checkout' },
          });
        } else {
          setProgress(1);
          setSelectedCard(cards[0].id);
        }
      }
    }
  }, [isVerified, cards, router, isFetchedCard]);

  useEffect(() => {
    if (router.query?.isAddedCard) {
      console.log(6);
      setCustomerId(router.query?.isAddedCard);
      fetchCards(router.query?.isAddedCard);
      if (isFetchedCard && cards.length) {
        setProgress(1);
      }
    }
  }, [isFetchedCard, router.query?.isAddedCard]);

  if (tripData && !tripData.itineraryEvents) {
    router.push('/');
    return null;
  }
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Link href="/" className={styles.logo}>
          <Image src={Logo} alt="plannet" priority />
        </Link>
        {isPaid ? (
          <Congrates />
        ) : (
          <div className={styles.form}>
            <div className={styles.header}>
              Trip to {tripData?.tripLegs[0]?.City?.name}
              <div className={styles.arrowBack} onClick={handleGoBack}>
                <FaChevronLeft />
              </div>
            </div>

            <div className="flex flex-col flex-1">
              {progress ? (
                <PaymentCardLists
                  cards={cards}
                  selectedCard={selectedCard}
                  defaultCard={defaultCard}
                  setSelectedCard={setSelectedCard}
                />
              ) : (
                <div className={styles.innerContent}>
                  <div className="flex w-full justify-between text-[24px] max-sm:text-[20px] font-[700] mb-[16px]">
                    <p className="text-[#FFFFFF99]">Booking For:</p>
                    <p className="text-[#FFFFFF]">{bookingFor}</p>
                  </div>
                  <ul className="gap-[16px] text-[20px] max-sm:text-[16px] font-[500] gap-[16px]">
                    {itineraryDetails &&
                      itineraryDetails.length > 0 &&
                      itineraryDetails.map((item: any, index: number) => (
                        <li className="flex w-full justify-between" key={index}>
                          <p className="flex items-center gap-[10px] text-[#FFFFFF99] ml-[10px]">
                            <span className="text-[12px]">
                              <GoDotFill />
                            </span>
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
                          </p>
                          {item.actualAmount >= 0 && (
                            <p className="text-[#FFFFFF]">
                              ${updatePaymentDesign(Number(item.actualAmount))}
                            </p>
                          )}
                        </li>
                      ))}
                    {/* <li className="flex w-full justify-between">
                      <p className="flex items-center gap-[10px] text-[#FFFFFF99] ml-[10px]">
                        <span className="text-[12px]">
                          <GoDotFill />
                        </span>
                        Luxury Room | 2 night(s) @325
                      </p>
                      <p className="text-[#FFFFFF]">$1,650.00</p>
                    </li>
                    <li className="flex w-full justify-between">
                      <p className="flex items-center gap-[10px] text-[#FFFFFF99] ml-[10px]">
                        <span className="text-[12px]">
                          <GoDotFill />
                        </span>
                        Experience 1 with long
                      </p>
                      <p className="text-[#FFFFFF]">$26.66</p>
                    </li> */}
                    {/* <li className="flex w-full justify-between">
                      <p className="flex items-center gap-[10px] text-[#FFFFFF99] ml-[10px]">
                        <span className="text-[12px]">
                          <GoDotFill />
                        </span>
                        Experience 2 with long
                      </p>
                      <p className="text-[#FFFFFF]">$30.25</p>
                    </li> */}
                    <li className="flex w-full justify-between">
                      <p className="flex items-center gap-[10px] text-[#FFFFFF99] ml-[10px]">
                        <span className="text-[12px]">
                          <GoDotFill />
                        </span>
                        Cancellation until Sep 14
                      </p>
                      {isCancellationFree ? (
                        <p className="text-[#FFFFFF]">
                          <s className="text-[#FFFFFF99] mr-[10px]">
                            ${updatePaymentDesign(Number(cancellationFee))}
                          </s>{' '}
                          FREE
                        </p>
                      ) : (
                        <p className="text-[#FFFFFF]">
                          <s className="text-[#FFFFFF99] mr-[10px]">
                            ${updatePaymentDesign(Number(cancellationFee))}
                          </s>
                        </p>
                      )}
                    </li>
                  </ul>
                  <hr className="w-full bg-[#FFFFFF4D] text-[#FFFFFF4D] my-[16px]" />
                  <ul className="gap-[16px] text-[20px] max-sm:text-[16px] font-[500] gap-[16px]">
                    <li className="flex w-full justify-between">
                      <p className="flex items-center gap-[10px] text-[#FFFFFF99] ml-[10px]">
                        <span className="text-[12px]">
                          <GoDotFill />
                        </span>
                        Taxes & Fees
                      </p>
                      <p className="text-[#FFFFFF]">
                        ${updatePaymentDesign(taxableAmount)}
                      </p>
                    </li>
                    <li className="flex w-full justify-between">
                      <p className="flex items-center gap-[10px] text-[#FFFFFF99] ml-[10px]">
                        <span className="text-[12px]">
                          <GoDotFill />
                        </span>
                        Promo code
                      </p>
                      <p
                        onClick={() => setIsPromoCodeScreenOpen(true)}
                        className="flex items-center !bg-[none]"
                      >
                        <span className="text-white-600 font-[500]">
                          {promoCodeDiscount
                            ? `-$${promoCodeDiscount}`
                            : 'Enter code'}
                        </span>
                        <IoIosArrowForward size={32} className="text-white" />
                      </p>
                    </li>
                  </ul>
                  <hr className="w-full bg-[#FFFFFF4D] text-[#FFFFFF4D] my-[16px]" />
                  <div className="flex w-full justify-between text-[20px] max-sm:text-[16px] font-[700] mb-[16px]">
                    <p className="text-[#fff]">Total</p>
                    <p className="text-[#FFFFFF]">
                      ${updatePaymentDesign(newTotalAmount - promoCodeDiscount)}
                    </p>
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
                      <label htmlFor="plannetCash" className="text-white">
                        Pay with Plannet Cash.
                      </label>
                    </div>
                    <span className="text-white text-opacity-60 text-[sm] font-[400] text-end">
                      Available Balance $
                      {updatePaymentDesign(Number(plannetCash / 100))}
                    </span>
                  </div>
                  <hr className="w-full bg-[#FFFFFF4D] text-[#FFFFFF4D] my-[16px]" />
                  <div className="p-2 text-white text-[24px] max-sm:text-[20px] font-[700]">
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
                  {isCFAR && (
                    <div
                      className="bg-[#7440F566] !text-white p-2 rounded-lg flex flex-start gap-2"
                      onClick={() =>
                        handlePayment('isInsurancePurchased', true)
                      }
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
                            stroke="#fff"
                            strokeWidth="2.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M11.8203 15.9445L15.532 19.6562L22.1797 13.0087"
                            stroke="#fff"
                            strokeWidth="2.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-extrabold text-[20px] text-[#fff] font-[700]">
                          Cancel for any reason
                        </p>
                        <p className="text-[16px] text-[#fff] font-[400]">
                          until {cancellationDay}
                        </p>
                      </div>
                    </div>
                  )}
                  <p className="text-[16px] w-full text-[#FFFFFF99] font-[400]">
                    You will receive a text message from one of our travel
                    coordinators to confirm dates and times for your experiences
                  </p>
                </div>
              )}
            </div>
            <div>
              <div className="max-sm:mb-[130px]">
                <Button
                  text="Continue"
                  isLoading={isLoading}
                  color="gray"
                  onClick={handleContinue}
                />
                {/* {!cards?.length && <p>Verify Phone Number to check out</p>} */}
              </div>
            </div>
          </div>
        )}
      </div>
      <PromoCodeScreen
        isPromoCodeScreenOpen={isPromoCodeScreenOpen}
        setIsPromoCodeScreenOpen={setIsPromoCodeScreenOpen}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        setPromoCodeDiscount={setPromoCodeDiscount}
      />
    </div>
  );
}
