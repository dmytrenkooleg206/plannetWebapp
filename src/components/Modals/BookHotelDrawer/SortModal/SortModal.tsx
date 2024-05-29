import PNModal from '../../PNModal';

type SortModalProps = {
  isOpen: boolean;
  sortBy: string;
  onClose: Function;
  onChange: Function;
};
export default function SortModal({
  isOpen,
  sortBy,
  onClose,
  onChange,
}: SortModalProps) {
  return (
    <PNModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="texl-xl md:text-3xl mb-5">Sort By</div>
      <label htmlFor="best" className="flex cursor-pointer mb-3">
        <input
          id="best"
          type="radio"
          value="best"
          name="sortBy"
          checked={sortBy === 'best'}
          className="mt-0.5 relative h-6 w-6 appearance-none rounded-full border-2 border-solid border-white-300 checked:border-green checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-green checked:after:bg-green checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)]"
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="text-lg md:text-2xl my-auto ml-4">Best</div>
      </label>
      <label htmlFor="price_increasing" className="flex cursor-pointer mb-3">
        <input
          id="price_increasing"
          type="radio"
          value="price_increasing"
          name="sortBy"
          checked={sortBy === 'price_increasing'}
          className="mt-0.5 relative h-6 w-6 appearance-none rounded-full border-2 border-solid border-white-300 checked:border-green checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-green checked:after:bg-green checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)]"
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="text-lg md:text-2xl my-auto ml-4">$ - $$$</div>
      </label>
      <label htmlFor="price_decreasing" className="flex cursor-pointer mb-3">
        <input
          id="price_decreasing"
          type="radio"
          value="price_decreasing"
          name="sortBy"
          checked={sortBy === 'price_decreasing'}
          className="mt-0.5 relative h-6 w-6 appearance-none rounded-full border-2 border-solid border-white-300 checked:border-green checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-green checked:after:bg-green checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)]"
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="text-lg md:text-2xl my-auto ml-4">$$$ - $</div>
      </label>
      <label htmlFor="distance" className="flex cursor-pointer mb-3">
        <input
          id="distance"
          type="radio"
          value="distance"
          name="sortBy"
          checked={sortBy === 'distance'}
          className="mt-0.5 relative h-6 w-6 appearance-none rounded-full border-2 border-solid border-white-300 checked:border-green checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-green checked:after:bg-green checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)]"
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="text-lg md:text-2xl my-auto ml-4">
          Distance to City Center
        </div>
      </label>
    </PNModal>
  );
}
