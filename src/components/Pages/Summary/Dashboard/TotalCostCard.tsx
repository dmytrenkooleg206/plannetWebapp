import Loader from '@/components/Loader/Loader';
import Image from 'next/image';
import React from 'react';
import Slider from 'react-slick';
import CustomDots from '../CustomDots';

export default function TotalCostCard({
  sliderImages,
  isPriceFound,
  totalCost,
  isPriceVisible,
  ...rest
}: any) {
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
        active={`${i + 1}/${sliderImages?.length}`}
      />
    ),
  };

  return (
    <div {...rest}>
      <div className="rounded customSliderNumber">
        <Slider {...settings}>
          {sliderImages.map((img: string, i: number) => (
            <div key={i} className="overflow-hidden w-full h-96">
              <img
                src={img}
                className="w-full h-full rounded object-cover"
                width={100}
                height={100}
                alt="hotel"
              />
            </div>
          ))}
        </Slider>

        {/* {isPriceVisible && (
          <div className="rounded-b bg-white-300 flex p-1.5 justify-between mt-[-8px]">
            <p className="font-[700] text-[22px]">Total Cost</p>

            {isPriceFound ? (
              <p className="font-[700] text-[22px]">
                {/* <span className="text-[16px] font-light line-through">
                  ${(totalCost + (totalCost * 10) / 100).toFixed(2)}
                </span>{' '} 
                ${totalCost.toFixed(2) || 0}
              </p>
            ) : (
              <div className="inline-flex gap-2">
                <Loader color="#fff" />
              </div>
            )}
          </div>
        )} */}
      </div>
    </div>
  );
}
