import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { FaCity, FaSearch } from 'react-icons/fa';

import Link from 'next/link';

import Loader from '@/components/Loader/Loader';
import PlannerItem from '@/components/PlannerItem/PlannerItem';
import { DownloadModal } from '@/components/Modals/DownloadModal';

import { getAudioURL } from '@/lib/utils';
import { QUERY_OPTION } from '@/lib/constants';

import { getWebFeed } from '@/api/web/web.service';

type DestinationPageProps = {
  urlId: string;
};
export default function DestinationPage({ urlId }: DestinationPageProps) {
  const router = useRouter();
  const [planners, setPlanners] = useState<any[]>([]);
  const [city, setCity] = useState<any>();
  const [searchStr, setSearchStr] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [playingId, setPlayingId] = useState<string>('');
  const [
    PlannerQuestionResponsesByUserId,
    setPlannerQuestionResponsesByUserId,
  ] = useState<any[]>([]);

  const { isSuccess, data } = useQuery('feedv2', getWebFeed, QUERY_OPTION);

  useEffect(() => {
    if (isSuccess && data) {
      let selectedCity: any;
      Object.keys(data.cityById).forEach((key) => {
        if (data.cityById[key].urlId === urlId)
          selectedCity = data.cityById[key];
      });
      if (selectedCity) {
        setPlanners(
          data.planners.filter(
            (planner: any) => planner.HomeBaseId === selectedCity.id,
          ),
        );
        setCity(selectedCity);
        setPlannerQuestionResponsesByUserId(
          data.plannerQuestionData?.PlannerQuestionResponsesByUserId,
        );
      } else router.push('/destination');
    }
  }, [isSuccess, data]);

  const renderPlanners = () => {
    let rendered = false;
    const result = planners.map((planner) => {
      if (searchStr) {
        if (!planner?.firstName.toLowerCase().includes(searchStr.toLowerCase()))
          return null;
      }
      if (!rendered) rendered = true;
      return (
        <PlannerItem
          key={`desktop_planner_${planner.id}`}
          index={0}
          idstr=""
          planner={planner}
          city={city}
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
    });
    result.push(<div key="placeholder_1" className="w-[300px]" />);
    result.push(<div key="placeholder_2" className="w-[300px]" />);
    if (!rendered) return <div className="text-5xl m-auto">No Results 🧐</div>;
    return result;
  };

  if (!city)
    return (
      <div className="h-screen flex my-auto">
        <Loader size={50} />
      </div>
    );
  return (
    <div className="text-black">
      <div className="max-w-[1200px] w-full mx-auto py-5 px-5">
        <div className="text-2xl">
          <Link href="/">Home</Link> /{' '}
          <Link href="/destination">Destinations</Link> /{' '}
          <span className="text-black-300">{city.name}</span>
        </div>
      </div>
      <div className="w-full h-[1px] bg-black-100" />
      <div className="max-w-[1200px] w-full mx-auto py-8 px-5">
        <div className="flex">
          <div className="mr-5 lg:mr-10">
            {city.photoUrl_CF ? (
              <img
                className="w-56 aspect-square rounded-lg"
                src={`${city.photoUrl_CF}_360`}
                alt={city.name}
              />
            ) : (
              <div className="w-56  aspect-square bg-black-200 rounded-lg flex">
                <FaCity className="m-auto text-7xl text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="text-lg lg:text-2xl bg-black text-white py-2 px-10 rounded mr-auto">
              {city.continent}
            </div>
            <div className="text-3xl lg:text-5xl font-bold mt-5 mb-2">
              {city.name}
            </div>
            <div className="text-xl lg:text-3xl text-black-400">
              {city.country}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] bg-black-100" />
      <div className="max-w-[1200px] w-full flex flex-col mx-auto py-10">
        <div className="flex-col lg:flex-row flex w-full px-5">
          <div className="text-3xl lg:text-5xl mr-auto">Planners</div>
          <div className="flex bg-[#eeeeee] ml-0 lg:ml-5 rounded-lg px-5 py-2 mt-3 lg:mt-0">
            <FaSearch className="text-lg my-auto mr-2 text-black-300" />
            <input
              className="w-full bg-[#eeeeee] outline-none text-lg text-black"
              placeholder="Search Planners"
              value={searchStr}
              onChange={(e) => setSearchStr(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center lg:justify-between mt-5 min-h-[300px]">
          {renderPlanners()}
        </div>
      </div>

      <div className="px-5 text-white mb-10">
        <div className="bg-black max-w-[1160px] w-full flex flex-col lg:flex-row py-10 mx-auto rounded-3xl">
          <div className="max-w-xl w-full flex bg-cover m-auto bg-center bg-no-repeat bg-[url('/assets/images/becomeplanner/landing.png')]">
            <div className="w-full ml-5 lg:ml-20 mr-5 lg:mr-0">
              <div className="text-5xl text-center lg:text-left">
                Become a <br /> Plannet Planner
              </div>
              <div className="text-3xl text-center lg:text-left my-7">
                Sign up to be a Planner
              </div>
              <button
                type="button"
                className="flex mx-auto lg:mx-0 justify-center bg-white text-black max-w-sm w-full text-2xl py-4 rounded-md font-bold"
                onClick={() => router.push('/planner/signup')}
              >
                Get Started
              </button>
            </div>
          </div>
          <div className="w-fit mr-0 lg:mr-12 mt-10 lg:mt-0">
            <img
              src="/assets/images/becomeplanner/become_back.png"
              alt="cash"
            />
          </div>
        </div>
      </div>
      <DownloadModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
