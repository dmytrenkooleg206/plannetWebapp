import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

import Modal from '@/components/Modals/Modal';

import { selectors } from '@/store/user/user.slice';

import { getFormattedDate } from '@/lib/utils';

import { useOutsideAlerter } from '@/hooks/useOutsideAlert';

import styles from './CityAnswer.module.scss';

type CityAnswerProps = {
  cities: any[];
  onAddCity: Function;
  onChangeCity: Function;
  onDeleteCity: Function;
  onChangeDate: Function;
  time: string;
};
export default function CityAnswer({
  cities,
  onAddCity,
  onChangeCity,
  onDeleteCity,
  onChangeDate,
  time,
}: CityAnswerProps) {
  const wrapperRef = useRef(null);
  const user = useSelector(selectors.user);
  const [showCitiesDropDown, setShowCitesDropDown] = useState<number>(-1);

  useOutsideAlerter(wrapperRef, () => {
    setShowCitesDropDown(-1);
  });

  const isAddDestination = () => {
    for (let i = 0; i < cities.length; i += 1)
      if (cities[i].startDate) return false;
    return true;
  };

  const renderCityDropDown = (city: any, index: number) => {
    return (
      <div className="bg-gray-158 py-5 px-4 rounded-lg shadow-lg">
        <div
          className={styles.option}
          onClick={() => {
            onChangeCity(city.key);
            setShowCitesDropDown(-1);
          }}
          role="presentation"
        >
          <img
            src="/assets/images/onboarding/change_location.svg"
            alt="change"
          />
          <div className="text-lg md:text-2xl text-black">
            Change Destination
          </div>
        </div>
        {city.startDate ? (
          <div
            className={styles.option}
            onClick={() => {
              onChangeDate(city.key);
              setShowCitesDropDown(-1);
            }}
            role="presentation"
          >
            <img src="/assets/images/onboarding/change_date.svg" alt="date" />
            <div className="text-lg md:text-2xl text-black">Change Date</div>
          </div>
        ) : null}
        {index === 0 && cities.length === 1 ? null : (
          <div
            className={styles.option}
            onClick={() => {
              onDeleteCity(city.key);
              setShowCitesDropDown(-1);
            }}
            role="presentation"
          >
            <img src="/assets/images/onboarding/delete.svg" alt="delete" />
            <div className="text-lg md:text-2xl text-red">
              Delete Destination
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.cities_answer}>
      {cities.map((city, index) => {
        return (
          <div className={styles.answer} key={city.key}>
            <div className={styles.answer_block}>
              <div className={styles.block_cities_answer}>
                <div className={styles.city}>
                  <img
                    className={styles.image_city}
                    src={`${city.photoUrl_CF}_360`}
                    alt={city.name}
                  />
                  <div className={styles.city_detail}>
                    <div className={styles.text_city_name}>{city.name}</div>
                    <div className={styles.text_country_name}>
                      {city.country}
                    </div>
                  </div>
                  <div className="ml-auto relative">
                    <div
                      className="cursor-pointer relative"
                      role="presentation"
                      onClick={() => setShowCitesDropDown(index)}
                    >
                      <img
                        src="/assets/images/onboarding/dropdown.png"
                        alt="dropdown"
                      />
                    </div>
                    {index === showCitiesDropDown && (
                      <div ref={wrapperRef}>
                        <div className="hidden md:flex absolute z-10 right-0 w-[320px] truncate">
                          {renderCityDropDown(city, index)}
                        </div>
                        <div className="flex md:hidden">
                          <Modal onClose={() => setShowCitesDropDown(-1)}>
                            {renderCityDropDown(city, index)}
                          </Modal>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {city.startDate ? (
                  <div className={styles.text_range}>
                    {`${getFormattedDate(city.startDate)} - ${getFormattedDate(
                      city.endDate,
                    )}`}
                  </div>
                ) : null}
                {isAddDestination() && cities.length - 1 === index && (
                  <div
                    className={styles.text_add}
                    role="presentation"
                    onClick={() => onAddCity()}
                  >
                    <img src="/assets/images/onboarding/plus.svg" alt="plus" />
                    <div>Add Destination</div>
                  </div>
                )}
              </div>
              <div className={styles.text_time}>{time}</div>
            </div>
            <img
              className={styles.image_avatar}
              src={
                user?.profilePictureUrl_CF
                  ? `${user.profilePictureUrl_CF}_720`
                  : '/assets/images/planneritem/profile_placeholder.png'
              }
              alt=""
            />
          </div>
        );
      })}
    </div>
  );
}
