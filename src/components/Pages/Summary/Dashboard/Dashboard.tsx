import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { DownloadModal } from '@/components/Modals/DownloadModal';
import { useQuery } from 'react-query';
import { getTripById } from '@/api/trip/trip.service';
import { QUERY_OPTION } from '@/lib/constants';
import { getFormattedDate } from '@/lib/utils';
import Loader from '@/components/Loader/Loader';
import { useRouter } from 'next/router';
import ExperienceCard from './ExperienceCard';
import FooterNav from './FooterNav';
import HotelCard from './HotelCard';
import TotalCostCard from './TotalCostCard';

export default function Dashboard({ tripId }: any) {
  const router = useRouter();
  const [showDownloadAppModal, setShowDownloadAppModal] =
    useState<boolean>(false);
  const [isCFAR, setIsCFAR] = useState<boolean>(false);
  
  const { isLoading: isLoadingTrip, data: tripData } = useQuery(
    ['trip', tripId],
    () => getTripById(tripId),
    {
      ...QUERY_OPTION,
    },
  );

  if (!isLoadingTrip && tripData && !tripData.itineraryEvents) {
    router.push('/');
    return null;
  }
  const twoDaysBefore = dayjs(tripData?.tripLegs[0].startDate).subtract(2, 'd');
  const twoDaysBeforeStr = dayjs(twoDaysBefore).format('MMM DD');

  let hotelTotal = 0;
  let expTotal = 0;
  const images: string[] = [];
  if (tripData?.tripLegs[0]?.City?.photoUrl) {
    images.push(tripData?.tripLegs[0]?.City?.photoUrl);
  }

  const tempDTd: any = { hotels: [], exp: [] };

  if (tripData) {
    tripData?.itineraryEvents?.forEach((event: any) => {
      if (
        event.type === 'STAY' &&
        !tempDTd.hotels.find((eh: any) => eh.id === event.id)
      ) {
        tempDTd.hotels.push(event);
        const hotel = tripData.hotelBookings.find(
          (ht: any) => ht.id === event.HotelBookingId,
        );

        hotelTotal +=
          hotel.hotelObj.hotel.bestPrice.FxConvertedAmounts.totalCents;
        images.push(hotel.hotelObj.hotel.image);
      } else if (
        event.type === 'EVENT' &&
        !tempDTd.exp.find((eh: any) => eh.id === event.id)
      ) {
        expTotal +=
          event.viatorAvailabilityObj.bookableItems[0].totalPrice.price
            .recommendedRetailPriceCents;
        tempDTd.exp.push(event);

        const maxwidth = event.viatorProductDetails.images[0].variants.filter(
          (vr: any) => vr.width >= 720,
        );

        images.push(maxwidth[0].url);
      }
    });
  }

  useEffect(() => {
    if (tempDTd.hotels.length === 1 && tempDTd.exp.length === 3) {
      setIsCFAR(true);
    }
  }, [tempDTd.hotels, tempDTd.exp]);

  return (
    <>
      {isLoadingTrip ? (
        <div className="h-screen flex my-auto bg-[#1F133E] text-white">
          <Loader color="white" size={50} />
        </div>
      ) : (
        <>
          <div className="bg-[#1F133E] text-white h-[100%]">
            <div className=" bg-[#1F133E] p-4 min-h-[100vh]">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-[24px] font-bold">
                    Trip to {tripData?.tripLegs[0]?.City?.name}
                  </h2>
                  <p className="font-light text-[20px] text-white-700">
                    {tripData?.tripLegs[0]?.numAdults} Adults
                  </p>
                  <p className="font-light text-[20px] text-white-700">
                    {`${getFormattedDate(
                      tripData?.tripLegs[0]?.startDate,
                    )} - ${getFormattedDate(tripData?.tripLegs[0]?.endDate)}`}
                  </p>
                </div>
                <button>
                  <Image
                    src="/assets/images/summary/edit.svg"
                    width={24}
                    height={24}
                    alt="edit"
                  />
                </button>
              </div>
              {/* CFAR */}
              {isCFAR && (
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
                isPriceVisible="true"
              />
              {tempDTd &&
                tempDTd.hotels &&
                tempDTd.hotels.map((hotel: any) => (
                  <HotelCard
                    tripdata={tripData}
                    key={hotel.id}
                    hotelId={hotel.HotelBookingId}
                    selectedHotel={hotel || {}}
                    isLoading={isLoadingTrip}
                    isOpen={() => setShowDownloadAppModal(true)}
                    className="mt-4"
                    isPriceVisible="true"
                    hotels={tripData.hotelBookings}
                  />
                ))}
              {tempDTd &&
                tempDTd.exp &&
                Object.keys(tempDTd.exp).length > 0 && (
                  <ExperienceCard
                    selectedProducts={tempDTd.exp}
                    isLoading={isLoadingTrip}
                    expTotal={expTotal}
                    expDiscount={0}
                    isOpen={() => setShowDownloadAppModal(true)}
                    className="mt-4"
                    isPriceVisible="true"
                    tripId={tripId}
                  />
                )}
            </div>
            <FooterNav
              isOpen={() => setShowDownloadAppModal(true)}
              tripData={tripData}
            />
          </div>
          <DownloadModal
            isOpen={showDownloadAppModal}
            onClose={() => setShowDownloadAppModal(false)}
          />
        </>
      )}
    </>
  );
}
