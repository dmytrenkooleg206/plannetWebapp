import Link from 'next/link';
import Image from 'next/image';
import { FaChevronLeft } from 'react-icons/fa';

import WhiteLogoImage from '@/../public/assets/images/footer/white_logo.png';

type DashboardHeaderProps = {
  user: any;
  onUpdate: Function;
  tripName: string;
};

export default function DashboardHeader({
  user,
  tripName,
  onUpdate,
}: DashboardHeaderProps) {
  return (
    <>
      <div className="block md:hidden px-5 py-4 bg-black flex">
        <div className="flex my-auto mr-2.5">
          <Link href="/home">
            <FaChevronLeft />
          </Link>
        </div>
        <div
          className="text-2xl py-2 px-2.5 bg-white-200 rounded-md border border-white-300 w-full"
          onClick={() => onUpdate()}
          role="presentation"
        >
          {tripName}
        </div>
        <div className="flex my-auto ml-2.5">
          <Image
            className="w-12"
            src="/assets/images/dashboard/chat.svg"
            alt="chat"
            width={48}
            loading="lazy"
            height={48}
          />
        </div>
      </div>
      <div className="hidden md:block border-solid border-b border-white-150 flex py-5">
        <div className="max-w-[1440px] mx-auto px-7 flex">
          <Link href="/">
            <Image
              src={WhiteLogoImage}
              alt="plannet"
              loading="lazy"
              style={{ width: '170px', height: 'auto' }}
              // priority
            />
          </Link>
          <div className="ml-auto w-12 h-12 bg-white-200 rounded flex items-center">
            <Image
              className="flex mx-auto"
              src="/assets/images/dashboard/notification.svg"
              alt="notification"
              width={28}
              height={28}
              loading="lazy"
            />
          </div>
          <div className="w-12 h-12 rounded flex items-center ml-2.5 relative">
            {user && user.profilePictureUrl_CF ? (
              <Image
                className="rounded flex mx-auto"
                loading="lazy"
                width={48}
                height={48}
                src={
                  user?.profilePictureUrl_CF
                    ? `${user.profilePictureUrl_CF}_720`
                    : '/assets/images/planneritem/profile_placeholder.png'
                }
                alt="avatar"
              />
            ) : (
              <span />
            )}
            <div className="w-2.5 h-2.5 border border-white absolute bg-primary rounded-full top-0 right-0" />
          </div>
        </div>
      </div>
    </>
  );
}
