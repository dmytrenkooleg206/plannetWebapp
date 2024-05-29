import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft } from 'react-icons/fa';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';

import Loader from '@/components/Loader/Loader';
import PhoneNumberInput from '@/components/PhoneNumberInput/PhoneNumberInput';

import { getUserById } from '@/api/user/user.service';
import { getPlannetCashBalance } from '@/api/wallet/wallet.service';
import { createPaymentIntentAlliance } from '@/api/beHotel/beHotel.service';

import { QUERY_OPTION } from '@/lib/constants';
import { getPlannetUserIdFromLocalStorage } from '@/lib/localStorage/localStorage';

import StarIcon from '@/../public/assets/images/bookhotel/star.svg';
import UsersIcon from '@/../public/assets/images/bookhotel/users.svg';
import RoomIcon from '@/../public/assets/images/bookhotel/room.svg';
import { PaymentModal } from './PaymentModal';
import { type FilterInfoType } from '../BookHotelDrawer.type';

type PaymentStepProps = {
  onPrev: Function;
  room: any;
  hotelInfo: any;
  filterInfo: FilterInfoType;
  tripLeg: any;
  onComplete: Function;
};

export default function PaymentStep({
  onPrev,
  room,
  hotelInfo,
  filterInfo,
  tripLeg,
  onComplete,
}: PaymentStepProps) {
  const [offer] = room.offers;
  const perNight = offer.nightlyRate.FxConvertedAmounts.rateCents / 100;
  const stayNights = dayjs(room.checkInOut.checkOutDate).diff(
    room.checkInOut.checkInDate,
    'day',
  );
  const taxAmount =
    (offer.price.FxConvertedAmounts.totalWithTaxCents -
      offer.price.FxConvertedAmounts.baseTotalCents) /
    100;

  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  const { data: userData } = useQuery(
    'current_user',
    () => getUserById(getPlannetUserIdFromLocalStorage()),
    QUERY_OPTION,
  );

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [line1, setLine1] = useState<string>('');
  const [line2, setLine2] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [allainceHoldId, setAllainceHoldId] = useState<string>('');
  const [isCheckedCash, setIsCheckedCash] = useState<boolean>(false);
  const [plannetCash, setPlannetCash] = useState<number>(0);

  const loadPlannetCash = async () => {
    try {
      const { PlannetCashData } = await getPlannetCashBalance();
      setPlannetCash(PlannetCashData.balanceCents / 100);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadPlannetCash();
  }, []);

  useEffect(() => {
    if (userData) {
      const { user } = userData;
      setEmail(user.email);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      if (user.HomeBase) {
        setCity(user.HomeBase.name);
        setCountry(user.HomeBase.country);
      }
    }
  }, [userData]);

  const onPhoneNumberChange = (
    newPhoneNumber: string,
    newCountryCode: string,
  ) => {
    setPhoneNumber(newPhoneNumber);
    setCountryCode(newCountryCode);
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    if (!firstName) {
      toast.warn('Please input first name!');
      return;
    }
    if (!lastName) {
      toast.warn('Please input first name!');
      return;
    }
    if (isDisabled) {
      toast.warn('Please input correct phone number!');
      return;
    }
    if (!line1 || !country || !city || !postalCode) {
      toast.warn('Please input your address!');
      return;
    }

    try {
      setIsLoading(true);
      const { allianceHoldBooking, StripeData }: any =
        await createPaymentIntentAlliance({
          alliancePropertyId: hotelInfo.hotel.allianceMetadata.id,
          ratePlanCode: offer.ratePlan.allianceMetadata.code,
          roomCode: room.id,
          gateway: offer.ratePlan.allianceMetadata.gateway,
          numRooms: filterInfo.numRooms,
          numAdultsPerRoom: filterInfo.numAdults,
          childAges: [],
          startDate: filterInfo.startDate,
          endDate: filterInfo.endDate,
          firstName,
          lastName,
          address: {
            line1,
            line2,
            city,
            region: '',
            postalCode,
            countryCode: 'US',
          },
          countryCode,
          phoneNumber,
          email,
          usePlannetCash: isCheckedCash,
        });
      setPaymentInfo({
        publishableKey: StripeData.publishableKey,
        clientSecret: StripeData.paymentIntent.clientSecret,
        amountCents: StripeData.amountCents,
      });
      setAllainceHoldId(allianceHoldBooking.id);
    } catch (error) {
      toast.error('The alliance service is not available!');
      onPrev();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      <div className="w-full p-6 grow">
        <button
          className="bg-green text-white w-10 md:w-12 h-10 md:h-12 absolute rounded-full flex top-3 left-3 z-20"
          type="button"
          onClick={() => onPrev()}
        >
          <FaChevronLeft className="text-lg md:text-2xl m-auto" />
        </button>
        <div className="bg-black p-5 rounded-lg mt-5">
          <div className="flex">
            <div className="w-16">
              <Image
                loading="lazy"
                src={hotelInfo.hotel.images[0].imageUrl}
                alt="hotel"
                width={64}
                height={64}
                sizes="100vw"
                className="w-full h-auto object-cover rounded"
              />
            </div>
            <div className="ml-5">
              <div className="text-lg md:text-2xl">{hotelInfo.hotel.name}</div>
              <div className="flex">
                <Image
                  className="my-auto"
                  loading="lazy"
                  src={StarIcon}
                  alt="star"
                  style={{ width: '20px', height: 'auto' }}
                />
                <div className="text-lg md:text-xl text-white-600 mt-1 ml-2">
                  {hotelInfo.hotel.numStars} star hotel
                </div>
              </div>
            </div>
          </div>

          <div className="flex border border-white-300 mt-5 mb-3 rounded-md">
            <div className="w-1/2 border-r border-white-300 p-4">
              <div className="text-base md:text-xl">Check in</div>
              <div className="text-base md:text-xl text-white-600">
                {dayjs(room.checkInOut.checkInDate).format('MMM DD, YYYY')}
              </div>
            </div>
            <div className="w-1/2 p-4">
              <div className="text-base md:text-xl">Check out</div>
              <div className="text-base md:text-xl text-white-600">
                {dayjs(room.checkInOut.checkOutDate).format('MMM DD, YYYY')}
              </div>
            </div>
          </div>

          <div className="flex border-b border-white-300 pb-2 mb-2">
            <div className="w-1/2">
              <div className="flex mb-2">
                <Image
                  className="my-auto"
                  loading="lazy"
                  src={UsersIcon}
                  alt="user"
                  style={{ width: '20px', height: 'auto' }}
                />
                <div className="text-base md:text-xl ml-2.5">Guests</div>
              </div>
              <div className="text-base md:text-xl text-white-600">
                {filterInfo.numAdults} adult(s)
              </div>
              <div className="text-base md:text-xl text-white-600">
                {filterInfo.numKids} children
              </div>
            </div>
            <div className="w-1/2">
              <div className="flex mb-2">
                <Image
                  className="my-auto"
                  loading="lazy"
                  src={RoomIcon}
                  alt="room"
                  style={{ width: '20px', height: 'auto' }}
                />
                <div className="text-base md:text-xl ml-2.5">Room</div>
              </div>
              <div className="text-base md:text-xl text-green">
                {filterInfo.numRooms} room(s)
              </div>
            </div>
          </div>

          <div className="flex justify-between text-base md:text-xl text-white-600">
            <div>
              ${perNight} * {stayNights} night(s)
            </div>
            <div>
              $
              {(perNight * stayNights).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="flex justify-between text-base md:text-xl text-white-600">
            <div>Taxes and fees</div>
            <div>
              $
              {taxAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
          {!!plannetCash && (
            <div className="bg-[#7440F533] rounded-md p-5 my-3">
              <div className="flex">
                <input
                  type="checkbox"
                  className="h-6 w-6 rounded my-auto"
                  checked={isCheckedCash}
                  onChange={() => setIsCheckedCash(!isCheckedCash)}
                />
                <div className="text-base md:text-xl ml-2.5 ">
                  Pay with Plannet Cash
                </div>
                <div className="ml-auto text-base md:text-xl">
                  -$
                  {Math.min(
                    plannetCash,
                    perNight * stayNights + taxAmount,
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div className="text-base md:text-xl text-primary mt-3">
                Available Balance ${plannetCash.toFixed(2)}
              </div>
            </div>
          )}
          <div className="flex justify-between text-base md:text-xl font-bold mt-2.5">
            <div>Total</div>
            <div className="flex">
              {isCheckedCash && (
                <div className="text-base my-auto mr-2.5 text-white-600 line-through">
                  $
                  {(perNight * stayNights + taxAmount).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
                </div>
              )}
              <div>
                $
                {Math.max(
                  perNight * stayNights +
                    taxAmount -
                    (isCheckedCash ? plannetCash : 0),
                  0,
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-black p-5 rounded-lg mt-5">
          <div className="text-lg md:text-2xl mb-5">Price information</div>
          <div className="text-base md:text-lg text-white-600">
            Includes <span className="text-green font-bold">${taxAmount}</span>{' '}
            in taxes and fees
            <br />
            {`This price is converted to show you the approximate cost. You'll pay
            in USD. The exchange rate may change before you pay.`}
            <br />
            Keep in mind that your card issuer may charge you a foregin
            transaction fee.
          </div>
        </div>
        <div className="bg-black p-5 rounded-lg mt-5">
          <div className="text-lg md:text-2xl mb-5">Role Information</div>
          <div className="text-base md:text-xl text-white-800">
            None-refundable
          </div>
          <div className="text-base md:text-lg text-white-600">
            Note that if canceled, modified, or in case of no-show, the total
            price of the reservation will be charged
          </div>
          <div className="text-base md:text-lg text-white-600 my-3">
            Booking for{' '}
            <span className="text-green">
              {userData?.user?.firstName} {userData?.user?.lastName}
            </span>
          </div>
          <div className="flex text-base md:text-lg">
            <Image
              className="my-auto"
              src={UsersIcon}
              loading="lazy"
              alt="user"
              style={{ width: '20px', height: 'auto' }}
            />
            <div className="ml-2.5">Guests</div>
            <div className="ml-2.5 text-white-600 underline">
              {filterInfo.numAdults} Guest(s)
            </div>
          </div>
        </div>

        <div className="bg-gray-15 p-5 rounded-lg mt-5 border-black border-2">
          <div className="text-lg md:text-2xl mb-5">Contact Details</div>
          <div className="flex justify-between">
            <div className="w-[calc(50%-10px)]">
              <div className="text-white-600 text-base lg:text-xl">
                First Name *
                <input
                  type="text"
                  className="outline-none p-3 rounded-md my-2 text-white bg-black"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="w-[calc(50%-10px)]">
              <div className="text-white-600 text-base lg:text-xl">
                Last Name *
                <input
                  type="text"
                  className="outline-none p-3 rounded-md my-2 text-white bg-black"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="text-white-600 flex flex-col text-base lg:text-xl mt-3">
            Email *
            <input
              type="text"
              className="outline-none p-3 rounded-md my-2 text-white bg-black"
              placeholder="john.doe@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="text-white-600 flex flex-col text-base lg:text-xl my-2">
            Contact number *
          </div>
          <div className="bg-black rounded-lg">
            <PhoneNumberInput
              onPhoneActive={(active: boolean) => setIsDisabled(!active)}
              onPhoneChange={onPhoneNumberChange}
              onEnter={() => {}}
              isDark
            />
          </div>

          <div className="text-white-600 flex flex-col text-base lg:text-xl mt-3">
            Address
            <input
              type="text"
              className="outline-none p-3 rounded-md my-2 text-white bg-black"
              placeholder="line1"
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              required
            />
            <input
              type="text"
              className="outline-none p-3 rounded-md my-2 text-white bg-black"
              placeholder="line2"
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              required
            />
            <input
              type="text"
              className="outline-none p-3 rounded-md my-2 text-white bg-black"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <input
              type="text"
              className="outline-none p-3 rounded-md my-2 text-white bg-black"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
            <input
              type="text"
              className="outline-none p-3 rounded-md my-2 text-white bg-black"
              placeholder="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 left-0 bg-green py-5 px-7 flex justify-between z-10">
        <div>
          <div className="text-lg md:text-2xl font-bold">
            $
            {Math.max(
              perNight * stayNights +
                taxAmount -
                (isCheckedCash ? plannetCash : 0),
              0,
            ).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="text-base md:text-xl text-white-600">Total</div>
        </div>
        <button
          className="bg-white text-green rounded-lg px-7 text-lg md:text-2xl font-bold"
          type="button"
          onClick={handleSubmit}
        >
          {isLoading ? <Loader /> : 'Pay Now'}
        </button>
      </div>
      {paymentInfo && (
        <PaymentModal
          paymentInfo={paymentInfo}
          onClose={() => setPaymentInfo(null)}
          allainceHoldId={allainceHoldId}
          onComplete={onComplete}
          tripId={tripLeg.TripId}
          tripLegId={tripLeg.id}
        />
      )}
    </div>
  );
}
