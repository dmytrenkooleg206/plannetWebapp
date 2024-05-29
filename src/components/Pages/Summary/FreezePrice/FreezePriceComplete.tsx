import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const completeTitles = [
  'Sorry! You cannot freeze the prices',
  'Congratulations!',
];

export default function FreezePriceComplete({ isComplete, backHome }: any) {
  return (
    <>
      <div className="bg-[#1F133E] text-white min-h-[100dvh]">
        <div className="bg-white text-center item-center justify-center p-5 border-0 md:p-2">
          {isComplete ? (
            <div className="mt-10 md:mt-5 py-8 w-full">
              <Image
                className="mx-auto"
                alt=""
                width={136}
                height={136}
                src="/assets/images/summary/freeze_icon.svg"
              />
              <h1 className="text-[#7440F5] text-[32px] font-[900] leading-[29.91px] mt-4">
                {completeTitles[1]}
              </h1>
              <p className="text-[gray] text-[20px] font-[400] mt-4 ">
                You just froze the prices for your trip,
                <span className="font-bold inline-block">
                  you can book later.
                </span>
              </p>
            </div>
          ) : (
            <>
              <div className="flex">
                <Link href="#" onClick={() => backHome()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="black"
                    className="w-8 h-8 text-lg md:text-2xl m-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </Link>
              </div>
              <div className="mt-16 py-8">
                <Image
                  className="mx-auto"
                  alt=""
                  width={136}
                  height={136}
                  src="/assets/images/summary/notFreeze.svg"
                />
                <h1 className="text-[#7440F5] text-[32px] font-[900] leading-[29.91px] mt-4">
                  {completeTitles[0]}
                </h1>
                <p className="text-[gray] text-[18px] font-[400] mt-4">
                  You cannot freeze the prices on this trip because there is
                  less than 14 days left before departure.
                </p>
              </div>
            </>
          )}
        </div>
        <div className="mt-[-1px] w-full 
        bg-[url('/assets/images/summary/Vector.svg')] 
        pt-10 bg-no-repeat bg-cover bg-bottom p-7 border-0 md:p-[3.4rem]"></div>
        {isComplete && (
          <div>
            <div className="flex flex-col items-center justify-center mt-4">
              <p className="text-xl leading-5 font-bold">
                Download the Plannet App
              </p>
              <p className="text-lg font-light mb-3">
                to view your frozen trip
              </p>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_STORE}`}
                target="blank"
              >
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
        )}
      </div>
    </>
  );
}
