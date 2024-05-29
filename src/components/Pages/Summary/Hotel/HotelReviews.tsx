import { getFormattedDate, getFormattedDateYM } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
import { BsCircleFill, BsCircleHalf } from 'react-icons/bs';

export default function HotelReviews({ reviews }: any) {
  return (
    <>
      {reviews && reviews.reviews && reviews.reviews.length > 0 ? (
        reviews?.reviews.map((review: any) => (
          <div className="border-b border-white- p-3" key={review.id}>
            <div className="flex  justify-between   ">
              <p className="inline-flex gap-1 items-center">
                <Image
                  src="/assets/images/summary/TripAdvisor.svg"
                  width={30}
                  height={20}
                  alt="trip advisor"
                />
                <img src={review.rating_image_url} alt="" />
                <span className="text-[#FFFFFF] font-[400] opacity-[0.6]">
                  {getFormattedDateYM(review.published_date)}
                </span>
              </p>
            </div>
            <p className="text-[16px] font-[700] text-start mt-2">
              {review.title}
            </p>
            <p className="text-[16px] font-[400] text-start mt-2 text-white-600">
              {review.text}
            </p>
          </div>
        ))
      ) : (
        <div className="p-3 text-white-600">No Review Founds</div>
      )}
    </>
  );
}
