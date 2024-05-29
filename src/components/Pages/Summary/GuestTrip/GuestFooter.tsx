import React from 'react';
import { FaHeart, FaRegCalendarAlt, FaRegHeart } from 'react-icons/fa';
import { FiShare } from 'react-icons/fi';
import { useRouter } from 'next/router';
import style from '../Summary.module.scss';

export default function GuestFooter({
  share,
  cliclPlannet,
  saveForLater,
  isFavourite,
  addTravelDates,
}: any) {
  const router = useRouter();
  let urlParameter = router.query.id;
  if (
    router.query.startDate !== undefined &&
    router.query.endDate !== undefined
  ) {
    urlParameter = `${urlParameter}?startDate=${router.query.startDate}&endDate=${router.query.endDate}`;
  }

  return (
    <>
      <div
        className={`flex justify-around py-4 fixed max-w-[500px] bottom-0  w-full bg-[#1F133E] ${style.box_overlay}`}
      >
        <button
          className={`w-1/3 inline-flex flex-col items-center text-[16px] font-[500]`}
          onClick={saveForLater}
        >
          <span
            className={`w-16 h-16 text-[#1F133E] rounded-full flex justify-center items-center text-3xl
              ${isFavourite ? 'text-[#7440F5] bg-[#fff]' : ' bg-white'}`}
          >
            {isFavourite ? <FaHeart /> : <FaRegHeart />}
          </span>
          Save For Later
        </button>

        <button
          className="w-1/3 inline-flex flex-col items-center text-[16px] font-[500]"
          // onClick={share}
        >
          <span
            onClick={cliclPlannet}
            className={`w-16 h-16 group bg-white rounded-full flex justify-center items-center text-3xl`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="35"
              viewBox="0 0 40 35"
              fill="#1F133E"
              // className="group-fill-[#1F133E]"
            >
              <path d="M11.2833 13.7341C12.6099 13.7341 13.7804 14.9046 13.7804 16.2312C13.7804 17.6358 12.6099 18.7283 11.2833 18.7283C9.87873 18.7283 8.78625 17.6358 8.78625 16.2312C8.78625 14.9046 9.87873 13.7341 11.2833 13.7341ZM20.0232 13.7341C21.3498 13.7341 22.5203 14.9046 22.5203 16.2312C22.5203 17.6358 21.3498 18.7283 20.0232 18.7283C18.6186 18.7283 17.5261 17.6358 17.5261 16.2312C17.5261 14.9046 18.6186 13.7341 20.0232 13.7341ZM28.7631 13.7341C30.0896 13.7341 31.2602 14.9046 31.2602 16.2312C31.2602 17.6358 30.0896 18.7283 28.7631 18.7283C27.3584 18.7283 26.2659 17.6358 26.2659 16.2312C26.2659 14.9046 27.3584 13.7341 28.7631 13.7341ZM20.0232 0C31.026 0 40 7.33523 40 16.2312C40 25.2051 31.026 32.4623 20.0232 32.4623C17.4481 32.4623 15.029 32.0721 12.766 31.3698C10.503 33.0085 6.67932 34.9594 1.91922 34.9594C1.13888 34.9594 0.436569 34.5692 0.124432 33.8669C-0.109672 33.1646 -0.0316372 32.3843 0.514603 31.838C0.592638 31.838 3.0117 29.1849 4.10419 26.1415C1.52905 23.4103 0.0463972 19.9768 0.0463972 16.2312C0.0463972 7.33523 8.94232 0 20.0232 0ZM20.0232 28.7167C28.9191 28.7167 36.2544 23.1762 36.2544 16.2312C36.2544 9.36413 28.9191 3.74565 20.0232 3.74565C11.0492 3.74565 3.79205 9.36413 3.79205 16.2312C3.79205 19.5866 5.43077 22.0837 6.83539 23.5664L8.47411 25.2831L7.61573 27.4681C7.22556 28.5606 6.67932 29.6531 6.05504 30.5895C7.92787 29.9652 9.48856 29.1068 10.581 28.3265L12.0637 27.234L13.8585 27.7802C15.8093 28.4045 17.9163 28.7167 20.0232 28.7167Z" />
            </svg>
          </span>
          Plannet
        </button>
        <button
          className="w-1/3 inline-flex flex-col items-center text-[16px] font-[500]"
          onClick={addTravelDates}
        >
          <span
            className={`w-16 h-16 text-[#1F133E] rounded-full flex justify-center items-center text-3xl bg-white`}
          >
            <FaRegCalendarAlt />
          </span>
          Travel Dates
        </button>
      </div>
    </>
  );
}
