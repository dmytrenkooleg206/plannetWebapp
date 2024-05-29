import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import style from '../../styles/Trip.module.scss';
import Spinner from '../Loader/Spinner';

export default function TripEvents({
  tripId,
  tabId,
  tripleg,
  itenEvent,
  handleModal,
  showDownloadAppModal,
}: any) {
  const [upcomingEvent, setUpcomingEvents] = useState<any>([]);
  const [isShow, setIsShow] = useState<boolean>(false);

  setTimeout(function () {
    setIsShow(true);
  }, 1000);

  useEffect(() => {
    setUpcomingEvents(itenEvent[tripleg[0].id]);
  }, [upcomingEvent]);

  const newArr =
    upcomingEvent &&
    upcomingEvent != undefined &&
    upcomingEvent
      .filter((event: any) => event.type.includes('EVENT'))
      .map((item: any) => item);

  return (
    <div className="upcoming-events">
      {newArr && newArr.length > 0 ? (
        newArr.map((event: any) => {
          let amPm = '';
          let hours;
          // if (event && event.startTime) {
          hours = event && event.startTime && event.startTime != null ? event.startTime.split(':')[0] : 12;
          amPm = hours > 12 ? 'PM' : 'AM';
          return (
            <Link
              href="javascript:void(0)"
              onClick={() => handleModal(!showDownloadAppModal)}
              key={event.id}
              className="w-full inline-flex items-center p-2 my-1 font-bold text-white rounded-lg justify-between bg-[#1D1D1D]"
            >
              <div>
                <span className={`text-[18px] ${style.truncate}`}>
                  {event.name.length > 25
                    ? `${event.name.substring(0, 25)}...`
                    : event.name}
                </span>
                <br />
               { event.startTime != null && <span className="text-[14px] font-[100]">
                  {`${event.startTime} ${amPm}`}
                </span>}
              </div>
              <Image
                src="/assets/images/dashboard/ongoing-right-arrow.svg"
                width={40}
                height={40}
                alt="share"
                loading="lazy"
              />
            </Link>
          );
          // }
        })
      ) : (
        <Link href="#" className="w-full">
          <div
            style={{
              minHeight: '180px',
            }}
            className={`relative w-full bg-[#1D1D1D] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 `}
          >
            <div className={`${style.noRecordImg}`}>
              {!isShow ? (
                <Spinner />
              ) : (
                <>
                  <img src="/assets/images/trip/no-trip.png" />
                  {tabId && (
                    <h3 className="font-bold text-center mt-3">
                      No upcoming events yet
                    </h3>
                  )}
                </>
              )}
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
