import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { FaCity, FaSearch } from 'react-icons/fa';

import { useRouter } from 'next/router';
import Link from 'next/link';

import { QUERY_OPTION } from '@/lib/constants';

import { getWebFeed } from '@/api/web/web.service';

export default function DestinationsPage() {
  const router = useRouter();
  const [cities, setCities] = useState<any[]>([]);
  const [searchStr, setSearchStr] = useState<string>('');

  const { isSuccess, data } = useQuery('feedv2', getWebFeed, QUERY_OPTION);

  useEffect(() => {
    if (isSuccess && data) {
      const tempCities: any = [];
      Object.keys(data.cityById).forEach((key) => {
        tempCities.push(data.cityById[key]);
      });
      setCities([...tempCities]);
    }
  }, [isSuccess, data]);

  const renderCities = () => {
    let rendered = false;
    const result = cities.map((city) => {
      if (searchStr) {
        if (!city.name.toLowerCase().includes(searchStr.toLowerCase()))
          return null;
      }
      if (!rendered) rendered = true;
      return (
        <button
          type="button"
          className="mt-5 mx-5 w-full md:w-1/4 lg:w-1/5 mb-auto"
          key={city.id}
          onClick={() => router.push(`/destination/${city.urlId}`)}
        >
          {city.photoUrl_CF ? (
            <img
              className="w-full aspect-square rounded-lg"
              src={`${city.photoUrl_CF}_360`}
              alt={city.name}
            />
          ) : (
            <div className="w-full aspect-square bg-black-200 rounded-lg flex">
              <FaCity className="m-auto text-7xl text-white" />
            </div>
          )}
          <div className="text-2xl mt-2 text-left">{city.name}</div>
          <div className="text-lg text-black-600 text-left">{city.country}</div>
        </button>
      );
    });
    result.push(
      <div key="placeholder_1" className="mx-5  w-full md:w-1/4 lg:w-1/5" />,
    );
    result.push(
      <div key="placeholder_2" className="mx-5  w-full md:w-1/4 lg:w-1/5" />,
    );
    if (!rendered) return <div className="text-5xl m-auto">No Results 🧐</div>;
    return result;
  };

  return (
    <div className="text-black">
      <div className="max-w-[1200px] w-full mx-auto py-5 px-5">
        <div className="text-2xl">
          <Link href="/">Home</Link> /{' '}
          <span className="text-black-300">Destinations</span>
        </div>
      </div>
      <div className="w-full h-[1px] bg-black-100" />
      <div className="max-w-[1200px] w-full flex flex-col mx-auto py-10">
        <div className="flex-col lg:flex-row flex w-full px-5">
          <div className="text-3xl lg:text-5xl mr-auto">Destinations</div>
          <div className="flex bg-[#eeeeee] ml-0 lg:ml-5 rounded-lg px-5 py-2 mt-3 lg:mt-0">
            <FaSearch className="text-lg my-auto mr-2 text-black-300" />
            <input
              className="w-full bg-[#eeeeee] outline-none text-lg text-black"
              placeholder="Search Destinations"
              value={searchStr}
              onChange={(e) => setSearchStr(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-between min-h-[300px]">
          {renderCities()}
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
    </div>
  );
}
