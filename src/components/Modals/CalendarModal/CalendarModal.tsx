import { useEffect, useState } from 'react';
import Modal from '@/components/Modals/Modal';
import Button from '@/components/Button/Button';
import PNCalendar from '@/components/PNCalendar/PNCalendar';

type CalendarModalProps = {
  onClose: Function;
  isOpen: boolean;
  cities: any[];
  onAddRange: Function;
  onGoToQuestion: Function;
  onUpdateRange: Function;
  modalType: number;
  selectedCityKey: string;
};

export default function CalendarModal({
  onClose,
  isOpen,
  cities: pCities,
  onAddRange,
  onGoToQuestion,
  onUpdateRange,
  modalType,
  selectedCityKey,
}: CalendarModalProps) {
  const [cityIndex, setCityIndex] = useState(0);
  const [range, setRange] = useState<any>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    if (selectedCityKey && cities.length) {
      const selectedIndex = cities.findIndex(
        (item: any) => item.key === selectedCityKey,
      );
      if (selectedIndex >= 0) setCityIndex(selectedIndex);
    }
  }, [selectedCityKey]);

  useEffect(() => {
    if (pCities.length) {
      setCities([...pCities]);
    }
    setCityIndex(0);
  }, [pCities]);

  if (!isOpen) return null;

  const handleClose = () => {
    setRange([]);
    setCityIndex(0);
    onClose();
  };

  const handleAddRange = () => {
    if (!range.length) return;
    if (modalType) {
      onUpdateRange(
        {
          startDate: range[0],
          endDate: range[1],
        },
        modalType === 1 ? -1 : cityIndex,
      );
      handleClose();
      return;
    }
    onAddRange(cityIndex, {
      startDate: range[0],
      endDate: range[1],
    });
    if (!cities.length || cityIndex + 1 === cities.length) {
      onGoToQuestion('number_guests');
      handleClose();
    } else {
      setRange([]);
      setCityIndex(cityIndex + 1);
    }
  };

  return (
    <Modal
      size="md"
      animation="slideInTop"
      onClose={() => {
        if (!modalType && cities.length > cityIndex) return;
        handleClose();
      }}
    >
      <div className="p-5 md:py-12 md:px-10">
        {cities.length ? (
          <div className="flex mb-7 rounded-md bg-white p-2.5">
            <img
              className="rounded-md my-auto flex w-16 h-16"
              src={`${cities[cityIndex].photoUrl_CF}_360`}
              alt={cities[cityIndex].name}
            />
            <div className="flex flex-col ml-4 justify-center">
              <div className="text-2xl">{cities[cityIndex].name}</div>
              <div className="text-xl opacity-60">
                {cities[cityIndex].country}
              </div>
            </div>
          </div>
        ) : null}
        <div className="flex justify-center">
          <PNCalendar
            onChange={(range: any) => setRange(range)}
            range={range}
          />
        </div>
        <div
          className="text-xl font-bold text-right cursor-pointer my-5"
          role="presentation"
          onClick={() => setRange([])}
        >
          CLEAR
        </div>
        <Button
          text="Done"
          onClick={() => handleAddRange()}
          isDisabled={range.length === 0}
        />
      </div>
    </Modal>
  );
}
