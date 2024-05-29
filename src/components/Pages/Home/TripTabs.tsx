import { getUserTrips } from '@/api/trip/trip.service';
import TripCarousal from '@/components/TripCarousal/TripCarousal';
import { Tab } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import style from '../../../styles/Trip.module.scss';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function TripTabs({ ...rest }) {
  const [trips, setTrips] = useState<any>();
  const [tripsLegs, setTripsLegs] = useState<any>();
  const [tripsCity, setTripsCity] = useState<any>();
  const [tripsData, setTripsData] = useState<any>();

  const [data, setData] = useState<any>();
  const [onGoingData, setonGoingData] = useState<any>();
  const [completedData, setcompletedData] = useState<any>();

  const {
    isLoading: isLoadingTrip,
    data: tripData,
    isError: tripError,
  } = useQuery('user-trips', () => getUserTrips());

  useEffect(() => {
    setTrips(tripData?.TripsData?.tripById);
    setTripsLegs(tripData?.TripsData?.tripLegsByTripId);
    setTripsCity(tripData?.TripsData?.tripLegCityById);
    setTripsData(tripData?.TripsData);
  }, [tripData]);

  /**
   * Method to filter data by upcoming events
   * @param data object
   * @returns
   */
  const filterUpcomingTripsByDate = (data: any) => {
    const filtered =
      data != undefined &&
      Object.values(data).filter((item: any) => {
        if (
          item.startDate == null ||
          item.endDate == null ||
          (item.startDate != null &&
            item.endDate != null &&
            dayjs().isSameOrBefore(dayjs(`${item.startDate} 00:00:00`)) &&
            dayjs().isSameOrBefore(dayjs(`${item.endDate} 23:59:59`)))
        ) {
          return item;
        }
      });

    return filtered;
  };

  /**
   * Method to filter data by ongoing events
   * @param data object
   * @returns
   */
  const filterOngoingTripsByDate = (data: any) => {
    const filtered =
      data != undefined &&
      Object.values(data).filter((item: any) => {
        if (
          item.startDate != null &&
          item.endDate != null &&
          dayjs().isSameOrAfter(dayjs(`${item.startDate} 00:00:00`)) &&
          dayjs().isSameOrBefore(dayjs(`${item.endDate} 23:59:59`))
        ) {
          return item;
        }
      });

    return filtered;
  };

  /**
   * Method to filter data by completed events
   * @param data object
   * @returns
   */
  const filterCompletedTripsByDate = (data: any) => {
    const filtered =
      data != undefined &&
      Object.values(data).filter((item: any) => {
        if (
          item.startDate != null &&
          item.endDate != null &&
          dayjs().isSameOrAfter(dayjs(`${item.startDate} 00:00:00`)) &&
          dayjs().isSameOrAfter(dayjs(`${item.endDate} 23:59:59`))
        ) {
          return item;
        }
      });

    return filtered;
  };

  useEffect(() => {
    const record = filterUpcomingTripsByDate(trips);
    const record1 = filterOngoingTripsByDate(trips);
    const record2 = filterCompletedTripsByDate(trips);
    setData(record);
    setonGoingData(record1);
    setcompletedData(record2);
  }, [trips]);

  return (
    <div {...rest}>
      <Tab.Group>
        <Tab.List className="flex">
          <Tab
            className={` ui-selected:bg-black ui-selected:focus:outline-none ui-selected:opacity-100 ui-selected:px-4  mr-2 text-sm md:text-xl md:mr-8 py-2 rounded-lg ${style.tabText}`}
          >
            Ongoing Trips ({onGoingData && onGoingData.length})
          </Tab>
          <Tab
            className={` ui-selected:bg-black ui-selected:focus:outline-none ui-selected:opacity-100 ui-selected:px-4  mr-2 text-sm md:text-xl md:mr-8 py-2 rounded-lg ${style.tabText}`}
          >
            Upcoming Trips ({data && data.length})
          </Tab>
          <Tab
            className={`ui-selected:bg-black ui-selected:focus:outline-none ui-selected:opacity-100 ui-selected:px-4  mr-2 text-sm md:text-xl md:mr-8 py-2 rounded-lg ${style.tabText}`}
          >
            Completed ({completedData && completedData.length})
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <TripCarousal
              handleModal={rest.handleModal}
              showDownloadAppModal={rest.showDownloadAppModal}
              userdata={rest.userdata}
              trips={onGoingData}
              tripsdata={tripsData}
              tabId="Ongoing trips"
              isLoading={isLoadingTrip}
              tripLegs={tripsLegs}
              tripCity={tripsCity}
            />
          </Tab.Panel>
          <Tab.Panel>
            <TripCarousal
              handleModal={rest.handleModal}
              showDownloadAppModal={rest.showDownloadAppModal}
              userdata={rest.userdata}
              tripsdata={tripsData}
              trips={data}
              tripLegs={tripsLegs}
              tripCity={tripsCity}
              tabId="upcoming trips"
              isLoading={isLoadingTrip}
            />
          </Tab.Panel>
          <Tab.Panel>
            <TripCarousal
              handleModal={rest.handleModal}
              showDownloadAppModal={rest.showDownloadAppModal}
              userdata={rest.userdata}
              trips={completedData}
              tripsdata={tripsData}
              tabId="completed trips"
              isLoading={isLoadingTrip}
              tripLegs={tripsLegs}
              tripCity={tripsCity}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
