import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Player, BigPlayButton } from 'video-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Carousel from '@/components/Carousel/Carousel';
import PlannerItem from '@/components/PlannerItem/PlannerItem';
import { DownloadModal } from '@/components/Modals/DownloadModal';
import { getWebFeed } from '@/api/web/web.service';
import { QUERY_OPTION } from '@/lib/constants';
import { getAudioURL } from '@/lib/utils';

export default function OurPlannersPage() {
  const router = useRouter();
  const [planners, setPlanners] = useState<any[]>([]);
  const [cityById, setCityById] = useState<any>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [playingId, setPlayingId] = useState<string>('');
  const [
    PlannerQuestionResponsesByUserId,
    setPlannerQuestionResponsesByUserId,
  ] = useState<any[]>([]);

  const { isSuccess, data } = useQuery('feedv2', getWebFeed, QUERY_OPTION);

  useEffect(() => {
    if (isSuccess && data) {
      setPlanners(data.planners.slice(0, 8));
      setCityById(data.cityById);
      setPlannerQuestionResponsesByUserId(
        data.plannerQuestionData?.PlannerQuestionResponsesByUserId,
      );
    }
  }, [isSuccess, data]);

  const renderCities = (limit: number) => {
    if (!cityById) return null;
    const result: any = [];
    let i = 0;
    Object.keys(cityById).forEach((cityId) => {
      if (i >= 8) return;
      const city = cityById[cityId];
      if (!city.photoUrl_CF) return;
      result.push(
        <button
          type="button"
          className="mt-5 mx-5 w-full md:w-1/4 lg:w-1/5 mb-auto"
          key={city.id}
          onClick={() => router.push(`/destination/${city.urlId}`)}
        >
          <img
            className="w-full aspect-square rounded-lg"
            src={`${city.photoUrl_CF}_360`}
            alt={city.name}
          />
          <div className="text-2xl mt-2 text-left">{city.name}</div>
          <div className="text-lg text-black-600 text-left">{city.country}</div>
        </button>,
      );
      i += 1;
    });
    result.push(
      <div key="placeholder_1" className="mx-5 w-full md:w-1/4 lg:w-1/5" />,
    );
    result.push(
      <div key="placeholder_2" className="mx-5 w-full md:w-1/4 lg:w-1/5" />,
    );
    return result;
  };

  return (
    <div>
      <div className="bg-gradient-to-b from-primary from-20% via-black via-50% to-black text-white">
        <div className="max-w-[1200px] w-full flex flex-col lg:flex-row mx-auto py-10 px-5">
          <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
            <div className="text-2xl">
              <Link href="/">Home</Link> /{' '}
              <span className="text-white-700">Our Planners</span>
            </div>
            <h1 className="text-3xl md:text-6xl mt-10 text-center lg:text-left">
              Planning a trip <br /> is now as simple as <br /> sending a text
            </h1>
            <div className="text-xl md:text-3xl text-white-700 mt-7 mb-5 text-center lg:text-left">
              Download Plannet for more details
            </div>
            <div className="flex justify-center lg:justify-start">
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_STORE}`}
                target="blank"
              >
                <img
                  className="max-w-[190px] w-full h-full pr-2"
                  src="/assets/images/landingpage/app_store.png"
                  alt="app_store"
                />
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2 bg-white-500 p-3 rounded-lg my-auto">
            <Player>
              <source src="https://d3ojbcv1c0rzy9.cloudfront.net/caf38381-5bb0-4b62-a775-5aec48cd477e" />
              <BigPlayButton position="center" />
            </Player>
          </div>
        </div>
        <div className="max-w-[1200px] w-full flex flex-col mx-auto py-10">
          <div className="flex justify-between w-full px-5">
            <div className="text-3xl md:text-5xl">Our Top Planners</div>
            <Link
              href="/planner/all"
              className="text-lg md:text-2xl underline my-auto"
            >
              See All
            </Link>
          </div>
          <div className="hidden md:flex flex-wrap justify-between mt-5">
            {planners.map((planner) => {
              return (
                <PlannerItem
                  key={`desktop_planner_${planner.id}`}
                  index={0}
                  idstr=""
                  planner={planner}
                  city={cityById[planner.HomeBaseId]}
                  audioUrl={getAudioURL(
                    planner,
                    planner.id,
                    PlannerQuestionResponsesByUserId,
                  )}
                  onOpenDownloadModal={() => setIsOpen(true)}
                  onAudioChange={(newId: string) => setPlayingId(newId)}
                  playingId={playingId}
                />
              );
            })}
          </div>
          <div className="flex md:hidden">
            <Carousel>
              {planners.map((planner, index) => {
                return (
                  <PlannerItem
                    key={`mobile_planner_${planner.id}`}
                    index={index}
                    idstr="match-slider-"
                    planner={planner}
                    city={cityById[planner.HomeBaseId]}
                    audioUrl={getAudioURL(
                      planner,
                      planner.id,
                      PlannerQuestionResponsesByUserId,
                    )}
                    onOpenDownloadModal={() => setIsOpen(true)}
                    onAudioChange={(newId: string) => setPlayingId(newId)}
                    playingId={playingId}
                  />
                );
              })}
            </Carousel>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] w-full flex flex-col mx-auto py-10 px-5 bg-white">
        <div className="text-center text-5xl my-6 font-bold lg:my-12 lg:text-7xl">
          Booking a Planner
        </div>
        <div className="flex w-full flex-col lg:flex-row mt-5">
          <div className="w-full lg:w-1/2">
            <div className="bg-primary-100 p-5 lg:p-10 rounded-xl">
              <div className="flex mb-5 lg:mb-10">
                <img
                  className="w-12"
                  src="/assets/images/ourplanner/plan.png"
                  alt="plan"
                />
                <div className="text-3xl lg:text-5xl font-bold my-auto ml-5">
                  Plan my trip
                </div>
              </div>
              <div className="flex my-3">
                <img
                  className="w-10 h-10"
                  src="/assets/images/ourplanner/check.png"
                  alt=""
                />
                <div className="text-xl lg:text-3xl my-auto ml-5">
                  Unlimited Chat and Recs
                </div>
              </div>
              <div className="flex my-3">
                <img
                  className="w-10 h-10"
                  src="/assets/images/ourplanner/check.png"
                  alt=""
                />
                <div className="text-xl lg:text-3xl my-auto ml-5">
                  Custom Itinerary
                </div>
              </div>
            </div>
            <div className="bg-primary-100 p-5 lg:p-10 rounded-xl mt-10">
              <div className="flex mb-5 lg:mb-10">
                <img
                  className="w-12 mb-auto"
                  src="/assets/images/ourplanner/book.png"
                  alt="book"
                />
                <div className="text-3xl lg:text-5xl font-bold my-auto ml-5">
                  Plannet Will Book
                </div>
              </div>
              <div className="flex my-3">
                <img
                  className="w-10 h-10"
                  src="/assets/images/ourplanner/check.png"
                  alt=""
                />
                <div className="text-xl lg:text-3xl my-auto ml-5">
                  Flight Reservations
                </div>
              </div>
              <div className="flex my-3">
                <img
                  className="w-10 h-10"
                  src="/assets/images/ourplanner/check.png"
                  alt=""
                />
                <div className="text-xl lg:text-3xl my-auto ml-5">
                  Hotel Reservations
                </div>
              </div>
              <div className="flex my-3">
                <img
                  className="w-10 h-10"
                  src="/assets/images/ourplanner/check.png"
                  alt=""
                />
                <div className="text-xl lg:text-3xl my-auto ml-5">
                  Transportation
                </div>
              </div>
              <div className="flex my-3">
                <img
                  className="w-10 h-10"
                  src="/assets/images/ourplanner/check.png"
                  alt=""
                />
                <div className="text-xl lg:text-3xl my-auto ml-5">
                  Things to do
                </div>
              </div>
              <div className="flex my-3">
                <img
                  className="w-10 h-10"
                  src="/assets/images/ourplanner/check.png"
                  alt=""
                />
                <div className="text-xl lg:text-3xl my-auto ml-5">
                  Dining Reservations
                </div>
              </div>
              <div className="text-black-700 text-lg lg:text-2xl mt-5">
                <span className="font-bold">Plannet will book</span> your
                flights, hotels and reservations for your trip! We plan, you
                travel
              </div>
            </div>
          </div>
          <div className="flex w-full lg:w-1/2 mt-10 lg:mt-0">
            <img
              className="mx-auto mb-auto"
              src="/assets/images/ourplanner/booking.png"
              alt="booking"
            />
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] w-full flex flex-col mx-auto py-10">
        <div className="flex justify-between w-full px-5">
          <div className="text-2xl md:text-5xl">Where are our Planners?</div>
          <Link
            href="/destination"
            className="text-md md:text-2xl underline my-auto"
          >
            See All
          </Link>
        </div>
        <div className="flex flex-wrap w-full justify-between">
          {renderCities(8)}
        </div>
        {/* <div className="flex lg:hidden">
          <Carousel>{renderCities(8)}</Carousel>
        </div> */}
      </div>
      <DownloadModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
