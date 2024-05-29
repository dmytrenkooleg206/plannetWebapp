import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Menu } from '@headlessui/react';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import {
  getPlannetUserProfilePictureFromLocalStorage,
  removePlannetTokenFromLocalStorage,
  removePlannetUserIdFromLocalStorage,
  removePlannetUserProfilePictureFromLocalStorage,
  getPlannetUserIdFromLocalStorage,
} from '@/lib/localStorage/localStorage';
import { actions } from '@/store/user/user.slice';
import { useQuery } from 'react-query';
import { QUERY_OPTION } from '@/lib/constants';
import { getUserById } from '@/api/user/user.service';
import { queryClient } from '@/pages/_app';

type DesktopHeaderProps = {
  toggleCurrencyModal: Function;
  isDark?: boolean;
  currencySymbolNative: string;
  userId: string;
  onUpdateUserId: Function;
};

export function DesktopHeader({
  isDark = false,
  toggleCurrencyModal,
  currencySymbolNative,
  userId,
  onUpdateUserId,
}: DesktopHeaderProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [userProfilePicture, setUserProfilePicture] = useState<string>('');

  useEffect(() => {
    const userProfilePicture = getPlannetUserProfilePictureFromLocalStorage();
    const userId = getPlannetUserIdFromLocalStorage();
    onUpdateUserId(userId);
    setUserProfilePicture(
      userProfilePicture !== 'undefined' ? userProfilePicture : '',
    );
  }, []);

  const onLogout = () => {
    removePlannetUserIdFromLocalStorage();
    removePlannetTokenFromLocalStorage();
    removePlannetUserProfilePictureFromLocalStorage();
    setUserProfilePicture('');
    onUpdateUserId('');
    dispatch(actions.setUser(null));
    queryClient.removeQueries("user-trips")
    queryClient.removeQueries("current_user")
    router.push('/');
  };

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

  return (
    <div
      className={`hidden lg:flex text-xl justify-center align-center h-full w-full py-5 px-2.5 ${
        isDark ? 'text-white' : 'text-black'
      }`}
    >
      <div className={`flex my-auto ${isDark ? 'invert' : ''}`}>
        <Link href="/">
          <div className="w-44 h-12 relative">
            <Image
              src="/assets/images/header/black_plannet.svg"
              alt="plannet"
              fill
              loading="lazy"
            />
          </div>
        </Link>
      </div>

      <button
        className={`bg-black text-white flex rounded-3xl text-xl max-w-[90px] w-full ml-20 justify-center py-2 my-5 ${
          isDark ? 'invert' : ''
        }`}
        type="button"
        onClick={() => toggleCurrencyModal(true)}
      >
        <div className="mr-2.5 font-bold underline underline-offset-4">
          {currencySymbolNative}
        </div>
        <div className="w-5 h-3 relative my-auto">
          <Image
            src="/assets/images/header/down.svg"
            alt="down"
            fill
            loading="lazy"
          />
        </div>
      </button>

      <Link className="mx-5 text-xl my-auto font-bold" href="/planner/about">
        Our Planners
      </Link>
      <Link className="mx-5 text-xl my-auto font-bold" href="/planner">
        Become a Planner
      </Link>
      {userId ? (
        <div className="ml-10 ">
          <Link href="/home" className="text-xl my-auto font-bold mr-10 ">
            Home
          </Link>
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button>
              <div className="w-12 h-12 relative">
                {userProfilePicture && userProfilePicture != undefined ? (
                  <Image
                    src={
                      userProfilePicture
                        ? `${userProfilePicture}_720`
                        : '/assets/images/planneritem/profile_placeholder.png'
                    }
                    alt="avatar"
                    fill
                    sizes="48px"
                    loading="lazy"
                    className="rounded-md"
                    style={{ marginTop: '11px' }}
                  />
                ) : (
                  userData &&
                  userData.user &&
                  userData.user.firstName != null && (
                    <span
                      className="absolute rounded w-[45px] h-[45px] flex items-center  bg-black text-white  text-center justify-center align-center"
                      style={{ marginTop: '11px' }}>
                      {userData.user.firstName.charAt(0).toUpperCase()}
                    </span>
                  )
                )}
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
      ) : (
        <>
          <div
            className={`w-px h-12 my-auto ${isDark ? 'bg-white' : 'bg-black'}`}
          />
          <Link href="/signin" className="text-xl my-auto font-bold ml-10">
            Login
          </Link>
          <Link
            href="/signup"
            className="ml-11 my-auto text-xl bg-primary color-white py-2.5 px-5 rounded-[40px] text-white"
          >
            Get Started
          </Link>
        </>
      )}
    </div>
  );
}
