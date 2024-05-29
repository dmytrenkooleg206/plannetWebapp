import React, { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import style from '../../styles/Trip.module.scss';
import EarnTravelCarousal from './EarnTravelCarousal';

function TravelTab({ ...rest }: any) {
  const [activeTab, setActiveTab] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    if (document.querySelector('#main-container') !== null) {
      const currentPosition =
        document.querySelector('#main-container')?.scrollTop;
      setScrollPosition(currentPosition as number);
    }
  };

  const handleTabClick = (e: any, index: number) => {
    setActiveTab(index);
  };

  useEffect(() => {
    document
      .querySelector('#main-container')
      ?.addEventListener('scroll', handleScroll);

    setTimeout(() => {
      document.querySelector('#main-container')?.scrollTo({
        top: scrollPosition,
        behavior: 'auto',
      });
    }, 100);

    return () => {
      window.removeEventListener('#main-container', handleScroll);
    };
  }, [activeTab]);

  return (
    <div {...rest}>
      <Tab.Group key="earn-credit-key" selectedIndex={activeTab}>
        <Tab.List>
          <Tab
            onClick={(e) => handleTabClick(e, 0)}
            className={`ui-selected:bg-black ui-selected:focus:outline-none ui-selected:opacity-100 ui-selected:px-4 mr-2 text-sm md:text-xl md:mr-8 py-2 rounded-lg ${style.tabText}`}
          >
            Earn Travel Credit
          </Tab>
          {rest?.userdata?.user?.PlannerItineraries?.PendingApprovalItineraries
            ?.length > 0 && (
            <Tab
              onClick={(e) => handleTabClick(e, 1)}
              className={` ui-selected:bg-black ui-selected:focus:outline-none ui-selected:opacity-100 ui-selected:px-4 mr-2 text-sm md:text-xl md:mr-8 py-2 rounded-lg ${style.tabText}`}
            >
              Pending approval(
              {rest?.userdata?.user?.PlannerItineraries
                ?.PendingApprovalItineraries?.length || 0}
              )
            </Tab>
          )}
          {rest?.userdata?.user?.PlannerItineraries?.CompleteItineraries
            ?.length > 0 && (
            <Tab
              onClick={(e) => handleTabClick(e, 2)}
              className={`ui-selected:bg-black ui-selected:focus:outline-none ui-selected:opacity-100 ui-selected:px-4 mr-2 text-sm md:text-xl md:mr-8 py-2 rounded-lg ${style.tabText}`}
            >
              Completed Itineraries(
              {rest?.userdata?.user?.PlannerItineraries?.CompleteItineraries
                ?.length || 0}
              )
            </Tab>
          )}
        </Tab.List>
        <Tab.Panels className="mt-4">
          <Tab.Panel key="earnTravelCarousal-Panel">
            <EarnTravelCarousal key="earnTravelCarousal" tabId="earn" />
          </Tab.Panel>
          {rest?.userdata?.user?.PlannerItineraries?.PendingApprovalItineraries
            ?.length > 0 && (
            <Tab.Panel key="pendingTravelCarousal-Panel">
              <EarnTravelCarousal
                key="pendingTravelCarousal"
                tabId="pending"
                handleModal={rest.handleModal}
                showDownloadAppModal={rest.showDownloadAppModal}
              />
            </Tab.Panel>
          )}
          {rest?.userdata?.user?.PlannerItineraries?.CompleteItineraries
            ?.length > 0 && (
            <Tab.Panel key="completedTravelCarousal-Panel">
              <EarnTravelCarousal
                key="completedTravelCarousal"
                tabId="completed"
                handleModal={rest.setShowDownloadAppModal}
                showDownloadAppModal={rest.showDownloadAppModal}
              />
            </Tab.Panel>
          )}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default TravelTab;
