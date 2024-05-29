import React, { useState } from 'react';
import style from '../../styles/Trip.module.scss';
import Spinner from '../Loader/Spinner';

function NoTrips({ tabId, isLoading, data }: any) {
  const [isShow, setIsShow] = useState<boolean>(false);
  setTimeout(function () {
    setIsShow(true);
  }, 1000);

  return (
    <>
      <div
        id={`${style.NoTrips}`}
        className={`h-full w-1/3 lg:gap-8 md:gap-6 gap-14 items-center justify-start ${style.NoTrip}`}
      >
        <>
          <div
            className={`relative w-full h-full bg-black rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ${style.noRecordDiv}`}
          >
            <div className={`${style.noRecordImg}`}>
              {isLoading ? (
                <Spinner />
              ) : (
                data &&
                data.length <= 0 && (
                  <>
                    <img src="/assets/images/trip/no-trip.png" />
                    {tabId && (
                      <h3 className="font-bold text-center mt-3 text-white">
                        No {tabId} yet
                      </h3>
                    )}
                  </>
                )
              )}
            </div>
          </div>
        </>
      </div>
    </>
  );
}

export default NoTrips;
