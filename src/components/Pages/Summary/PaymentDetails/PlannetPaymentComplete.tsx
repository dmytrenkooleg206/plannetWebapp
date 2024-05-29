import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function PlannetPaymentComplete({
  isComplete,
  cityName,
  backToHome,
}: any) {
  if (!isComplete) return null;
  return (
    <>
      <div className="min-h-[100dvh] bg-[#1F133E] text-white text-center overflow-hidden">
        <h1 className="text-[35px] font-bold mt-[12vh]">Congratulations!</h1>
        <p className="text-[20px]">
          You are going to <br /> {cityName}
        </p>
        <Image
          className="mx-auto my-8"
          alt=""
          width={200}
          height={200}
          src="/assets/images/summary/party-popper 1.svg"
        />
        <div>
          <div className="flex flex-col items-center justify-center mt-4">
            <p className="text-2xl font-bold">Download the Plannet App</p>
            <p className="text-xl font-light mb-3">
              to view your trip bookings
            </p>
            <Link href={`${process.env.NEXT_PUBLIC_APP_STORE}`} target="blank">
              <Image
                width={400}
                height={400}
                className="max-w-[190px] w-full h-full pr-2"
                src="/assets/images/landingpage/app_store.webp"
                alt="app store"
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
