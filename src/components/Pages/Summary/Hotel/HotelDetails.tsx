import Link from 'next/link';
import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import GoogleMapReact from 'google-maps-react-markers';
import { getGuestPlannetHotels, getTripById } from '@/api/trip/trip.service';
import { QUERY_OPTION } from '@/lib/constants';
import { tripadvisorReviews } from '@/api/beHotel/beHotel.service';
import Slider from 'react-slick';
import { useRouter } from 'next/router';
import Loader from '@/components/Loader/Loader';
import style from './HotelDetails.module.scss';
import ReviewSummary from '../Dashboard/ReviewSummary';
import HotelAccordians from './HotelAccordians';
import HotelAmenities from './HotelAmenities';
import HotelPolicies from './HotelPolicies';
import ImportantInformation from './ImportantInformation';
import { calculateDistance } from '@/lib/utils';

export default function HotelDetails({ tripId, hotelId }: any) {
  const router = useRouter();
  const [plannetHotelDetails, setPlannetHotelDetails] = React.useState<any>({});
  const [plannerDescShowMore, setPlannerDescSShowMore] =
    React.useState<boolean>(false);
  const queryClient = useQueryClient();

  const { isLoading, data: tripData } = useQuery(
    ['trip_details'],
    () => getTripById(tripId),
    QUERY_OPTION,
  );

  let selectedEvent: any;
  let hotelData: any;
  let hotelDataFromEvent: any;
  let hotelBooking: any;

  const categoryColorCode: any = {
    LUX: '#F3AA60',
    HIP: '#EF6262',
    SOLID: '#468B97',
  };

  const { isLoading: isReviewsLoading, data: reviewsData } = useQuery(
    ['trip_advisor_reviews'],
    () =>
      tripadvisorReviews({
        longitude: hotelData?.hotel?.longitude,
        latitude: hotelData?.hotel?.latitude,
        hotelName: hotelData?.hotel?.hotelName,
        plannetHotelId: hotelData?.hotel?.id,
        tripAdvisorLocationId: null,
      }),
    { ...QUERY_OPTION, enabled: tripData ? true : false },
  );

  const loadHotelsAnemities = async (plannetHotelId: string) => {
    const isCacheDataFound = queryClient.getQueryData(
      `hotels_anemities_${plannetHotelId}`,
    );

    if (isCacheDataFound && Object.keys(isCacheDataFound).length > 0) {
      setPlannetHotelDetails(isCacheDataFound);
    } else {
      const plannetHotel = await getGuestPlannetHotels(plannetHotelId);
      if (plannetHotel && Object.keys(plannetHotel).length > 0) {
        setPlannetHotelDetails(plannetHotel);
        queryClient.setQueryData(
          [`hotels_anemities_${plannetHotelId}`],
          plannetHotel,
        );
      }
    }
  };

  useEffect(() => {
    if (tripData && tripData.hotelBookings) {
      hotelData = tripData.hotelBookings.find((ht: any) => ht.id === hotelId);
      if (hotelData && Object.hasOwn(hotelData, 'id')) {
        loadHotelsAnemities(hotelData.PlannetHotelId);
      }
    }
  }, [tripData]);

  if (tripData && !tripData.itineraryEvents) {
    router.push('/');
    return null;
  }

  if (tripData) {
    selectedEvent = tripData?.itineraryEvents?.find(
      (eve: any) => eve.HotelBookingId === hotelId,
    );

    hotelDataFromEvent = JSON.parse(selectedEvent.hotelObj);
    hotelBooking = tripData.hotelBookings.find((ht: any) => ht.id === hotelId);
    hotelData = hotelBooking.hotelObj;
  }

  const settings = {
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      {isLoading ? (
        <div className="h-screen flex my-auto bg-[#1F133E] text-white">
          <Loader color="white" size={50} />
        </div>
      ) : (
        <div className="w-full bg-[#1F133E] text-white items-center justify-center min-h-[100dvh]">
          <Slider {...settings}>
            <div className="overflow-hidden w-full h-80">
              <img
                src={hotelData?.hotel?.image}
                className="w-full h-full"
                width={0}
                height={0}
                alt="hotel"
              />
            </div>
          </Slider>
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
            {hotelBooking?.PlannetHotel?.category &&
              hotelBooking?.PlannetHotel?.category != '' && (
                <p>
                  <span
                    className={`inline-flex items-center rounded-md text-[#fff] px-2 py-1 text-[14px] font-medium`}
                    style={{
                      backgroundColor: categoryColorCode[
                        hotelBooking?.PlannetHotel?.category
                      ]
                        ? categoryColorCode[
                            hotelBooking?.PlannetHotel?.category
                          ]
                        : '#000',
                    }}
                  >
                    {hotelBooking?.PlannetHotel?.category}
                  </span>
                </p>
              )}

            <p className="text-[20px] font-[700] text-start mt-2">
              {hotelData?.hotel.hotelName}
            </p>
            <ReviewSummary
              rating={reviewsData?.tripadvisorHotelDetail?.tripAdvisorRating}
              count={
                reviewsData?.tripadvisorHotelDetail?.tripAdvisorReviewCount
              }
            />
          </div>

          <div className=" p-5 pt-0  item-center justify-center  border-0">
            <div className="rounded-lg bg-white-100 p-2">
              <div className="text-white text-sm font-[400] text-start ">
                <p className="inline-flex gap-1 text-lg mt-2">
                  Planner description
                </p>
                {hotelBooking?.plannetHotelDescription?.description ? (
                  <p className="mt-2 text-[16px] text-white-600">
                    {plannerDescShowMore
                      ? hotelBooking?.plannetHotelDescription?.description
                      : `${hotelBooking?.plannetHotelDescription?.description.substring(
                          0,
                          250,
                        )}`}
                    {hotelBooking?.plannetHotelDescription?.description.length >
                      250 && (
                      <>
                        <br />
                        <button
                          className="text-[#fff] underline mt-2"
                          onClick={() =>
                            setPlannerDescSShowMore(!plannerDescShowMore)
                          }
                        >
                          {plannerDescShowMore ? 'Show less' : 'Show more'}
                        </button>
                      </>
                    )}
                  </p>
                ) : (
                  <div className="text-white-600 mt-2">
                    No description added by planner
                  </div>
                )}
              </div>
            </div>

            <div
              className={`w-full mt-4 h-[180px] relative rounded-t-lg google-icon-map ${style.googleIconMap}`}
            >
              <GoogleMapReact
                yesIWantToUseGoogleMapApiInternals
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP}
                defaultCenter={{
                  lat: parseFloat(hotelBooking?.PlannetHotel?.latitude),
                  lng: parseFloat(hotelBooking?.PlannetHotel?.longitude),
                }}
                defaultZoom={18}
              ></GoogleMapReact>
            </div>
            <div className="rounded-b-lg bg-white-100 p-2 font-[400]">
              <p>
                {hotelBooking?.PlannetHotel?.address.line},{' '}
                {hotelBooking?.PlannetHotel?.address.city}
              </p>
              {hotelBooking?.PlannetHotel?.distance ? (
                <p className="text-white-600">
                  {hotelBooking?.PlannetHotel?.distance} miles from city center
                </p>
              ) : (
                <p className="text-white-600">
                  {calculateDistance(
                    hotelBooking?.PlannetHotel?.latitude,
                    hotelBooking?.PlannetHotel?.longitude,
                    tripData?.tripLegs[0]?.City.latitude,
                    tripData?.tripLegs[0]?.City.longitude,
                  )}{' '}
                  miles from city center
                </p>
              )}
            </div>
            <div className="rounded-lg bg-white-100 p-2 mt-4 ">
              <div className="text-white text-sm font-light text-start ">
                <p className="inline-flex gap-1 text-lg mt-2 font-bold ">
                  Details
                </p>
                <p className="mt-2 text-[16px] text-white-600">
                  {hotelDataFromEvent?.hotel.hotelDescription}
                </p>
              </div>
            </div>
            <HotelAmenities amenities={plannetHotelDetails} />
            <div className="mt-4 w-full">
              <div className="relative">
                {/* Accordians */}
                <HotelAccordians
                  hotelData={hotelData}
                  itiEve={selectedEvent}
                  reviews={reviewsData || {}}
                />
                {/* Accordians end */}
              </div>
            </div>
            <HotelPolicies policies={plannetHotelDetails} />
            <ImportantInformation information={plannetHotelDetails} />
            {/* <div className="mt-10 mb-2">
              <button className="w-full p-3 rounded-lg flex text-center items-center justify-center">
                <p className="text-[20px] underline">Delete from Itinerary</p>
              </button>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
}
