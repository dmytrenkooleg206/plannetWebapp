import Loader from '@/components/Loader/Loader';
import Image from 'next/image';

export default function LoadingTrip() {
  return (
    <div className="h-[100dvh] w-full  bg-[#1F133E] text-white ">
      <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-full p-6 text-center">
        <Loader color="#fff" />
      </div>
    </div>
  );
}
