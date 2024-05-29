import { useState } from 'react';
import { SelectLocationModal } from '@/components/Modals/SelectLocationModal';

type AddDestinationButtonProps = {
  isUpdate?: boolean;
  onAddDestination: Function;
};
export default function AddDestinationButton({
  isUpdate = false,
  onAddDestination,
}: AddDestinationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddDestination = (city: any) => {
    onAddDestination(city);
  };
  return (
    <>
      <button
        className="bg-primary p-2 md:p-4 flex rounded-lg w-full"
        type="button"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="bg-black-500 px-2 py-3 rounded-md w-12 h-12">
          <img
            className="m-auto"
            src="/assets/images/dashboard/location.svg"
            alt="location"
          />
        </div>
        <div className="text-base md:text-xl my-auto ml-3">
          Add Other Destination
        </div>
      </button>
      <SelectLocationModal
        isDark
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onAddCity={handleAddDestination}
      />
    </>
  );
}
