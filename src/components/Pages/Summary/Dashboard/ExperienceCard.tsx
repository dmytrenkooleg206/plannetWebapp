import Image from 'next/image';
import { useRouter } from 'next/router';
import Loader from '@/components/Loader/Loader';
import React from 'react';
export default function ExperienceCard({
  expTotal,
  expDiscount,
  selectedProducts,
  isLoading,
  isOpen,
  isPriceVisible,
  tripId,
  isPriceFound,
  avgPrice,
  ...rest
}: any) {
  const router = useRouter();

  const getImage = (viatorDetails: any) => {
    if (
      viatorDetails &&
      viatorDetails.images &&
      viatorDetails.images.length > 0
    ) {
      const maxwidth = viatorDetails.images[0].variants.filter(
        (vr: any) => vr.width >= 720,
      );

      if (maxwidth.length > 0) {
        return maxwidth[0].url;
      }

      return '/assets/images/no-images.png';
    }
    return '/assets/images/no-images.png';
  };

  const redirectToExperience = (e: any, expId: string | number) => {
    e.preventDefault();
    router.push(
      router.query.startDate
        ? `/summary-details/experience/${router.query.id}/${expId}?startDate=${router.query.startDate}&endDate=${router.query.endDate}`
        : `/summary-details/experience/${router.query.id}/${expId}`,
    );
  };

  return (
    <div {...rest}>
      {!Object.keys(selectedProducts).length && isLoading ? (
        <div className="rounded bg-white-100 p-2">
          <div className="flex justify-between">
            <div className="inline-flex gap-2">
              <Image
                src="/assets/images/dashboard/itinerary.svg"
                width={30}
                height={30}
                alt="hotel"
              />
              Adding Experience
            </div>
            <svg
              aria-hidden="true"
              className="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="gray"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        </div>
      ) : (
        <div className="rounded bg-white-100 p-2 relative">
          <div className="flex justify-between items-center ">
            <div className="inline-flex gap-2 items-center">
              <Image
                src="/assets/images/dashboard/itinerary.svg"
                width={30}
                height={30}
                alt="hotel"
                priority={true}
              />
              <span className="font-bold text-[24px] leading-[22px]">
                Experience({selectedProducts.length})
              </span>
            </div>
            {isPriceVisible ? (
              isPriceFound ? (
                <p className="font-bold text-right leading-3">
                  <span className="text-2xl font-bold">
                    {`$` + Math.round(Number(avgPrice) / 100)}
                  </span>
                  <br />
                  <span className="font-light ">avg/exp.</span>
                </p>
              ) : (
                <div className="inline-flex gap-2">
                  <Loader color="#fff" />
                </div>
              )
            ) : (
              ''
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="inline-flex gap-2 flex-col w-[100%]">
              {selectedProducts.map((product: any) => (
                <div className="flex gap-2" key={product.id}>
                  <div
                    className="flex gap-2 h-[80px] w-[80px]"
                    key={product.id}
                  >
                    <img
                      src={getImage(product.viatorProductDetails)}
                      className="rounded"
                      width={80}
                      height={80}
                      alt=""
                    />
                  </div>
                  <div className="sideExperienceContent gap-1 w-3/4 text-sm">
                    <p className="truncate text-[18px] font-bold">
                      {product.name ? product.name : ''}
                    </p>
                    <p className="breakExpDescription text-[16px] font-normal leading-5 mt-[2px]">
                      {product?.viatorProductDetails?.description
                        ? product?.viatorProductDetails?.description
                        : ''}
                    </p>
                    {/* <ReviewSummary
                      rating={
                        product.viatorProductDetails.reviews
                          .combinedAverageRating || 0
                      }
                      count={
                        product.viatorProductDetails.reviews.totalReviews || 0
                      }
                    /> */}
                    <a
                      href="!#"
                      className="selectHotel  text-[16px] font-normal leading-5"
                      onClick={(e) =>
                        redirectToExperience(e, product?.ViatorBookingId)
                      }
                    >
                      See More
                    </a>
                  </div>
                </div>
              ))}
            </div>
            {/* {isPriceVisible && selectedProducts.length > 0 && (
              <RightButton
                isOpen={() => isOpen()}
                url={
                  router.query.startDate
                    ? `/summary-details/experience/${tripId}?startDate=${router.query.startDate}&endDate=${router.query.endDate}`
                    : `/summary/experience/${tripId}`
                }
              />
            )} */}
          </div>
        </div>
      )}
    </div>
  );
}
