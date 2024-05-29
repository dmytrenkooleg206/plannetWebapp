/* eslint-disable eqeqeq */
import SplashScreen from '@/components/SplashScreen/SplashScreen';
import useImagePreloader from '@/hooks/useImagesPreloader';
import { analyticsEvents } from '@/lib/analytics';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

type LoadingScreenProps = {
  tripData: any;
};

export default function LoadingScreen({ tripData }: LoadingScreenProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { imagesPreloaded } = useImagePreloader([
    tripData.planner.profilePictureUrl_CF ||
      '/assets/images/summary/planner-plchldr.png',
  ]);

  const redirectToSummaryDetails = () => {
    analyticsEvents('VIEW_SUMMARY_PAGE');
    router.push(`/summary-details/${router.query.id}`);
  };

  if (!imagesPreloaded) return <SplashScreen color="#fff" size={50} />;

  return (
    <div className="bg-[#1F133E] text-white text-center min-h-[100dvh] flex flex-col justify-between py-8">
      <div className="grow flex items-center p-4">
        <div className="w-full">
          <p className="text-[24px] font-normal">
            Your trip to <br />
            <span className="font-extrabold text-[40px] leading-[40px]">
              {tripData?.tripLegs[0]?.City?.name}
              {tripData?.tripLegs[0]?.City?.country != ''
                ? `, ${tripData?.tripLegs[0]?.City?.country}`
                : ''}
            </span>
          </p>
          <div className="imgeContainer">
            <img
              className="mx-auto rounded-[15px] mt-6 border border-4 border-white"
              alt=""
              width={220}
              height={220}
              src={
                tripData.planner.profilePictureUrl_CF ||
                '/assets/images/summary/planner-plchldr.png'
              }
            />
          </div>
          <p className="mt-6 text-[18px] font-[400]">
            <span className="font-extrabold text-[40px] leading-[40px]">
              {`${tripData.planner.firstName} ${tripData.planner.lastName}`}
            </span>
            <br />
            has planned and verified your trip
          </p>
        </div>
      </div>
      <div className="w-full px-4">
        <Link
          onClick={redirectToSummaryDetails}
          href="#!"
          className=" block bg-[#FFFFFF] text-[#1F133E] py-3 w-full font-bold text-[20px] rounded-lg"
        >
          Continue
        </Link>
      </div>
    </div>
  );
}
