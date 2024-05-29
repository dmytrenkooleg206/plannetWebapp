import { useEffect, useState } from 'react';
import PNCalendar from '@/components/PNCalendar/PNCalendar';

import Button from '@/components/Button/Button';
import PNModal from '../PNModal';

type EditDateModalProps = {
  isOpen: boolean;
  city?: any;
  dates: any;
  onUpdate: Function;
  onClose: Function;
};

const dateAsLocalTimezone = (date: string) => {
  const res = new Date();
  const [year, month, day] = date.split('-').map((x) => parseInt(x, 10));
  res.setFullYear(year);
  res.setMonth(month - 1);
  res.setDate(day);
  return res;
};

export default function EditDateModal({
  onClose,
  onUpdate,
  isOpen,
  dates,
  city = null,
}: EditDateModalProps) {
  const [range, setRange] = useState<any>([]);

  useEffect(() => {
    if (dates.startDate && dates.endDate)
      setRange([
        dateAsLocalTimezone(dates.startDate),
        dateAsLocalTimezone(dates.endDate),
      ]);
  }, [dates]);

  const handleClose = () => {
    setRange([]);
    onClose();
  };

  const handleUpdateDate = async () => {
    if (!range.length) return;
    onUpdate(range);
    handleClose();
  };

  const getImage = () => {
    return city.photoUrl ? city.photoUrl : `${city.photoUrl_CF}_360`;
  };

  return (
    <PNModal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-lg">
      {city && (
        <div className="flex border border-white-300 rounded px-2 py-1 mb-3">
          <img
            className="w-14 h-14 rounded my-auto"
            src={`${getImage()}`}
            alt={city.name}
          />
          <div className="flex flex-col justify-between ml-4">
            <div className="text-lg md:text-2xl">{city.name}</div>
            <div className="text-base md:text-xl opacity-60">
              {city.country}
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center">
        <PNCalendar
          onChange={(range: any) => setRange(range)}
          range={range}
          isDark
        />
      </div>
      <div
        className="text-lg font-bold text-right cursor-pointer select-none mb-7"
        role="presentation"
        onClick={() => setRange([])}
      >
        CLEAR
      </div>
      <Button
        text="Done"
        onClick={handleUpdateDate}
        isDisabled={range.length === 0}
      />
    </PNModal>
  );
}
