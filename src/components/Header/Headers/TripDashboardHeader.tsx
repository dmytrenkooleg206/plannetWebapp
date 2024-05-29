import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WhiteLogoImage from '@/../public/assets/images/footer/white_logo.png';
import { Menu } from '@headlessui/react';
import {
  removePlannetTokenFromLocalStorage,
  removePlannetUserIdFromLocalStorage,
  removePlannetUserProfilePictureFromLocalStorage,
} from '@/lib/localStorage/localStorage';
import { useDispatch } from 'react-redux';
import { actions } from '@/store/user/user.slice';
import { useRouter } from 'next/router';
import { FeedBackModal } from '@/components/Modals/FeedbackModal';
import style from '../../../styles/Trip.module.scss';
import { queryClient } from '@/pages/_app';

interface ITripDashboardHeader {
  userdata: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
      profilePictureUrl_CF: string;
    };
  };
}

export default function TripDashboardHeader({
  userdata,
}: ITripDashboardHeader) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [openFeedback, setOpenFeedback] = useState(false);

  const onLogout = () => {
    removePlannetUserIdFromLocalStorage();
    removePlannetTokenFromLocalStorage();
    removePlannetUserProfilePictureFromLocalStorage();
    dispatch(actions.setUser(null));
    queryClient.removeQueries("user-trips")
    queryClient.removeQueries("current_user")
    router.push('/');
  };

  return (
    <>
      <div className="py-2 md:py-5 flex justify-between">
        <Link href="/" className="inline-flex items-center">
          <Image
            src={WhiteLogoImage}
            alt="plannet"
            className={style.headerLogo}
            loading="lazy"
          />
        </Link>
        <div className="flex gap-2 sm:gap-4 items-center">
          <Link
            className="bg-[#7440F5] p-3 rounded-lg hidden md:inline-flex items-center justify-between gap-4 text-xl font-bold"
            href="/onboarding"
          >
            <Image
              src="/assets/images/landingpage/earth.svg"
              alt="chat"
              width={25}
              height={25}
              loading="lazy"
            />
            Plan a trip
            <Image
              src="/assets/images/dashboard/arrow-right.svg"
              alt="chat"
              width={25}
              height={25}
              loading="lazy"
            />
          </Link>
          <div className="bg-black rounded cursor-pointer flex items-center w-8 h-8 md:w-12 md:h-12">
            <Image
              className={`flex mx-auto ${style.headerIconImg}`}
              src="/assets/images/dashboard/feedback.svg"
              onClick={() => setOpenFeedback(true)}
              alt="notification"
              width={25}
              height={25}
              loading="lazy"
            />
          </div>
          <div className="bg-black rounded flex items-center w-8 h-8 md:w-12 md:h-12">
            <Image
              className={`flex mx-auto ${style.headerIconImg}`}
              src="/assets/images/dashboard/workplace.svg"
              alt="notification"
              width={25}
              height={25}
              loading="lazy"
            />
          </div>
          <div className="bg-black rounded flex items-center w-8 h-8 md:w-12 md:h-12">
            <Image
              className={`flex mx-auto ${style.headerIconImg}`}
              src="/assets/images/dashboard/notification.svg"
              alt="notification"
              width={25}
              height={25}
              loading="lazy"
            />
          </div>
          <Menu
            as="div"
            className="relative inline-block text-left w-8 h-8 md:w-12 md:h-12"
          >
            <Menu.Button>
              <div className="rounded flex items-center relative ">
                {userdata && userdata.user.profilePictureUrl_CF ? (
                  <Image
                    className={`rounded flex mx-auto ${style.headerProfIconImg}`}
                    width={45}
                    height={45}
                    src={userdata?.user.profilePictureUrl_CF}
                    loading="lazy"
                    alt="avatar"
                  />
                ) : (
                  userdata &&
                  userdata.user &&
                  userdata.user.firstName != null && (
                    <span className={`rounded w-[45px] h-[45px] flex mx-auto ${style.headerProfIconImg} ${style.nameLogin}`}>
                      {userdata.user.firstName.charAt(0).toUpperCase()}
                    </span>
                  )
                )}

                <div className="w-2.5 h-2.5 border border-white absolute bg-primary rounded-full top-0 right-0" />
              </div>
            </Menu.Button>
            <Menu.Items className="absolute right-0 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                <button
                  onClick={onLogout}
                  className="flex relative z-10 w-full justify-center px-5 py-2.5 text-red hover:bg-[rgb(255,229,229,0.2)]"
                  type="button"
                >
                  Log out
                </button>
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      <FeedBackModal
        isOpen={openFeedback}
        onClose={() => {
          setOpenFeedback(false);
        }}
        userdata={userdata}
      />
    </>
  );
}
