import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { getUserTrips } from '@/api/trip/trip.service';
import { useQuery } from 'react-query';
import { resetSliderPosition } from '@/service/commonService';
import TravelSlide from './TravelSlide';
import { data } from './EarnTravelCreditData';
import ItinerariesCard from './ItinerariesCard';
import styles from '../../styles/Travel.module.scss';
import NoTrips from '../Tabs/NoTrips';

function EarnTravelCarousal({ ...rest }) {
  function PrevArrow(props: any) {
    const { onClick, className } = props;
    return (
      <div
        className={
          className.includes('slick-disabled')
            ? 'bg-gray cursor-pointer rounded-full inline-flex justify-center w-10 py-2 rotate-180 absolute md:left-0 z-[100] md:top-[50%] md:translate-y-[-50%] md:translate-x-[-50%] top-[100%] right-12 mt-[10px]'
            : 'bg-white cursor-pointer rounded-full inline-flex justify-center w-10 py-2 rotate-180 absolute md:left-0 z-[100] md:top-[50%] md:translate-y-[-50%] md:translate-x-[-50%] top-[100%] right-12 mt-[10px]'
        }
        onClick={onClick}
      >
        <Image
          src="/assets/images/dashboard/double-arrow.svg"
          width={18}
          height={18}
          alt="arrow"
        />
      </div>
    );
  }

  function NextArrow(props: any) {
    const { onClick, className } = props;
    return (
      <div
        className={
          className.includes('slick-disabled')
            ? 'bg-gray cursor-pointer rounded-full inline-flex justify-center w-10 py-2 absolute z-[100] right-0 md:top-[50%] md:translate-y-[-50%] md:translate-x-[50%] top-[100%] mt-[10px]'
            : 'bg-white cursor-pointer rounded-full inline-flex justify-center w-10 py-2 absolute z-[100] right-0 md:top-[50%] md:translate-y-[-50%] md:translate-x-[50%] top-[100%] mt-[10px]'
        }
        onClick={onClick}
      >
        <Image
          src="/assets/images/dashboard/double-arrow.svg"
          width={18}
          height={18}
          alt="arrow"
        />
      </div>
    );
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  const [itinerary, setItinerary] = useState<any>();
  const [completedItinerary, setCompletedItinerary] = useState<any>();

  const {
    isLoading: isLoadingTrip,
    data: tripData,
    isError: tripError,
  } = useQuery('user-trips', () => getUserTrips());

  useEffect(() => {
    setItinerary(tripData?.Itineraries?.PendingApprovalItineraries);
    setCompletedItinerary(tripData?.Itineraries?.CompleteItineraries);
  }, [tripData]);

  return (
    <>
      <div className={`${styles.travelCredit} w-full`}>
        {(isLoadingTrip || tripData?.length <= 0) && (
          <NoTrips
            tabId={rest.tabId}
            isLoading={isLoadingTrip}
            data={tripData?.length}
          />
        )}
        {/* Slider section */}
        {rest.tabId == 'earn' && (
          <Slider {...settings}>
            {data &&
              data.Travel &&
              data.Travel.length > 0 &&
              data.Travel.map((credit: any) => (
                <TravelSlide item={credit} tabId={rest.tabId} />
              ))}
          </Slider>
        )}

        {rest.tabId == 'pending' && itinerary && itinerary.length > 0 && (
          <Slider {...settings}>
            {itinerary.map((credit: any) => (
              <ItinerariesCard
                itineraryitem={credit}
                tabId={rest.tabId}
                handleModal={rest.handleModal}
                showDownloadAppModal={rest.showDownloadAppModal}
              />
            ))}
          </Slider>
        )}

        {rest.tabId == 'completed' &&
          completedItinerary &&
          completedItinerary.length > 0 && (
            <Slider {...settings}>
              {completedItinerary &&
                completedItinerary.length > 0 &&
                completedItinerary.map((credit: any) => (
                  <ItinerariesCard
                    itineraryitem={credit}
                    tabId={rest.tabId}
                    handleModal={rest.handleModal}
                    showDownloadAppModal={rest.showDownloadAppModal}
                  />
                ))}
            </Slider>
          )}
        {/* Slider Section end */}
      </div>
      <div className="my-10"></div>
    </>
  );
}

export default EarnTravelCarousal;
