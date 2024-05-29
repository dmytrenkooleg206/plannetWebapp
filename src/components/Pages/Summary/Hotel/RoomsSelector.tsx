import React, { useState } from 'react';

export default function RoomsSelector({ hotelData, itiEve }: any) {
  const [count, setCount] = useState<any>({
    count1:
      hotelData.hotel.bestRoom.bedType === 'Single'
        ? itiEve.hotelParams.numRooms
        : 0,
    count2:
      hotelData.hotel.bestRoom.bedType === 'Double'
        ? itiEve.hotelParams.numRooms
        : 0,
    count3:
      hotelData.hotel.bestRoom.bedType === 'Suit'
        ? itiEve.hotelParams.numRooms
        : 0,
  });

  /**
   * Method to update the counter of the room selector
   * @param key string
   * @param type string
   */
  const handleEvent = (key: any, type: any) => {
    if (type === 'incr') {
      setCount((prv: any) => {
        return { ...prv, [key]: prv[key] + 1 };
      });
    } else {
      setCount((prv: any) => {
        if (prv[key] === 0) {
          return prv;
        } else {
          return { ...prv, [key]: prv[key] - 1 };
        }
      });
    }
  };

  return (
    <>
      <div className="flex  justify-between  border-b border-white-300 p-3">
        <div className=" font-bold">
          <span className="text-[20px] font-[300]">One bed</span>
        </div>
        <div className="inline-flex gap-4 text-center items-center">
          <button
            className="bg-white-500  w-[30px] h-[30px] p-2 rounded-full flex items-center justify-center"
            onClick={(e) => handleEvent('count1', 'decr')}
          >
            <p className="text-[24px] font-bold mb-[3px]">-</p>
          </button>
          <p className="text-[24px] text-white-500 font-[400] min-w-[24px]">
            {count.count1}
          </p>
          <button
            className="bg-[#7440F5] w-[30px] h-[30px] p-2 rounded-full flex items-center justify-center"
            onClick={(e) => handleEvent('count1', 'incr')}
          >
            <p className="text-[24px] font-bold">+</p>
          </button>
        </div>
      </div>
      <div className="flex  justify-between border-b border-white-300 p-3">
        <div className=" font-bold">
          <span className="text-[20px] font-[300]">Two bed</span>
        </div>
        <div className="inline-flex gap-4 text-center items-center">
          <button
            className="bg-white-500  w-[30px] h-[30px] p-2 rounded-full flex items-center justify-center"
            onClick={(e) => handleEvent('count2', 'decr')}
          >
            <p className="text-[24px] font-bold mb-[3px]">-</p>
          </button>
          <p className="text-[24px] text-white-500 font-[400] min-w-[24px]">
            {count.count2}
          </p>
          <button
            className="bg-[#7440F5] w-[30px] h-[30px] p-2 rounded-full flex items-center justify-center"
            onClick={(e) => handleEvent('count2', 'incr')}
          >
            <p className="text-[24px] font-bold">+</p>
          </button>
        </div>
      </div>
      <div className="flex  justify-between border-b border-white-300 p-3 ">
        <div className=" font-bold">
          <span className="text-[20px] font-[300]">Suit</span>
        </div>
        <div className="inline-flex gap-4 text-center items-center">
          <button
            className="bg-white-500  w-[30px] h-[30px] p-2 rounded-full flex items-center justify-center"
            onClick={(e) => handleEvent('count3', 'decr')}
          >
            <p className="text-[24px] font-bold mb-[3px]">-</p>
          </button>
          <p className="text-[24px] text-white-500 font-[400] min-w-[24px]">
            {count.count3}
          </p>
          <button
            className="bg-[#7440F5] w-[30px] h-[30px] p-2 rounded-full flex items-center justify-center"
            onClick={(e) => handleEvent('count3', 'incr')}
          >
            <p className="text-[24px] font-bold">+</p>
          </button>
        </div>
      </div>
    </>
  );
}
