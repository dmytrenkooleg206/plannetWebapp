import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Loader from '@/components/Loader/Loader';
import { persistAffiliateSelHtlIdInLocalStorage } from '@/lib/localStorage/localStorage';
import Slider from 'react-slick';
import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai';
import ReviewSummary from './ReviewSummary';

export default function HotelCard({
  hotels,
  isLoading,
  isOpen,
  isPriceVisible,
  isPriceFound,
  avgPrice,
  setDeleteConfirmModal,
  setDeleteItiEveData,
  itenaryEvents,
  setSelectedHotelId,
  ...rest
}: any) {
  const categoryColorCode: any = {
    LUX: '#F3AA60',
    HIP: '#EF6262',
    SOLID: '#468B97',
  };

  const router = useRouter();
  const [hotelData, setHotelData] = useState<any>([]);
  const slider: any = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    autoplay: false,
    autoplaySpeed: 2000,
    dots: false,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const getHotelImage = (data: any) => {
    if (data && data.hotel && data.hotel.image !== '') {
      return data.hotel.image;
    }
    return '/assets/images/no-images.png';
  };

  useEffect(() => {
    const hotelItems: any = [];
    if (hotels && hotels.length) {
      hotels.map((hotel: any) => {
        const itenaryHotelIndex = itenaryEvents.findIndex(
          (item: any) =>
            item.type === 'STAY' && item.HotelBookingId == hotel.id,
        );

        const hotelDetails = itenaryEvents[itenaryHotelIndex];
        const removeStringiFy = JSON.parse(hotelDetails.hotelObj);

        let distance = 0;
        if (hotel?.hotelObj?.hotel?.distance) {
          distance = Math.floor(hotel.distance * 1609.34);
        }

        hotelItems.push({
          hotelName: hotel.hotelObj.hotel.hotelName,
          hotelImage: getHotelImage(hotel.hotelObj),
          category: hotel?.PlannetHotel?.category,
          hotelDescription: removeStringiFy.hotel.hotelDescription,
          distance: distance > 0 ? distance : 1200,
          rating: hotel?.PlannetHotel?.tripAdvisorRating,
          ratingCount: hotel?.PlannetHotel?.tripAdvisorReviewCount,
          hotelId: hotel.id,
          badgeColorCode:
            categoryColorCode[hotel?.PlannetHotel?.category] &&
            categoryColorCode[hotel?.PlannetHotel?.category] !== ''
              ? categoryColorCode[hotel?.PlannetHotel?.category]
              : '#000',
          hotelAvgNightlyPrice:
            hotel.hotelObj.hotel.averageNightlyRateCents || 0,
        });
      });
    }

    setHotelData(hotelItems);
  }, [hotels]);

  const redirectToHotel = (e: any, hotelId: string | number) => {
    e.preventDefault();
    router.push(
      router.query.startDate
        ? `/summary-details/hotel/${router.query.id}/${hotelId}?startDate=${router.query.startDate}&endDate=${router.query.endDate}`
        : `/summary-details/hotel/${router.query.id}/${hotelId}`,
    );
  };

  useEffect(() => {
    persistAffiliateSelHtlIdInLocalStorage(hotelData[currentSlide]?.hotelId);
    setSelectedHotelId(hotelData[currentSlide]?.hotelId);
  }, [currentSlide, hotelData]);

  return (
    <div {...rest} className="bg-white-100 rounded-lg">
      {!Object.keys(hotels).length ? (
        <div className="rounded bg-white-100 p-2">
          <div className="flex justify-between">
            <div className="inline-flex gap-2">
              <Image
                src="/assets/images/summary/icon-hotel.svg"
                width={30}
                height={30}
                alt="hotel"
                priority={true}
              />
              Adding Hotel
            </div>
            <svg
              aria-hidden="true"
              className="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="gray"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        </div>
      ) : (
        <div className="rounded hotelSliderDashboard">
          <Slider
            {...settings}
            ref={slider}
            afterChange={(slideIndex) => setCurrentSlide(slideIndex)}
          >
            {hotelData &&
              hotelData.map((hotel: any) => {
                return (
                  <div
                    className="rounded p-2 relative"
                    key={hotel.hotelId}
                    onClick={(e) => {
                      e.preventDefault();
                      return redirectToHotel(e, hotel.hotelId);
                    }}
                  >
                    <div className="justify-between items-center">
                      <div className="flex justify-between items-center">
                        <div className="inline-flex gap-2  items-center font-bold">
                          <p className="mt-2 font-[700] text-[24px] leading-[22px]">
                            {/* {hotel.hotelName < 100
                              ? hotel.hotelName
                              : hotel.hotelName.substring(0, 100) + '...'} */}
                            {hotel.hotelName ? hotel.hotelName : ''}
                          </p>
                        </div>
                        {hotels?.length > 1 && (
                          <div className="bottomContent gap-5">
                            <button
                              className={
                                currentSlide == 0 ? 'button-disabled' : ''
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                slider?.current?.slickPrev();
                              }}
                            >
                              <AiOutlineLeft />
                            </button>
                            <button
                              className={
                                currentSlide == hotels?.length - 1
                                  ? 'button-disabled'
                                  : ''
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                slider?.current?.slickNext();
                              }}
                            >
                              <AiOutlineRight />
                            </button>
                          </div>
                        )}
                      </div>
                      {/* Bottom Content */}
                      <div className="flex justify-between items-center mt-2">
                        <div className="inline-flex gap-2 flex-col w-[98%]">
                          <div className="flex gap-2 items-center">
                            <img
                              src={hotel.hotelImage}
                              className="rounded h-[104px] w-[104px]"
                              width={100}
                              height={100}
                              alt=""
                            />
                            <div className="w-3/4 text-white-600 text-medium font-[400] gap-1 flex flex-col justify-center">
                              <div className="inlineBlock ">
                                {/* <p className='float-left'>{hotel.distance} meters from city center</p> */}
                                {/* <p className="float-left ">Neighborhood</p> */}
                                {hotel.category && hotel.category != '' && (
                                  <p className="float-right">
                                    <span
                                      className={`inline-flex items-center rounded-md 
                                      text-[#fff] px-2 py-1 text-xs font-medium`}
                                      style={{
                                        backgroundColor: hotel.badgeColorCode,
                                      }}
                                    >
                                      {hotel.category}
                                    </span>
                                  </p>
                                )}
                              </div>
                              <p className="breakDescription text-white h-[60px] leading-5">
                                {hotel.hotelDescription}
                              </p>
                              {/* <ReviewSummary
                                rating={hotel.rating}
                                count={hotel.ratingCount}
                                fillColor={'text-[#2CA251]'}
                              /> */}
                              <a
                                href="!#"
                                className="selectHotel"
                                onClick={(e) =>
                                  redirectToHotel(e, hotel.hotelId)
                                }
                              >
                                See More
                              </a>
                            </div>
                          </div>
                          {/* Price-Review Content */}
                          {isPriceVisible && (
                            <div className="flex justify-between gap-2 items-center">
                              <ReviewSummary
                                rating={hotel.rating}
                                count={hotel.ratingCount}
                                fillColor={
                                  hotel.rating > 0 ? 'text-[#2CA251]' : ''
                                }
                              />
                              {isPriceVisible ? (
                                isPriceFound ? (
                                  <div className="font-bold text-right leading-3  mt-[-40px]">
                                    <span className="text-2xl font-bold">
                                      {`$` +
                                        Math.round(
                                          Number(hotel.hotelAvgNightlyPrice) /
                                            100,
                                        )}
                                    </span>
                                    <br />
                                    <span className="font-light ">
                                      avg/night
                                    </span>
                                  </div>
                                ) : (
                                  <div className="inline-flex gap-2">
                                    <Loader color="#fff" />
                                  </div>
                                )
                              ) : (
                                ''
                              )}
                            </div>
                          )}
                          {/* Price-Review Content */}
                        </div>
                      </div>
                      {/* Bottom Content */}
                    </div>
                  </div>
                );
              })}
          </Slider>
        </div>
      )}
    </div>
  );
}
