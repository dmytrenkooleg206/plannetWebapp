import Image from 'next/image';
import React from 'react';
import { BsCircle, BsCircleFill, BsCircleHalf } from 'react-icons/bs';

export default function ReviewSummary({
  rating,
  count,
  fillColor = 'text-[#2CA251]',
}: any) {

  const GetStars = () => {
    if (rating >= 1 && rating < 1.5)
      return (
        <>
          <BsCircleFill className={fillColor} />
          <BsCircle className={fillColor} />
          <BsCircle className={fillColor} />
          <BsCircle className={fillColor} />
          <BsCircle className={fillColor} />
        </>
      );
    else if (rating >= 1.5 && rating < 2)
      return (
        <>
          <BsCircleFill className={fillColor} />
          <BsCircleHalf className={fillColor} />
          <BsCircle className={fillColor} />
          <BsCircle className={fillColor} />
          <BsCircle className={fillColor} />
        </>
      );
    else if (rating >= 2 && rating < 2.5)
      return (
        <>
          <BsCircleFill className={fillColor} />
          <BsCircleFill className={fillColor} />
          <BsCircle className={fillColor} />
          <BsCircle className={fillColor} />
          <BsCircle className={fillColor} />
        </>
      );
    else if (rating >= 2.5 && rating < 3)
      return (
        <>
          <BsCircleFill className={fillColor} />
          <BsCircleFill className={fillColor} />
          <BsCircleHalf className={fillColor} />
          <BsCircle className={fillColor} />
          <BsCircle className={fillColor} />
        </>
      );
    else if (rating >= 3 && rating < 3.5)
      return (
        <>
          <BsCircleFill className={fillColor} />
          <BsCircleFill className={fillColor} />
          <BsCircleFill className={fillColor} />
          <BsCircle className={fillColor} />
          <BsCircle className={fillColor} />
        </>
      );
    else if (rating >= 3.5 && rating < 4)
      return (
        <>
          <BsCircleFill className={fillColor} />
          <BsCircleFill className={fillColor} />
          <BsCircleFill className={fillColor} />
          <BsCircleHalf className={fillColor} />
          <BsCircle className={fillColor} />
        </>
      );
    else if (rating >= 4 && rating < 4.5)
      return (
        <>
          <BsCircleFill className={fillColor} />
          <BsCircleFill className={fillColor} />
          <BsCircleFill className={fillColor} />
          <BsCircleFill className={fillColor} />
          <BsCircle className={fillColor} />
        </>
      );
    else if (rating >= 4.5 && rating < 5)
      return (
        <>
          <BsCircleFill className={fillColor} />
          <BsCircleFill className={fillColor} />
          <BsCircleFill className={fillColor} />
          <BsCircleFill className={fillColor} />
          <BsCircleHalf className={fillColor} />
        </>
      );
    else if (rating >= 4.75)
      return (
        <>
          <BsCircleFill className={fillColor} />
          <BsCircleFill className={fillColor} />
          <BsCircleFill className={fillColor} />
          <BsCircleFill className={fillColor} />
          <BsCircleFill className={fillColor} />
        </>
      );
    else
      return (
        <>
          <BsCircle className={fillColor} />
          <BsCircle className={fillColor} />
          <BsCircle className={fillColor} />
          <BsCircle className={fillColor} />
          <BsCircle className={fillColor} />
        </>
      );
  };
  return (
    <p className="inline-flex gap-1 items-center">
      <Image
        src="/assets/images/summary/TripAdvisor.svg"
        width={30}
        height={20}
        alt="trip advisor"
      />
      <GetStars />
      {count && (
        <span className="text-[#FFFFFF] font-[400] opacity-[0.6]">
          ({count || 0} reviews)
        </span>
      )}
    </p>
  );
}
