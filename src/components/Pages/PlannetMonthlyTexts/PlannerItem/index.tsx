import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import styles from './index.module.scss';
// IMAGES
import linkButton from '../images/pin.svg';

type PlannerItemProps = {
  index: number;
  idstr: string;
  planner: any;
  city: any;
  onOpenDownloadModal: Function;
};

export default function PlannerItem({
  index = 0,
  planner,
  idstr = '',
  city,
  onOpenDownloadModal,
}: PlannerItemProps) {
  const generateHomeBase = () => {
    let cityName: string = 'N/A';
    let countryName: string = 'N/A';
    if (planner.HomeBase) {
      cityName = planner.HomeBase?.namme;
      countryName = planner.HomeBase?.country;
    } else if (city) {
      cityName = city.name;
      countryName = city.country;
    }
    const num = 23;
    if (cityName && cityName.length > 15) {
      return cityName;
    }

    const str = `${cityName}, ${countryName}`;
    if (str.length > num) {
      return `${str.slice(0, num - 1)}...`;
    }
    return str;
  };

  return (
    <div
      className={styles.item}
      onClick={() => onOpenDownloadModal()}
      role="presentation"
    >
      <div className={styles.imageWrapper}>
        <Image
          src={planner.image}
          className={styles.imagePlanner}
          alt="check"
          priority
        />
      </div>
      <div className={styles.itemInfo}>
        <div>
          <div className={styles.plannerName}>{planner.firstName}</div>
          <div className={styles.plannerLocation}>{generateHomeBase()}</div>
          <div className={styles.plannerDescription}>{planner.title}</div>
        </div>
        {/* <div className={styles.audioButton}>
          <div className="bg-[#160E2C] rounded-full lg:h-[30px] lg:w-[30px] md:h-[30px] md:w-[30px] max-sm:w-[24px] max-sm:h-[24px] max-sm:p-[4px] flex items-center justify-center">
            <Link
              href="https://plannet.io/summary-details/landing/144a41e9-4a7c-4e7e-9bf8-a404407faf02"
              target="_blank"
            >
              <Image
                src={linkButton}
                width={20}
                height={20}
                alt="linkBottton"
              />
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
}
