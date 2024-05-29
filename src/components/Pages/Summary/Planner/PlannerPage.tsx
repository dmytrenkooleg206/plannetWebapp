import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';

type PlannerPageProps = {
  tripData: any;
};

export default function PlannerDetailPage({ tripData }: PlannerPageProps) {
  const router = useRouter();
  const backToHome = () => {
    if (router.query.startDate) {
      router.push(
        `/summary-details/${router.query.id}?startDate=${router.query.startDate}&endDate=${router.query.endDate}`,
      );
    } else {
      router.push(`/summary-details/${router.query.id}`);
    }
  };

  return (
    <div className="bg-[#1F133E] text-white text-center">
      <div className="relative min-h-[100dvh] p-4">
        <div className="flex justify-between">
          <button onClick={backToHome} className="w-[30px]">
            <IoIosArrowBack className="text-[180%]" />
          </button>
          <p className="h-98px border-0">
            <span className="font-medium text-[24px] font-['Larsseit']">
              {`${tripData?.planner?.firstName} ${tripData?.planner?.lastName}`}
            </span>
          </p>
          <p className="w-[30px]"></p>
        </div>
        <Image
          className="mx-auto rounded-[15px] mt-8 border border-2 border-white"
          alt="profile"
          width={160}
          height={160}
          src={
            tripData?.planner?.profilePictureUrl_CF ||
            '/assets/images/summary/planner-plchldr.png'
          }
        />

        <p className="text-left mt-8 text-[16px] leading-5 text-medium font-['Larsseit']">
          {tripData?.trip?.description}
        </p>
      </div>
    </div>
  );
}
