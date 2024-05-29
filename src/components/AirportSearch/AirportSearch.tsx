import { useEffect, useState, useRef } from 'react';
import { useQuery } from 'react-query';

import Loader from '@/components/Loader/Loader';

import { useDebounce } from '@/hooks/useDebounce';
import { useOutsideAlerter } from '@/hooks/useOutsideAlert';

import { getAllAirports } from '@/api/beFlight/beFlight.service';

import styles from './AirportSearch.module.scss';

type AirportSearchProps = {
  onAirportSelect: Function;
  isLoading: boolean;
};

export default function AirportSearch({
  onAirportSelect,
  isLoading,
}: AirportSearchProps) {
  const wrapperRef = useRef(null);
  const [searchText, setSearchText] = useState<string>('');
  const [airports, setAirports] = useState<any[]>([]);
  const [filteredAirports, setFilteredAirports] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const debouncedSearchText = useDebounce(searchText, 300);

  const { isLoading: isLoadingAirports, data } = useQuery(
    'all_airports',
    getAllAirports,
    {
      staleTime: 60000,
      cacheTime: 60000,
      retry: false,
      enabled: true,
    },
  );

  useEffect(() => {
    if (!isLoadingAirports && data) {
      setAirports([...data.cities, ...data.airports]);
      setFilteredAirports([...data.cities, ...data.airports]);
    }
  }, [isLoadingAirports, data]);

  useEffect(
    () => {
      if (isLoadingAirports) return;
      if (debouncedSearchText && airports?.length) {
        setFilteredAirports(
          airports.filter((airport: any) => {
            if (airport.type === 'airport')
              return (
                airport.name
                  .toLowerCase()
                  .includes(debouncedSearchText.toLowerCase()) ||
                airport.cityName
                  ?.toLowerCase()
                  .includes(debouncedSearchText.toLowerCase())
              );
            return airport.name
              .toLowerCase()
              .includes(debouncedSearchText.toLowerCase());
          }),
        );
      } else {
        setFilteredAirports([...airports]);
        onAirportSelect(null);
      }
    },
    [debouncedSearchText], // Only call effect if debounced search term changes
  );

  useOutsideAlerter(wrapperRef, () => {
    setShowDropdown(false);
  });

  const handleSearchTextChange = (newSearch: string) => {
    if (isLoading) return;
    setSearchText(newSearch);
    if (!showDropdown) setShowDropdown(true);
  };

  const handleAirportSelect = (e: any, airport: any) => {
    e.stopPropagation();
    onAirportSelect(airport);
    setShowDropdown(false);
    if (airport.type === 'airport')
      setSearchText(`${airport.cityName}| (${airport.name})`);
    else setSearchText(`${airport.name}| (Any)`);
  };
  const renderDropdown = () => {
    if (!airports?.length) return <Loader />;
    if (!filteredAirports.length)
      return <div className={styles.no_airport}>No Airports</div>;
    return filteredAirports.slice(0, 10).map((airport) => {
      return (
        <div
          key={airport.id}
          role="presentation"
          className={styles.text_airport}
          onClick={(e: any) => handleAirportSelect(e, airport)}
        >
          {airport.name} ({airport.iataCode})
        </div>
      );
    });
  };
  return (
    <div
      className={`${styles.airport_search} ${
        showDropdown ? styles.active : ''
      }`}
      ref={wrapperRef}
    >
      {!showDropdown && (
        <div
          className={styles.button_img}
          role="presentation"
          onClick={() => setShowDropdown(true)}
        >
          <img src="/assets/images/registration/search.svg" alt="search" />
        </div>
      )}
      <input
        type="text"
        placeholder="Search airport"
        autoComplete="off"
        value={searchText}
        onChange={(e: any) => handleSearchTextChange(e.target.value)}
      />
      {showDropdown ? (
        <div className={styles.search_dropdown}>{renderDropdown()}</div>
      ) : null}
    </div>
  );
}
