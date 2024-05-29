import React, { useState } from 'react';

export default function ExperienceCounter() {
  const [count, setCount] = useState(0);

  /**
   * Method to increament/decreament counter
   * @param e
   * @param type
   */
  const handleCounter = (e: any, type: string) => {
    if (type === 'Incr') {
      setCount(count + 1);
    } else {
      count != 0 ? setCount(count - 1) : null;
    }
  };

  return (
    <>
      <div className=" mt-4 bg-white-200 rounded-[15px]">
        <div className="flex  justify-between  p-2.5">
          <div className="text-[18px] font-[300] items-center justify-center">
           Number of travelers
          </div>
          <div className="inline-flex gap-2 text-center items-center">
            <button className="bg-white-500 w-[30px] h-[30px] p-2 rounded-[50%] flex text-center items-center justify-center">
              <p
                className="text-[30px] font-[300] mb-[3px]"
                onClick={(e) => handleCounter(e, 'Decr')}
              >
                -
              </p>
            </button>
            <p className="text-[20px] text-white-500 font-[400] min-w-[24px]">{count}</p>
            <button className="bg-[#7440F5] w-[30px] h-[30px] p-2 rounded-[50%] flex text-center items-center justify-center">
              <p
                className="text-[30px] font-[300]"
                onClick={(e) => handleCounter(e, 'Incr')}
              >
                +
              </p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}