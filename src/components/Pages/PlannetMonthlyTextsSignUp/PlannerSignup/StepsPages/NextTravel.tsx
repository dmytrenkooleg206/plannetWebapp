/* eslint-disable array-callback-return */
import useGoogle from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import classNames from 'classnames';
import { FaTimes } from 'react-icons/fa';
import { CiLocationOn } from 'react-icons/ci';
import { useState } from 'react';
import styles from '../index.module.scss';
import { travelOptions } from '../suggestValues';

type NextTravelProps = {
  handleChange: Function;
  handleCitiesSel: Function;
  handleCitiesDel: Function;
  selectedID: number | null;
  cities: string[];
};

export default function NextTravel({
  handleChange,
  handleCitiesSel,
  handleCitiesDel,
  selectedID,
  cities,
}: NextTravelProps) {
  //   const handleSelect = (id: number) => {
  //     handleChange(id);
  //   };

  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
    useGoogle({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP,
    });

  const [isPreLocationsShow, setIsPreLocationsShow] = useState<boolean>(false);
  const [value, setValue] = useState('');

  const handleClickCities = (city: any) => {
    handleCitiesSel(city);
    setIsPreLocationsShow(false);
    setValue('');
  };

  const handleClickCityDel = (city: any) => {
    handleCitiesDel(city);
  };

  return (
    <div className="flex-1">
      <div className={styles.innerContentTitle}>
        Where do you want to <br /> travel to next
      </div>
      <div
        className={classNames(styles.inputWrapper, styles.inputWrapperLocation)}
      >
        <div className="relative flex flex-col mt-[25px] max-sm:mt-[20px]">
          <div className="flex gap-[20px] mb-[30px] max-sm:mb-[24px]">
            {travelOptions.map((item, index) => (
              <div
                className={`flex gap-[10px] cursor-pointer items-center justify-center text-[24px] max-sm:text-[15px] font-[400] w-full h-[60px] max-sm:h-[52px] rounded-[8px] ${
                  selectedID === index
                    ? 'bg-[#FFFFFF] text-[#1F133E]'
                    : 'bg-[#FFFFFF1A] text-white'
                }`}
                onClick={() => handleChange(index)}
                key={index}
              >
                {selectedID === index ? item.selectedIcon : item.unSelectedIcon}
                {item.string}
              </div>
            ))}
          </div>
          <hr className="bg-[#FFFFFF33] text-[#FFFFFF33] mb-[30px] max-sm:mb-[24px]" />
          <h1 className="m-0 text-white text-[30px] max-sm:text-[19px] font-[500]">
            Add 3 Destinations
          </h1>
          <div>
            <div className="relative">
              <input
                className={`relative flex my-5 pl-12 max-sm:pl-[46px] pr-5 max-sm:pr-[20px]  py-4 max-sm:py-[14px] bg-[#FFFFFF1A] !font-[400] !text-white !text-[24px] placholder-[#FFFFFF80] invalid:border-pink-500 invalid:text-pink-600 rounded-lg text-2xl max-sm:text-[15px] font-light w-full outline-none `}
                placeholder="City Name"
                onChange={(evt) => {
                  getPlacePredictions({
                    input: evt.target.value,
                    types: ['locality', 'country'],
                  });
                  setValue(evt.target.value);
                  setIsPreLocationsShow(true);
                }}
                value={value}
              />
              <img
                className="absolute left-5 top-[50%] translate-y-[-50%]"
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
          {cities.length ? (
            <div className="flex flex-wrap gap-[15px] rounded-[8px] border border-[#FFFFFF33] p-[15px] mb-[20px]">
              {cities.map((city, index) => (
                <div
                  className="flex items-center justify-between bg-[#FFFFFF1A] p-[10px_15px] max-sm:p-[8px_10px] rounded-[8px] text-white text-[17px] max-sm:text-[15px] font-[400] gap-[15px]"
                  key={index}
                >
                  {city}
                  <span
                    className="cursor-pointer"
                    onClick={() => handleClickCityDel(city)}
                  >
                    <FaTimes />
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
