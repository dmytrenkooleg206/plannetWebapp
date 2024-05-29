import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

import PNDropdown from '@/components/PNDropdown/PNDropdown';
import PlannerItem from '@/components/PlannerItem/PlannerItem';
import { DownloadModal } from '@/components/Modals/DownloadModal';

import { QUERY_OPTION } from '@/lib/constants';
import { getAudioURL } from '@/lib/utils';

import { getWebFeed } from '@/api/web/web.service';

export default function AllPlannersPage() {
  const [planners, setPlanners] = useState<any[]>([]);
  const [filters, setFilters] = useState<any[]>([]);
  const [filteredPlanners, setFilteredPlanners] = useState<any[]>([]);
  const [cityById, setCityById] = useState<any>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [suggestedDestinations, setSuggestedDestinations] = useState<any[]>([]);
  const [suggestedInterests, setSuggestedInterests] = useState<any[]>([]);
  const [searchStr, setSearchStr] = useState<string>('');
  const [playingId, setPlayingId] = useState<string>('');

  const [
    PlannerQuestionResponsesByUserId,
    setPlannerQuestionResponsesByUserId,
  ] = useState<any[]>([]);

  const { isSuccess, data } = useQuery('feedv2', getWebFeed, QUERY_OPTION);

  useEffect(() => {
    if (isSuccess && data) {
      setPlanners(data.planners);
      setFilteredPlanners(data.planners);
      setCityById(data.cityById);
      const destinations: any = [];
      const interestes: any = [];
      let i = 0;
      Object.keys(data.cityById).forEach((key: string) => {
        const { name, country } = data.cityById[key];
        destinations.push({
          index: i,
          id: key,
          text: `${name}, ${country}`,
          selected: false,
        });
        i += 1;
      });
      i = 0;
      Object.keys(data.plannerAndItineraryTypeById).forEach((key: string) => {
        const { name } = data.plannerAndItineraryTypeById[key];
        if (!name) return;
        interestes.push({
          index: i,
          id: key,
          text: name,
          selected: false,
        });
        i += 1;
      });
      setSuggestedDestinations([...destinations]);
      setSuggestedInterests([...interestes]);
      setPlannerQuestionResponsesByUserId(
        data.plannerQuestionData?.PlannerQuestionResponsesByUserId,
      );
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (!planners.length) return;
    if (filters.length === 0) setFilteredPlanners([...planners]);
    else {
      let tempPlanners = [...planners];
      if (filters.findIndex((filter) => filter.type === 'Destination') >= 0)
        tempPlanners = planners.filter((planner) => {
          const { HomeBaseId } = planner;
          const destinationResult = filters.findIndex(
            (filter) =>
              filter.type === 'Destination' && filter.id === HomeBaseId,
          );
          if (destinationResult >= 0) return true;
          return false;
        });
      if (filters.findIndex((filter) => filter.type === 'Interest') >= 0)
        setFilteredPlanners([
          ...tempPlanners.filter((planner) => {
            const { PlannerAndItineraryTypeIds } = planner;
            const intrestResult = filters.filter(
              (filter) =>
                filter.type === 'Interest' &&
                PlannerAndItineraryTypeIds.findIndex(
                  (id: any) => filter.id === id,
                ) >= 0,
            );
            if (intrestResult.length > 0) return true;
            return false;
          }),
        ]);
      else setFilteredPlanners([...tempPlanners]);
    }
  }, [filters]);

  const handleOnDestinationSelect = (index: number) => {
    const destinations = [...suggestedDestinations];
    destinations[index].selected = !destinations[index].selected;
    const tempFilters = [...filters];
    if (destinations[index].selected) {
      tempFilters.push({
        type: 'Destination',
        text: destinations[index].text,
        optionIndex: index,
        id: destinations[index].id,
      });
    } else {
      const selectedIndex = tempFilters.findIndex(
        (filter) =>
          filter.optionIndex === index && filter.type === 'Destination',
      );
      tempFilters.splice(selectedIndex, 1);
    }
    setSuggestedDestinations([...destinations]);
    setFilters([...tempFilters]);
  };

  const handleOnInterestSelect = (index: number) => {
    const interests = [...suggestedInterests];
    interests[index].selected = !interests[index].selected;
    const tempFilters = [...filters];
    if (interests[index].selected) {
      tempFilters.push({
        type: 'Interest',
        text: interests[index].text,
        optionIndex: index,
        id: interests[index].id,
      });
    } else {
      const selectedIndex = tempFilters.findIndex(
        (filter) => filter.optionIndex === index && filter.type === 'Interest',
      );
      tempFilters.splice(selectedIndex, 1);
    }
    setSuggestedInterests([...interests]);
    setFilters([...tempFilters]);
  };

  const handleFilterRemove = (index: number, filter: any) => {
    const tempFilters = [...filters];
    if (filter.type === 'Destination') {
      const destinations = [...suggestedDestinations];
      destinations[filter.optionIndex].selected = false;
      setSuggestedDestinations([...destinations]);
    } else {
      const interests = [...suggestedInterests];
      interests[filter.optionIndex].selected = false;
      setSuggestedInterests([...interests]);
    }
    tempFilters.splice(index, 1);
    setFilters([...tempFilters]);
  };

  const handleClearFilter = () => {
    setFilters([]);
    setSuggestedDestinations([
      ...suggestedDestinations.map((destination) => ({
        ...destination,
        selected: false,
      })),
    ]);
    setSuggestedInterests([
      ...suggestedInterests.map((interest) => ({
        ...interest,
        selected: false,
      })),
    ]);
  };

  const renderFilteredResult = () => {
    let rendered = false;
    const result: any = filteredPlanners.map((planner) => {
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
    });
    if (!filteredPlanners.length || !rendered)
      return <div className="text-5xl m-auto">No Results 🧐</div>;
    return result;
  };

  return (
    <div className="text-black">
      <div className="max-w-[1200px] w-full mx-auto py-5 px-5">
        <div className="text-2xl">
          <Link href="/">Home</Link> /{' '}
          <span className="text-black-300">Planners</span>
        </div>
      </div>
      <div className="w-full h-[1px] bg-black-100" />
      <div className="max-w-[1200px] w-full flex flex-col mx-auto py-10">
        <div className="flex-col lg:flex-row flex w-full px-5">
          <div className="text-3xl lg:text-5xl mr-auto">Planners</div>
          <div className="flex-col lg:flex-row flex mt-5 lg:mt-0">
            <PNDropdown
              text="Destination"
              placeholder="Suggested Destination"
              options={suggestedDestinations}
              onSelect={handleOnDestinationSelect}
              filters={filters.filter(
                (filter) => filter.type === 'Destination',
              )}
            />
            <div className="mx-1.5 my-1.5" />
            <PNDropdown
              text="Interest"
              placeholder="Suggested Interest"
              options={suggestedInterests}
              onSelect={handleOnInterestSelect}
              filters={filters.filter((filter) => filter.type === 'Interest')}
            />
          </div>
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
        <div className="flex w-full px-5 mt-5">
          <div className="flex flex-wrap w-full">
            {filters.map((filter, index) => {
              return (
                <button
                  className="py-1 px-2.5 border border-black-200 text-black-600 rounded flex mr-2.5 mb-2"
                  key={`filter_${filter.type}_${filter.optionIndex}`}
                  type="button"
                  onClick={() => handleFilterRemove(index, filter)}
                >
                  <div>{filter.text}</div>
                  <FaTimes className="flex my-auto ml-1" />
                </button>
              );
            })}
          </div>
          {filters.length ? (
            <button
              className="underline no-wrap min-w-[100px] mb-auto"
              type="button"
              onClick={handleClearFilter}
            >
              Clear Filter
            </button>
          ) : null}
        </div>
        <div className="flex flex-wrap justify-center lg:justify-between mt-5 min-h-[300px]">
          {renderFilteredResult()}
        </div>
      </div>
      <DownloadModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
