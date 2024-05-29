import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

import { getUserById } from '@/api/user/user.service';
import Image from 'next/image';
import Link from 'next/link';
import { QUERY_OPTION } from '@/lib/constants';
import { getPlannetUserIdFromLocalStorage } from '@/lib/localStorage/localStorage';
import { DownloadModal } from '@/components/Modals/DownloadModal';
import useChangeBgImage from '@/hooks/useChangeBgImage';
import TripDashboardHeader from '@/components/Header/Headers/TripDashboardHeader';
import TravelTab from '@/components/TravelTabs/TravelTab';
import style from '../../../styles/Trip.module.scss';
import TripTabs from './TripTabs';
import ProfileTabs from './ProfileTabs';

export default function HomeFeed() {
  const [showDownloadAppModal, setShowDownloadAppModal] = React.useState(false);
  const router: any = useRouter();
  const bgChangingContainer = useChangeBgImage();

  const {
    isLoading: isLoadingUser,
    data: userData,
    isError: userError,
  } = useQuery(
    'current_user',
    () => getUserById(getPlannetUserIdFromLocalStorage()),
    {
      ...QUERY_OPTION,
      onSuccess: (data: any) => {
        if (!data) router.push('/signin');
      },
    },
  );

  useEffect(() => {
    if (userError) {
      router.push('/');
    }
  }, [userError, router]);

  return (
    <>
      <div className="overflow-auto scroll-container">
        <div
          id="main-container"
          ref={bgChangingContainer}
          className="text-white h-screen w-screen fixed bg-[url('/assets/images/backgrounds/image-1.webp')] bg-no-repeat bg-cover overflow-y-auto"
        >
          <div className="h-screen w-screen bg-[rgba(0,0,0,0.85)] fixed z-[-1]" />
          <div className="relative top-0 left-0 flex h-screen w-screen flex-col pb-12 ">
            <div className="w-full mx-auto max-w-[1440px] px-3 sm:px-5 md:px-7">
              <TripDashboardHeader userdata={userData} />
              {userData &&
                userData?.user &&
                userData?.user?.firstName &&
                userData?.user?.lastName &&
                userData?.user?.firstName != '' &&
                userData?.user?.lastName != ''}
              <div
                className={`py-6 text-6xl font-[100] rounded-md flex mr-auto  ${style.welcomeTitle}`}
                role="presentation"
              >
                Welcome Back,&nbsp;
                <span className="font-bold">
                  {userData?.user &&
                    userData?.user?.firstName + ' ' + userData?.user?.lastName}
                </span>
              </div>
              <Link
                className="md:hidden bg-[#7440F5] p-3 rounded-lg  w-full inline-flex items-center justify-between gap-4 text-xl font-bold mb-6"
                href="/onboarding"
              >
                <span className="flex items-center gap-2">
                  <Image
                    loading="lazy"
                    src="/assets/images/landingpage/earth.svg"
                    alt="chat"
                    width={25}
                    height={25}
                  />
                  Plan a trip
                </span>
                <Image
                  loading="lazy"
                  src="/assets/images/dashboard/arrow-right.svg"
                  alt="chat"
                  width={25}
                  height={25}
                />
              </Link>
              <div className="flex flex-col gap-8">
                <TripTabs
                  className="order-1 md:order-1"
                  userdata={userData}
                  handleModal={setShowDownloadAppModal}
                  showDownloadAppModal={showDownloadAppModal}
                />
                {userData && userData.user?.plannerStatus !== 'COMPLETE' && (
                  <ProfileTabs
                    className="order-1 md:order-2"
                    userdata={userData}
                  />
                )}
                {userData &&
                  userData.user?.plannerStatus !== null &&
                  userData.user?.plannerStatus === 'COMPLETE' && (
                    <TravelTab
                      className={`my-10 md:mt-0 order-2 md:order-2 ${style.tabmainDiv} `}
                      userdata={userData}
                      handleModal={setShowDownloadAppModal}
                      showDownloadAppModal={showDownloadAppModal}
                    />
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DownloadModal
        isOpen={showDownloadAppModal}
        onClose={() => setShowDownloadAppModal(false)}
      />
    </>
  );
}
