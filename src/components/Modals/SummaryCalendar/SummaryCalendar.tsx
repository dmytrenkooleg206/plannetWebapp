import Button from '@/components/Button/Button';
import SMCalendar from '@/components/SummaryCalendar/SummaryCalendar';
import { useRouter } from 'next/router';
import React from 'react';

export default function SummaryCalendar({
  isOpen,
  setIsOpen,
  range,
  setRange,
  handleUpdateDate,
  setShowModalPage,
}: any) {
  const router = useRouter();

  const handleCloseModal = () => {
    if (router.query.startDate && router.query.startDate != '') {
      setRange([router.query.startDate, router.query.endDate]);
    } else {
      setRange([]);
    }

    setIsOpen(false);
    setShowModalPage(false);
  };

  if (!isOpen) return null;
  return (
    <div className="bg-[#1F133E] min-h-[100dvh] text-white px-5 py-7 md:px-8 w-full fixed top-0 left-0 z-50">
      <div className="relative summary-calender rounded-none max-w-[380px] mx-auto">
        <div className="flex justify-between mb-3">
          <h2 className="text-lg">When</h2>
          <button className="underline" onClick={handleCloseModal}>
            Cancel
          </button>
        </div>
        <div className="flex justify-center">
          <SMCalendar
            onChange={(range: any) => setRange(range)}
            range={range}
          />
        </div>
        <div className="mt-10 w-full left-0 ">
          <Button
            weight="700"
            color="navy"
            text={
              router.query.startDate && router.query.startDate != ''
                ? 'Save changes'
                : 'Continue'
            }
            onClick={handleUpdateDate}
            isDisabled={range.length === 0}
          />
        </div>
      </div>
    </div>
  );
}
