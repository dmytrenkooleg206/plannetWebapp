import { useRouter } from 'next/router';
import React from 'react';
import { FaChevronRight } from 'react-icons/fa';

export default function RightButton({ isOpen, url }: any) {
  const router = useRouter();
  return (
    <>
        <button
          className="bg-white rounded-full w-8 h-8 inline-flex justify-center items-center"
          onClick={() => router.push(url)}
        >
          <FaChevronRight className="text-gray text-xl" />
        </button>
    </>
  );
}
