import Image from 'next/image';
import React from 'react';

export default function SaveCard({ isClose }:any) {
  return (
    <>
      <p className="text-start ml-7 mt-5">Select your payment method</p>
      <div className="flex space-x-4 w-full  mt-5 text-center items-center justify-center">
        <div
          className="w-1/3 flex p-5 items-center justify-center  text-center bg-[#352B51] rounded-[15px] w-[102px] h-[64px]"
          onClick={() => isClose()}
        >
          <Image
            className="mr-2 "
            alt=""
            width={50}
            height={34}
            src="/assets/images/summary/add_icon.svg"
          />
        </div>
        <div className="w-1/3 p-5 flex items-center justify-center text-center bg-[#352B51] rounded-[15px] w-[102px] h-[64px]">
          <Image
            className="mr-2"
            alt=""
            width={50}
            height={34}
            src="/assets/images/summary/Apple Pay Mark.svg"
          />
        </div>
        <div className=" w-1/3 p-5 flex  items-center justify-center text-center bg-[#352B51] rounded-[15px] w-[102px] h-[64px]">
          <Image
            className="mr-2"
            alt=""
            width={50}
            height={34}
            src="/assets/images/summary/visa.svg"
          />
        </div>
      </div>
      <div className="flex w-full justify-evenly mt-1 text-start">
        <p className="text-[16px]">+ ADD</p>
        <p className="text-[16px]">Apple Pay</p>
        <p className="text-[16px]">....4242</p>
      </div>
    </>
  );
}
