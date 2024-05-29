import { useState } from 'react';
import classNames from 'classnames';
import Autocomplete from 'react-google-autocomplete';
import useGoogle from 'react-google-autocomplete/lib/usePlacesAutocompleteService';

import { CiLocationOn } from 'react-icons/ci';
import styles from '../index.module.scss';

type CityProps = {
  city: string;
  handleCreateCity: Function;
};

export default function City({ city, handleCreateCity }: CityProps) {
  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
    useGoogle({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP,
    });
  const [isPreLocationsShow, setIsPreLocationsShow] = useState<boolean>(false);
  const [value, setValue] = useState('');

  const handleClickCities = (city: any) => {
    handleCreateCity(city);
    setIsPreLocationsShow(false);
    setValue(city.description);
  };

  return (
    <div className="flex-1">
      <div className={styles.innerContentTitle}>Enter your home base</div>
      <div
        className={classNames(
          styles.innerContentSubtitle,
          'max-sm:w-[205px] mx-auto',
        )}
      >
        This is the city you will be planning trips for.
      </div>
      <div className={styles.inputWrapper}>
        <div>
          <div className="relative">
            <input
              className={` flex my-5 pl-12 max-sm:pl-[46px] pr-5 max-sm:pr-[20px]  py-4 max-sm:py-[14px] bg-[#FFFFFF1A] !font-[400] !text-white placholder-[#FFFFFF80] invalid:border-pink-500 invalid:text-pink-600 rounded-lg text-2xl max-sm:text-[15px] font-light w-full outline-none `}
              placeholder="City Name"
              onChange={(evt) => {
                getPlacePredictions({ input: evt.target.value });
                setValue(evt.target.value);
                setIsPreLocationsShow(true);
              }}
              value={value}
            />
            <img
              className="absolute left-5 !top-[50%] translate-y-[-50%] max-sm:w-[16px]"
              src="/assets/images/registration/search.svg"
              alt="search"
            />
          </div>
          {!isPlacePredictionsLoading && isPreLocationsShow && (
            <div className="flex flex-col w-full">
              {placePredictions.map((item, index) => (
                <div
                  className={styles.locationItem}
                  key={index}
                  onClick={() => handleClickCities(item)}
                >
                  <span className={styles.locationIcon}>
                    <CiLocationOn />{' '}
                  </span>
                  <span className={styles.locationDash}>- </span>
                  {item.description}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
