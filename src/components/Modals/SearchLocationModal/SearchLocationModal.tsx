import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { FaSearch } from 'react-icons/fa';
import { useDebounce } from '@/hooks/useDebounce';
import { getAllAirports } from '@/api/beFlight/beFlight.service';
import { QUERY_OPTION } from '@/lib/constants';
import PNModal from '../PNModal';

type SearchLocationModalProps = {
  onClose: Function;
  isOpen: boolean;
  title: string;
  onLocationSelect: Function;
};

export default function SearchLocationModal({
  onClose,
  isOpen,
  title = '',
  onLocationSelect,
}: SearchLocationModalProps) {
  const [searchText, setSearchText] = useState<string>('');
  const [locations, setLocations] = useState<any[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<any[]>([]);
  const debouncedSearchText = useDebounce(searchText, 300);

  const { isLoading, data } = useQuery(
    'all_airports',
    getAllAirports,
    QUERY_OPTION,
  );

  useEffect(() => {
    if (!isLoading && data) {
      setLocations([...data.cities, ...data.airports]);
      setFilteredLocations([...data.cities, ...data.airports]);
    }
  }, [isLoading, data]);

  useEffect(
    () => {
      if (isLoading) return;
      if (debouncedSearchText && locations?.length) {
        setFilteredLocations(
          locations.filter((location: any) => {
            if (location.type === 'airport')
              return (
                location.name
                  .toLowerCase()
                  .includes(debouncedSearchText.toLowerCase()) ||
                location.cityName
                  ?.toLowerCase()
                  .includes(debouncedSearchText.toLowerCase())
              );
            return location.name
              .toLowerCase()
              .includes(debouncedSearchText.toLowerCase());
          }),
        );
      } else {
        setFilteredLocations([]);
      }
    },
    [debouncedSearchText], // Only call effect if debounced search term changes
  );

  const handleSearchTextChange = (newSearch: string) => {
    setSearchText(newSearch);
  };

  const handleClose = () => {
    setSearchText('');
    setFilteredLocations([]);
    onClose();
  };

  return (
    <PNModal isOpen={isOpen} onClose={handleClose}>
      <div className="px-2 md:px-4">
        <div className="text-medium text-xl md:text-3xl mb-5">{title}</div>
        <div className="flex flex-row bg-black border border-white-300 py-3 px-5 rounded-md">
          <FaSearch className="text-2xl my-auto text-white-700 mr-3" />
          <input
            className="w-full bg-black outline-none text-lg md:text-2xl"
            placeholder="Search airport"
            autoComplete="off"
            value={searchText}
            onChange={(e: any) => handleSearchTextChange(e.target.value)}
          />
        </div>
      </div>
      <div className="h-96 overflow-y-auto mt-5">
        {filteredLocations.slice(0, 10).map((location) => {
          const { id, name, cityName, countryName, iataCode } = location;
          return (
            <button
              key={id}
              type="button"
              className="w-full rounded-md border border-gray-113 hover:border-blue text-left"
              onClick={() => onLocationSelect(location)}
            >
              <div className="p-2 md:p-4">
                <div className="text-lg md:text-2xl truncate">
                  {name} ({location.type === 'airport' ? iataCode : 'Any'})
                </div>
                <div className="text-base md:text-lg text-white-600">
                  {location.type === 'airport' ? cityName : name}, {countryName}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </PNModal>
  );
}
