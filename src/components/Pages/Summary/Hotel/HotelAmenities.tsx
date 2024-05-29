import React from 'react';
import style from './HotelDetails.module.scss';

export default function HotelAmenities({ amenities }: any) {
  const [isShowMore, setIsShowMore] = React.useState<boolean>(false);
  const [contentLimit, setContentLimit] = React.useState<number>(6);

  const handleShowMore = () => {
    setIsShowMore(!isShowMore);
    setContentLimit(isShowMore ? 6 : amenities.plannetHotelAmenities.length);
  };

  return (
    <div className="rounded-lg bg-white-100 p-2 mt-4">
      <div className="text-white text-sm font-light text-start ">
        <p className="inline-flex gap-1 text-lg mt-2 font-bold">Amenities</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {amenities &&
          amenities.plannetHotelAmenities &&
          amenities.plannetHotelAmenities.length > 0 ? (
            <>
              <ul className="gap-2">
                {amenities.plannetHotelAmenities.map(
                  (item: any, index: number) =>
                    index < contentLimit && (
                      <li
                        key={`amenities_${item.id}`}
                        className="flex gap-2 mb-2 items-center"
                      >
                        <div
                          className={`${style.circleContent} flex items-center justify-center `}
                        >
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.85082 1.10826C9.03428 1.26551 9.05081 1.5364 8.88773 1.7133L4.147 6.85616C4.06266 6.94765 3.94177 7 3.81482 7C3.68787 7 3.56698 6.94765 3.48263 6.85616L1.11227 4.28473C0.949193 4.10782 0.965717 3.83693 1.14918 3.67968C1.33263 3.52243 1.61356 3.53837 1.77663 3.71528L3.81482 5.92634L8.22337 1.14385C8.38644 0.966942 8.66736 0.951007 8.85082 1.10826Z"
                              fill="#1F133E"
                              stroke="#1F133E"
                              strokeWidth="0.5"
                            />
                          </svg>
                        </div>
                        <span className="text-white-600 text-[16px] font-[400]">
                          {item.amenityName}
                        </span>
                      </li>
                    ),
                )}
              </ul>
              {amenities &&
              amenities.plannetHotelAmenities &&
              amenities.plannetHotelAmenities.length >= contentLimit && (
                <button
                  className="text-[#fff] underline flex w-[100%] text-[16px]"
                  onClick={() => handleShowMore()}
                >
                  {isShowMore ? 'Show less' : 'Show more'}
                </button>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
