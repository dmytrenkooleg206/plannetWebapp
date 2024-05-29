import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import style from '../../styles/Trip.module.scss';
import TripEvents from './TripEvents';
import dayjs from 'dayjs';

export default function TripSlide({
  item,
  tabId,
  tripLegs,
  tripCity,
  userdata,
  data,
  handleModal,
  showDownloadAppModal,
}: any) {
  const getTripUser = (tripId: string) => {
    if (tripId && tripId != undefined) {
      if (
        data &&
        data.allTripGuestsByTripId &&
        data?.allTripGuestsByTripId[tripId]
      ) {
        let tripGuests = data?.allTripGuestsByTripId[tripId].find(
          (item: any) => item.isHost,
        );
        let getHostUserDetails = data?.userById[tripGuests.UserId];
        if (getHostUserDetails && getHostUserDetails?.profilePictureUrl_CF) {
          return (
            <Image
              loading="lazy"
              className={`rounded flex mx-auto items-center  ${style.noneNameImage} ${style.headerProfIconImg}`}
              width={32}
              height={32}
              src={getHostUserDetails?.profilePictureUrl_CF}
              alt="avatar"
            />
          );
        }
        return getHostUserDetails?.firstName != null ? (
          <span
            className={`rounded flex w-[32px] h-[32px] mx-auto bg-[#00CABE] items-center text-white-800 ${style.headerProfIconImg} ${style.noneNameImage}`}
          >
            {getHostUserDetails?.firstName.charAt(0).toUpperCase()}
          </span>
        ) : (
          <span></span>
        );
      }
    }
  };

  getTripUser(item?.id);

  return (
    <>
      <div className="px-2">
        <div className="bg-black border border-[#7440F5] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-full
       ">
          <div className="w-full max-w-full px-4 py-2 mb-1 bg-[#261159] rounded-t-lg">
            <div className={`p-3 pr-0 ${style.borderDiv}`}>
              <div className="flex justify-between">
                <span className="text-[20px]">{item?.name}</span>
                <div className="flex">
                  {item.NotificationData?.NumUnreadChatMessages ? (
                    <span
                      className={`text-xs flex font-medium mr-4 px-2.5 py-1.5 rounded-full dark:bg-gray-700 dark:text-red-400 ${style.notif}`}
                      style={{ fontSize: '14px' }}
                    >
                      {parseInt(item.NotificationData?.NumUnreadChatMessages) >
                        0 && item.NotificationData?.NumUnreadChatMessages}
                    </span>
                  ) : null}
                  <Image
                    src="/assets/images/dashboard/share-icon.svg"
                    width={25}
                    loading="lazy"
                    height={25}
                    alt="share"
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>
              <div>
                {/* {item.startDate != null && item.endDate != null && } */}
                <p className="mt-2 text-[14px] font-thin">
                  {item.startDate !== null && item.endDate !== null ? (
                    `${new Date(item.startDate)
                      .toString()
                      .split(' ')
                      .splice(1, 2)
                      .join(' ')} - ${new Date(item.endDate)
                      .toString()
                      .split(' ')
                      .splice(1, 2)
                      .join(' ')}`
                  ) : (
                    <br />
                  )}
                </p>
              </div>
              <div className="flex items-end justify-between">
                {tabId === 'completed trips' ? (
                  <span className="text-[#00ff40] text-[14px]">Completed</span>
                ) : tabId === 'upcoming trips' ? (
                  item.startDate != null ? (
                    <span className="text-[#A480FF] text-[14px]">
                      In {dayjs(item.startDate).diff(dayjs(), 'days')} Days
                    </span>
                  ) : (
                    <span className="text-[#A480FF] text-[14px]"></span>
                  )
                ) : (
                  <span> </span>
                )}
                {tabId === 'Ongoing trips' ? null : (
                  <span className={`${style.hostedByContainer}`}>
                    <span className="text-[12px] font-thin align-bottom">
                      Hosted By
                    </span>
                    <span
                      id="badge-dismiss-default"
                      className="inline-flex items-center ml-2 text-sm font-medium text-white-800 rounded"
                    >
                      {getTripUser(item?.id)}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* Card Bottom Section */}
          <div className="p-3">
            {tabId === 'Ongoing trips' ? (
              <div className="">
                <span className="text-[20px]">Upcoming Events</span>
                {data &&
                  data?.tripLegsByTripId &&
                  data?.tripLegsByTripId[item?.id] != undefined && (
                    <TripEvents
                      handleModal={handleModal}
                      showDownloadAppModal={showDownloadAppModal}
                      tripId={item?.urlId}
                      tabId={tabId}
                      tripleg={data?.tripLegsByTripId[item?.id]}
                      itenEvent={data?.itineraryEventsByTripLegId}
                    />
                  )}
              </div>
            ) : (
              <>
                <div className="flex pb-3">
                  <img
                    src="/assets/images/trip/location.png"
                    className="w-6 h-6"
                  />
                  {tripLegs &&
                    tripCity &&
                    tripCity[tripLegs[item.id][0].CityId].name != undefined &&
                    tripCity[tripLegs[item.id][0].CityId].country !=
                      undefined && (
                      <p
                        className="text-gray-50 underline"
                        style={{ color: 'gray' }}
                      >
                        {`${tripCity[tripLegs[item.id][0].CityId].name}, ${
                          tripCity[tripLegs[item.id][0].CityId].country
                        }`}
                      </p>
                    )}
                </div>
                {tabId === 'completed trips' ? (
                  <Link
                    href="javascript:void(0)"
                    onClick={() => handleModal(!showDownloadAppModal)}
                    className="w-full inline-flex items-center p-3 font-bold text-center text-white rounded-lg justify-between bg-[#7440F5]"
                  >
                    Upload Photos
                    <Image
                      src="/assets/images/dashboard/right-arrow-rounded.svg"
                      width={25}
                      height={25}
                      loading="lazy"
                      alt="share"
                    />
                  </Link>
                ) : (
                  <Link
                    href={`/trip/${item.urlId}`}
                    // onClick={() => handleModal(!showDownloadAppModal)}
                    className="w-full inline-flex items-center p-3 font-bold text-center text-white rounded-lg justify-between bg-[#7440F5]"
                  >
                    Finish Planning
                    <Image
                      src="/assets/images/dashboard/right-arrow-rounded.svg"
                      width={25}
                      height={25}
                      loading="lazy"
                      alt="share"
                    />
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
