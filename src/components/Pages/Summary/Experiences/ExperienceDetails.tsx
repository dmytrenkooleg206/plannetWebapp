import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import { useRouter } from 'next/router';
import { getTripById } from '@/api/trip/trip.service';
import { QUERY_OPTION } from '@/lib/constants';
import { useQuery } from 'react-query';
import { resetSliderPosition } from '@/service/commonService';
import Loader from '@/components/Loader/Loader';
import style from '../Hotel/HotelDetails.module.scss';
import CustomDots from '../CustomDots';
import ExperienceSlider from './ExperienceSlider';

export default function ExperienceDetails() {
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState<any>(1);
  const [tripId, setTripId] = useState<any>('');
  const [experiences, setExperiences] = useState<any>([]);
  const [sliderSettings, setSliderSettings] = useState<any>({});
  const [isLoading, setisLoading] = useState<any>(true);
  const SliderRef = useRef<any>(null);
  /**
   * Metgod to dispaly previous Arrow
   * @param props
   * @returns
   */
  function PrevArrow(props: any) {
    const { onClick, className } = props;
    return (
      <div
        className={
          className.includes('slick-disabled')
            ? ' md:bottom-[-74px] slick-dots-arrow bg-white-300 cursor-pointer rounded-full inline-flex justify-center w-8 py-1  absolute md:right-[65%] md:translate-y-[-50%] md:translate-x-[-50%] bottom-[-60px] right-[65%]'
            : ' md:bottom-[-74px] slick-dots-arrow bg-[#7440F5] cursor-pointer rounded-full inline-flex justify-center w-8 py-1  absolute md:right-[65%] md:translate-y-[-50%] md:translate-x-[-50%] bottom-[-60px] right-[65%]'
        }
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="white"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </div>
    );
  }

  /**
   * Method to display next arrow
   * @param props
   * @returns
   */
  function NextArrow(props: any) {
    const { onClick, className } = props;
    return (
      <div
        className={
          className.includes('slick-disabled')
            ? ' md:bottom-[-74px] slick-dots-arrow bg-white-300 cursor-pointer rounded-full inline-flex justify-center w-8 py-1 absolute  right-0 md:left-[65%] md:translate-y-[-50%] md:translate-x-[50%] bottom-[-60px] left-[65%]'
            : ' md:bottom-[-74px] slick-dots-arrow bg-[#7440F5] cursor-pointer rounded-full inline-flex justify-center w-8 py-1 absolute  right-0 md:left-[65%] md:translate-y-[-50%] md:translate-x-[50%] bottom-[-60px] left-[65%]'
        }
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="white"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
    );
  }

  useEffect(() => {
    const dots: any = document.querySelectorAll(
      '.slider-container .slick-dots',
    );
    dots.forEach((dot: any, index: number) => {
      if (dot.style.display != 'block') {
        dot.classList.add('slickDots');
        dot.classList.remove('slick-dots');
      }
    });
  }, [experiences]);

  useEffect(() => {
    if (router.query.id) {
      setTripId(router.query.id);
    }
  }, [router]);

  const { data: tripData } = useQuery(
    ['trip_details'],
    () => getTripById(tripId),
    { ...QUERY_OPTION, enabled: !tripId ? false : true },
  );

  useEffect(() => {
    if (tripData) {
      if (tripData.itineraryEvents && tripData.itineraryEvents.length > 0) {
        const extractChildObject = tripData.itineraryEvents.filter(
          (item: any) => item.type === 'EVENT',
        );
        setExperiences(extractChildObject);
        setisLoading(false);
      }
    }
  }, [tripData]);

  useEffect(() => {
    const Settings = {
      infinite: false,
      speed: 800,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoPlay: true,
      dots: true,
      appendDots: (dots: any) => (
        <div className="slickDots">
          <ul style={{ margin: '0px' }}> {dots} </ul>
        </div>
      ),
      customPaging: (i: number) => (
        <CustomDots active={`${i + 1}/${experiences?.length}`} />
      ),
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      beforeChange: (oldIndex: any, newIndex: any) => {
        if (oldIndex < newIndex) {
          setCurrentSlideIndex(currentSlideIndex + 1);
        } else {
          setCurrentSlideIndex(currentSlideIndex - 1);
        }
      },
      responsive: [
        {
          breakpoint: 776,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };
    setSliderSettings(Settings);
  }, [experiences]);

  if (tripData && !tripData.itineraryEvents) {
    router.push('/');
    return null;
  }
  return (
    <>
      {isLoading ? (
        <div className="h-screen flex my-auto bg-[#1F133E] text-white">
          <Loader color="white" size={50} />
        </div>
      ) : (
        <div
          className={`w-full bg-[#1F133E] text-white items-center justify-center  ${style.hotel}`}
        >
          <div className="text-center p-5 item-center justify-center  border-0 ">
            <div className="flex ">
              <Link
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
              <p className="text-[24px] font-bold">Experiences</p>
            </div>
            {/* Slider */}
            <div className="slider-container">
              <Slider {...sliderSettings} ref={SliderRef}>
                {experiences &&
                  experiences.length > 0 &&
                  experiences.map((expItem: any, index: any) => {
                    return (
                      <ExperienceSlider
                        key={expItem.id}
                        item={index + 1}
                        data={expItem}
                        itemKey={expItem.id}
                      />
                    );
                  })}
              </Slider>
            </div>
            {/* Slider ends */}
          </div>
        </div>
      )}
    </>
  );
}