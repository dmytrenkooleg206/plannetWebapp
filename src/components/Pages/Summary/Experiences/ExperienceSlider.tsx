import { getTourReviews } from '@/api/beHotel/beTour/beTour.service';
import { QUERY_OPTION } from '@/lib/constants';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import ReviewSummary from '../Dashboard/ReviewSummary';
import HotelViewSlider from '../Hotel/HotelViewSlider';
import ExperienceCounter from './ExperienceCounter';
import ReviewsAccordion from './ReviewsAccordion';

export default function ExperienceSlider({ item, data, itemKey }: any) {
  const [isLoading, setisLoading] = useState<any>(true);
  const [tourReviews, setTourReviews] = useState<any>([]);
  const [payload, setPayload] = useState<any>({
    productCode: '',
    sortBy: 'MOST_RECENT',
  });
  let productImage = [];

  const maxwidth = data.viatorProductDetails.images[0].variants.filter(
    (vr: any) => vr.width >= 720,
  );

  productImage.push(maxwidth[0].url);

  useEffect(() => {
    setPayload((prev: any) => {
      return { ...prev, productCode: data.viatorProductDetails.productCode };
    });
  }, []);

  const { data: reviewData } = useQuery(
    ['tour_reviews', itemKey],
    () => getTourReviews(payload),
    { ...QUERY_OPTION, enabled: payload.productCode ? true : false },
  );

  useEffect(() => {
    if (reviewData && reviewData.reviews && reviewData.reviews.length > 0) {
      setTourReviews(reviewData.reviews);
      setisLoading(false);
    }
  }, [reviewData]);

  return (
    <>
      {data && (
        <div className="mt-4 w-full px-1 main-Slider" key={itemKey}>
          <div className="flex justify-between rounded-t-[15px] bg-white-200 p-3">
            <div className="inline-flex gap-2">
              <Image
                src="/assets/images/dashboard/itinerary.svg"
                width={32}
                height={32}
                alt="hotel"
              />
              <span className="text-[24px] font-[700]">Experience {item}</span>
            </div>
          </div>
          <div className="childSlider">
            <div className="relative">
              <div className="bg-black-600 rounded absolute top-2 right-2 z-10 px-2 text-sm py-1">
                <ReviewSummary
                  rating={
                    data.viatorProductDetails.reviews.combinedAverageRating || 0
                  }
                  count={data.viatorProductDetails.reviews.totalReviews || 0}
                />
              </div>
              {/* Slider */}
              <HotelViewSlider page="experience" image={productImage} />
              {/* Slider ends */}
              <div className="rounded-b-[15px] bg-white-200 p-2">
                <div className="flex  justify-between">
                  <span className="text-[20px] text-start font-[500]">
                    {' '}
                    {/* {data.name.length > 30
                    ? `${data.name.substring(0, 20)}...`
                    : data.name} */}
                    {data.name}
                  </span>
                  {/* <span className="text-[16px] font-[300]">3 hours</span> */}
                </div>
                <p className="text-[16px] font-[300] text-start mt-1">
                  {/* {data.viatorProductDetails &&
                data.viatorProductDetails.description.length > 40
                  ? `${data.viatorProductDetails.description.substring(
                      0,
                      40,
                    )}...`
                  : data.viatorProductDetails.description} */}
                  {data.viatorProductDetails
                    ? data.viatorProductDetails.description
                    : ''}
                </p>
              </div>
              {/* <ExperienceCounter /> */}
              {/* Accordians */}
              <ReviewsAccordion
                tourReviews={tourReviews}
                isLoading={isLoading}
              />
              {/* Accordians end */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}