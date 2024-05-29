import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import NoTrips from '../Tabs/NoTrips';
import TripSlide from './TripSlide';
import { resetSliderPosition } from '../../service/commonService';

function TripCarousal({
  trips,
  tabId,
  isLoading,
  tripLegs,
  tripCity,
  userdata,
  tripsdata,
  handleModal,
  showDownloadAppModal,
}: any) {
  function PrevArrow(props: any) {
    const { onClick, className } = props;
    return (
      <div
        className={
          className.includes('slick-disabled')
            ? 'bg-gray cursor-pointer rounded-full inline-flex justify-center w-10 py-2 rotate-180 absolute md:left-0 z-[100] md:top-[50%] md:translate-y-[-50%] md:translate-x-[-50%] top-[110%] right-12'
            : 'bg-white cursor-pointer rounded-full inline-flex justify-center w-10 py-2 rotate-180 absolute md:left-0 z-[100] md:top-[50%] md:translate-y-[-50%] md:translate-x-[-50%] top-[110%] right-12'
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
            ? 'bg-gray cursor-pointer rounded-full inline-flex justify-center w-10 py-2 absolute z-[100] right-0 md:top-[50%] md:translate-y-[-50%] md:translate-x-[50%] top-[110%]'
            : 'bg-white cursor-pointer rounded-full inline-flex justify-center w-10 py-2 absolute z-[100] right-0 md:top-[50%] md:translate-y-[-50%] md:translate-x-[50%] top-[110%]'
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
    mobileFirst: true,
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

  useEffect(() => {
    resetSliderPosition();
    window.addEventListener('resize', () => {
      resetSliderPosition();
    });
  }, []);

  return (
    <>
      <div className="w-full">
        {(isLoading || trips?.length <= 0) && (
          <NoTrips tabId={tabId} isLoading={isLoading} data={trips} />
        )}
        {/* Slider section */}
        <Slider {...settings}>
          {trips &&
            trips.length > 0 &&
            trips.map((item: any) => (
              <TripSlide
                handleModal={handleModal}
                showDownloadAppModal={showDownloadAppModal}
                key={item.id}
                item={item}
                tabId={tabId}
                tripLegs={tripLegs}
                tripCity={tripCity}
                userdata={userdata}
                data={tripsdata}
              />
            ))}
        </Slider>
        {/* Slider Section end */}
      </div>
    </>
  );
}

export default TripCarousal;
