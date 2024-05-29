import { Tab } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { DownloadModal } from '@/components/Modals/DownloadModal';
import style from '../../../styles/Trip.module.scss';

type LinkButtonTypes = {
  title: string;
  href: string;
  iconOne?: string | null;
  iconTwo?: string | null;
  btnType?: string;
};

type RenderLinkButtonTypes = {
  status: string;
};

function LinkButton({
  title,
  href,
  iconOne = null,
  iconTwo = null,
  btnType = 'link',
}: LinkButtonTypes) {
  const [showDownloadAppModal, setShowDownloadAppModal] = React.useState(false);

  return (
    <>
      <div
        className={
          btnType === 'link'
            ? 'bg-[#170D31] mr-8 p-3 rounded-lg inline-flex items-center justify-between md:min-w-[400px] min-w-full border-2 border-[#7440F5] border-dashed'
            : 'bg-[#170D31] mr-8 p-3 rounded-lg inline-flex items-center justify-between md:min-w-[400px] min-w-full'
        }
        style={{ cursor: 'pointer' }}
        onClick={() => setShowDownloadAppModal(!showDownloadAppModal)}
        // href={href}
      >
        <span className="flex items-center gap-2">
          {iconOne && <Image src={iconOne} alt="chat" width={25} height={25} loading="lazy"/>}
          {title}
        </span>
        {iconTwo && <Image src={iconTwo} alt="chat" width={25} height={25} loading="lazy"/>}
      </div>

      <DownloadModal
        isOpen={showDownloadAppModal}
        onClose={() => setShowDownloadAppModal(false)}
      />
    </>
  );
}

function RenderLinkButton({ status }: RenderLinkButtonTypes) {
  switch (status) {
    case 'SIGN_UP':
    case 'WAIT_LIST':
      return (
        <LinkButton
          title="Complete your profile"
          href="/planner/signup"
          iconOne="/assets/images/dashboard/profile-icon.svg"
          iconTwo="/assets/images/dashboard/arrow-right.svg"
        />
      );
    case 'COMPLETE':
      return (
        <LinkButton
          title="Create your Itinerary"
          href="/planner/signup"
          iconOne="/assets/images/dashboard/locations.svg"
          iconTwo="/assets/images/dashboard/arrow-right.svg"
        />
      );
    case 'MOCK_TRIP_SUBMITTED':
      return (
        <LinkButton
          title="Itinerary under review"
          href="/planner/signup"
          btnType="status"
        />
      );

    case 'MOCK_TRIP_APPROVED':
      return (
        <LinkButton
          title="Finish your Itinerary"
          href="/planner/signup"
          iconOne="/assets/images/dashboard/locations.svg"
          iconTwo="/assets/images/dashboard/arrow-right.svg"
        />
      );
    case 'WAIT_LIST_PROFILE_COMPLETE':
      return (
        <LinkButton
          title="Start Verification"
          href="/planner/signup"
          iconOne="/assets/images/dashboard/user-identifier-card.svg"
          iconTwo="/assets/images/dashboard/arrow-right.svg"
        />
      );
    case 'VERIFICATION_UPLOADED':
      return (
        <LinkButton
          title="Verification under review"
          href="/planner/signup"
          btnType="status"
        />
      );

    case 'SUSPENDED':
      return (
        <LinkButton
          title="Reupload Verification"
          href="/planner/signup"
          iconOne="/assets/images/dashboard/user-identifier-card.svg"
          iconTwo="/assets/images/dashboard/arrow-right.svg"
        />
      );

    default:
      return (
        <LinkButton
          title="Complete your profile"
          href="/planner/signup"
          iconOne="/assets/images/dashboard/profile-icon.svg"
          iconTwo="/assets/images/dashboard/arrow-right.svg"
        />
      );
  }
}

export default function ProfileTabs({ userdata, ...rest }: any) {
  return (
    <div {...rest}>
      <Tab.Group>
        <Tab.List>
          <Tab
            key="Become a Planner"
            className={`ui-selected:bg-black ui-selected:focus:outline-none ui-selected:opacity-100 ui-selected:px-4 opacity-60 mr-2 text-sm md:text-xl md:mr-8 py-2 rounded-lg ${style.tabText}`}
          >
            Become a Planner
          </Tab>
          {/* <Tab
            key="Completed Itineraries"
            className={`ui-selected:bg-black ui-selected:focus:outline-none ui-selected:opacity-100 ui-selected:px-4 opacity-60 mr-2 text-sm md:text-xl md:mr-8 py-2 rounded-lg ${style.tabText}`}
          >
            Completed Itineraries(
            {userdata?.user?.PlannerItineraries?.CompleteItineraries?.length ||
              0}
            )
          </Tab> */}
        </Tab.List>
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <RenderLinkButton status={userdata?.user?.plannerStatus} />
          </Tab.Panel>
          <Tab.Panel>Itineraries</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
