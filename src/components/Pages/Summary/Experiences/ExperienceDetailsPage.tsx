import GoogleMapReact from 'google-maps-react-markers';
import { getTourReviews } from '@/api/beHotel/beTour/beTour.service';
import {
  getGuestPlannetExperience,
  getTripById,
} from '@/api/trip/trip.service';
import { QUERY_OPTION } from '@/lib/constants';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Slider from 'react-slick';
import ReviewSummary from '../Dashboard/ReviewSummary';
import style from '../Hotel/HotelDetails.module.scss';
import Loader from '@/components/Loader/Loader';
import CustomDots from '../CustomDots';
import { Disclosure } from '@headlessui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { calculateDistance } from '@/lib/utils';

export default function ExperienceDetailsPage({ tripId, expId }: any) {
  const router = useRouter();

  const [selectedEvent, setSelectedEvent] = useState<any>({});
  const [viatorBooking, setViatorBooking] = useState<any>({});
  const [mainSliderImages, setMainSliderImages] = useState<string[]>([]);
  const [payload, setPayload] = useState<any>({
    productId: '',
    productCode: '',
    sortBy: 'MOST_RECENT',
  });
  const [reviewsSliced, setReviewsSliced] = useState<any[]>([]);
  const [plannerDescShowMore, setPlannerDescSShowMore] =
    useState<boolean>(false);
  const [location, setLocation] = useState<any>({ lat: '', lng: '', name: '' });

  const { data: tripData } = useQuery(
    ['trip_details'],
    () => getTripById(tripId),
    { ...QUERY_OPTION, enabled: !tripId ? false : true },
  );

  const { data: reviewData, isLoading: reviewLoading } = useQuery(
    ['tour_reviews', expId],
    () => getGuestPlannetExperience(payload.productId),
    { ...QUERY_OPTION, enabled: payload.productId ? true : false },
  );

  useEffect(() => {
    if (tripData) {
      setSelectedEvent(
        tripData.itineraryEvents.find(
          (ev: any) => ev.ViatorBookingId === expId,
        ),
      );

      const getViatorData = tripData.viatorBookings.find(
        (bk: any) => bk.id === expId,
      );
      setViatorBooking(getViatorData);

      if (
        getViatorData &&
        getViatorData.ViatorHoldBooking &&
        getViatorData.ViatorHoldBooking.locationByRefObj
      ) {
        const getKey: any = Object.keys(
          getViatorData.ViatorHoldBooking.locationByRefObj,
        ).find((item: any) => item.includes('LOC-'));

        if (getKey != '') {
          const firstLocation =
            getViatorData.ViatorHoldBooking.locationByRefObj[getKey];

          setLocation({
            lat: firstLocation?.center?.latitude
              ? firstLocation?.center?.latitude
              : '',
            lng: firstLocation?.center?.longitude
              ? firstLocation?.center?.longitude
              : '',
            name: firstLocation?.name,
          });
        }
      } else {
        setLocation({
          lat: '',
          lng: '',
          name: '',
        });
      }
    }
  }, [tripData]);

  useEffect(() => {
    if (Object.keys(selectedEvent).length > 0) {
      const sliderImages: string[] = [];
      selectedEvent.viatorProductDetails.images.forEach((img: any) => {
        const image = img.variants.sort((a: any, b: any) => b.width - a.width);
        if (image.length > 0) {
          sliderImages.push(image[0].url);
        }
      });

      setMainSliderImages(sliderImages);

      setPayload({
        ...payload,
        productId: selectedEvent?.viatorProductDetails?.id,
        productCode: selectedEvent?.viatorProductDetails?.productCode,
      });
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (reviewData) {
      setReviewsSliced(reviewData.reviews.slice(0, 10));
    }
  }, [reviewData]);

  const settings = {
    autoplay: false,
    autoplaySpeed: 2000,
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: (dots: any) => (
      <div className="slickDots">
        <ul style={{ margin: '0px' }}> {dots} </ul>
      </div>
    ),
    customPaging: (i: number) => (
      <CustomDots
        width="50px"
        fsize="16px"
        fw="700"
        active={`${i + 1}/${mainSliderImages?.length}`}
      />
    ),
  };

  return (
    <>
      {Object.keys(selectedEvent).length > 0 &&
      Object.keys(viatorBooking).length > 0 ? (
        <div className="bg-[#1F133E] text-white items-center justify-center min-h-[100dvh]">
          <div className="customSliderNumber">
            <Slider {...settings}>
              {mainSliderImages.map((img: string) => (
                <div className="overflow-hidden w-full h-80" key={img}>
                  <img
                    src={img}
                    className="w-full h-full"
                    width={0}
                    height={0}
                    alt="hotel"
                  />
                </div>
              ))}
            </Slider>
          </div>

          <Link
            className="absolute top-8 left-5 font-bold text-white"
            href={
              router.query.startDate
                ? `/summary-details/${tripId}?startDate=${router.query.startDate}&endDate=${router.query.endDate}`
                : `/summary-details/${tripId}`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              className="w-8 h-8 text-lg md:text-2xl m-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </Link>
          <div className="p-5 pt-0">
            <p className="text-[20px] font-[700] text-start mt-2">
              {selectedEvent?.name}
            </p>
            <ReviewSummary
              rating={
                selectedEvent?.viatorProductDetails?.reviews
                  ?.combinedAverageRating || 0
              }
              count={
                selectedEvent?.viatorProductDetails?.reviews?.totalReviews || 0
              }
            />
            <div className="rounded-lg bg-white-100 p-2 mt-4">
              <div className="text-white text-sm font-light text-start ">
                <p className="inline-flex gap-1 text-lg mt-2 font-bold text-[18px]">
                  Planner description
                </p>
                <p className="mt-2 text-[16px] text-white-600">
                  {viatorBooking?.viatorProductDescription?.description ? (
                    <>
                      {plannerDescShowMore
                        ? viatorBooking?.viatorProductDescription?.description
                        : `${viatorBooking?.viatorProductDescription?.description.substring(
                            0,
                            250,
                          )}`}
                      {viatorBooking?.viatorProductDescription?.description
                        .length > 250 && (
                        <>
                          <br />
                          <button
                            className="text-[#fff] underline"
                            onClick={() =>
                              setPlannerDescSShowMore(!plannerDescShowMore)
                            }
                          >
                            {plannerDescShowMore ? 'Show less' : 'Show more'}
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <>No description added by planner</>
                  )}
                </p>
              </div>
            </div>

            {location.name &&
            location.lat &&
            location.lat !== '' &&
            location.lng &&
            location.lng !== '' ? (
              <>
                <div
                  className={`w-full h-[180px] relative rounded-t-lg google-icon-map mt-4 ${style.googleIconMap}`}
                >
                  <GoogleMapReact
                    yesIWantToUseGoogleMapApiInternals
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP}
                    defaultCenter={{
                      lat: parseFloat(location.lat),
                      lng: parseFloat(location.lng),
                    }}
                    defaultZoom={18}
                  ></GoogleMapReact>
                </div>

                <div className="rounded-b-lg bg-white-100 p-2 ">
                  <p>{location?.name}</p>
                  <p className="text-white-600">
                    {calculateDistance(
                      location.lat,
                      location.lng,
                      tripData?.tripLegs[0]?.City.latitude,
                      tripData?.tripLegs[0]?.City.longitude,
                    )}{' '}
                    miles from city center
                  </p>
                </div>
              </>
            ) : // <div className="mt-4 rounded-t-lg"></div>
            null}

            <div className="rounded-lg bg-white-100 p-2 mt-4">
              <p className="inline-flex gap-1 font-bold text-[18px]">
                Description
              </p>
              <p className="mt-2 text-[16px] text-white-600">
                {selectedEvent?.viatorProductDetails?.description}
              </p>
            </div>
            <div className="rounded-lg bg-white-100 mt-4">
              <Disclosure>
                <Disclosure.Button
                  className={`text-xl p-3 w-full ${style.hotelAccordian}`}
                >
                  {({ open }) => (
                    <div className="flex justify-between">
                      <div className="text-[18px]">Reviews</div>
                      {!open ? <FaChevronDown /> : <FaChevronUp />}
                    </div>
                  )}
                </Disclosure.Button>
                <Disclosure.Panel>
                  {reviewLoading && (
                    <div className="p-[20px]">
                      <Loader color="white" size={50} />
                    </div>
                  )}
                  {!reviewLoading &&
                    reviewsSliced.map((review: any, index: number) => {
                      return (
                        <div
                          className={
                            index === reviewsSliced.length - 1
                              ? `p-3`
                              : `border-b border-white-300 p-3`
                          }
                          key={`review` + index + review.reviewReference}
                        >
                          <div className="flex  justify-between">
                            <p className="inline-flex gap-3 items-center">
                              <ReviewSummary
                                rating={review.rating}
                                fillColor={'text-[#ffff]'}
                              />
                              <span className="text-[#FFFFFF] font-[400] opacity-[0.6]">
                                {dayjs(review.publishedDate).format(
                                  'MMM , YYYY',
                                )}
                              </span>
                            </p>
                          </div>
                          {review.title && review.title != '' && (
                            <p className="text-[16px] font-[900] text-start mt-2">
                              {review.title.length > 24
                                ? `${review.title.substring(0, 24)}...`
                                : review.title}
                            </p>
                          )}

                          {review.text != '' && (
                            <p className="text-[16px] font-[300] text-start mt-2">
                              {review.text.length > 100
                                ? `${review.text.substring(0, 100)}...`
                                : review.text}
                            </p>
                          )}
                        </div>
                      );
                    })}
                </Disclosure.Panel>
              </Disclosure>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[100dvh] flex items-center">
          <Loader color="white" size={50} />
        </div>
      )}
    </>
  );
}
