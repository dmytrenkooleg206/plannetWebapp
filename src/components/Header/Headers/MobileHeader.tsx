import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Menu } from '@headlessui/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import {
  getPlannetUserIdFromLocalStorage,
  getPlannetUserProfilePictureFromLocalStorage,
  removePlannetTokenFromLocalStorage,
  removePlannetUserIdFromLocalStorage,
  removePlannetUserProfilePictureFromLocalStorage,
} from '@/lib/localStorage/localStorage';
import { actions } from '@/store/user/user.slice';

import styles from '../Header.module.scss';
import { useQuery } from 'react-query';
import { getUserById } from '@/api/user/user.service';
import { QUERY_OPTION } from '@/lib/constants';
import { queryClient } from '@/pages/_app';

type MenuButtonProps = {
  onClick: Function;
  isOpen?: boolean;
};

function MenuButton({ isOpen, onClick }: MenuButtonProps) {
  const toggle = () => {
    onClick(!isOpen);
  };

  return (
    <div
      className={isOpen ? styles.active : ''}
      onClick={toggle}
      role="presentation"
      onKeyDown={() => {}}
    >
      <div className={styles.menu_button}>
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </div>
    </div>
  );
}

type MobileHeaderProps = {
  toggleCurrencyModal: Function;
  isDark?: boolean;
  currencySymbolNative: string;
  userId: string;
  onUpdateUserId: Function;
};

export function MobileHeader({
  isDark = false,
  toggleCurrencyModal,
  currencySymbolNative,
  userId,
  onUpdateUserId,
}: MobileHeaderProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const [userProfilePicture, setUserProfilePicture] = useState<string>('');

  useEffect(() => {
    const userProfilePicture = getPlannetUserProfilePictureFromLocalStorage();
    const userId = getPlannetUserIdFromLocalStorage();
    onUpdateUserId(userId);
    setUserProfilePicture(
      userProfilePicture !== 'undefined' ? userProfilePicture : '',
    );
  }, []);

  useEffect(() => {
    if (isOpen) {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;
      window.onscroll = function () {
        window.scrollTo(scrollLeft, scrollTop);
      };
    } else {
      window.onscroll = function () {};
    }
  }, [isOpen]);

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
    <div className="flex lg:hidden p-5">
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
      <MenuButton isOpen={isOpen} onClick={toggle} />
      {isOpen && (
        <div className="absolute justify-center flex flex-col bg-white w-full h-full left-0 top-0 z-20">
          {' '}
          <div className="flex flex-col mx-auto text-center">
            <Link href="/">
              <div className="w-44 h-12 relative mx-auto mb-5">
                <Image
                  loading="lazy"
                  src="/assets/images/header/black_plannet.svg"
                  alt="plannet"
                  fill
                />
              </div>
            </Link>
            <Link
              href="/planner/about"
              className="text-black text-3xl font-bold my-2.5"
            >
              Our Planners
            </Link>
            <Link
              href="/planner"
              className="text-black text-3xl font-bold my-2.5"
            >
              Become a Planner
            </Link>
            <Link
              href="/careers"
              className="text-black text-3xl font-bold my-2.5"
            >
              Careers
            </Link>
            <Link
              href="/contact"
              className="text-black text-3xl font-bold my-2.5"
            >
              Contact
            </Link>
            {!userProfilePicture ? (
              <Link
                href="/signin"
                className="text-black text-3xl font-bold my-2.5"
              >
                Login
              </Link>
            ) : (
              <Link
                href="/home"
                className="text-black text-3xl font-bold my-2.5"
              >
                Home
              </Link>
            )}
            {userId && (
              <div>
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
                        userData.user && userData.user != undefined &&
                        userData.user.firstName != null && (
                          <span
                            className="absolute rounded w-[45px] h-[45px] flex items-center  bg-black text-white  text-center justify-center align-center"
                            style={{ marginTop: '11px' }}
                          >
                            {userData.user.firstName.charAt(0).toUpperCase()}
                          </span>
                        )
                      )}
                    </div>
                  </Menu.Button>
                  <Menu.Items className="mt-2 fixed left-1/4 w-1/2 rounded-md bg-white shadow-lg">
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
            )}
            <button
              onClick={() => toggleCurrencyModal(true)}
              className="bg-black text-white underline-offset-4 underline flex rounded-lg text-xl max-w-[90px] w-full mx-auto justify-center py-1 my-5"
              type="button"
            >
              <div className="mr-2">{currencySymbolNative}</div>
              <div className="w-5 h-3 relative my-auto">
                <Image
                  src="/assets/images/header/down.svg"
                  alt="down"
                  fill
                  loading="lazy"
                />
              </div>
            </button>
            {!userId && (
              <Link
                href="/signup"
                className="text-2xl text-white bg-primary color-white py-4 px-10 rounded-lg"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
