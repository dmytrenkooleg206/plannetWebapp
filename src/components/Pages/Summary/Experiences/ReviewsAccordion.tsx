import dayjs from 'dayjs';
import React from 'react';
import { Disclosure } from '@headlessui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import style from '../Hotel/HotelDetails.module.scss';
import ReviewSummary from '../Dashboard/ReviewSummary';

export default function ReviewsAccordion({ tourReviews, isLoading }: any) {
  const reviewsArr =
    tourReviews && tourReviews.length > 0 ? tourReviews.slice(0, 10) : [];
  return (
    <>
      {tourReviews && (
        <div className="mt-4 rounded-[15px]">
          <Disclosure>
            <Disclosure.Button
              className={`text-xl p-3  w-full bg-white-200 rounded-t-[15px] ${style.hotelAccordian}`}
            >
              {({ open }) => (
                <div className="flex justify-between">
                  <div className="text-lg md:text-2xl">Reviews</div>
                  {!open ? <FaChevronDown /> : <FaChevronUp />}
                </div>
              )}
            </Disclosure.Button>
            <Disclosure.Panel className="bg-white-200 rounded-b-[15px] slick-accordion">
              {reviewsArr.length > 0 ? (
                reviewsArr.map((review: any, index: number) => {
                  return (
                    <div
                      className={
                        index === reviewsArr.length - 1
                          ? `p-3`
                          : `border-b border-white-300 p-3`
                      }
                      key={`review` + index + review.reviewReference}
                    >
                      <div className="flex  justify-between   ">
                        <p className="inline-flex gap-1 items-center">
                          <ReviewSummary
                            rating={review.rating}
                            fillColor={'text-[#ffff]'}
                          />
                          <span className="text-[#FFFFFF] font-[400] opacity-[0.6]">
                            {dayjs(review.publishedDate).format('MMM , YYYY')}
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
                })
              ) : (
                <div className="border border-white- p-3 text-center">
                  No Reviews Found
                </div>
              )}
            </Disclosure.Panel>
          </Disclosure>
        </div>
      )}
    </>
  );
}