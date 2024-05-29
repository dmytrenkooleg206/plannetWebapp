import React, { MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AudioButton from './AudioButton';
import styles from './index.module.scss';
// IMAGES
import Check from './images/check.svg';
import linkButton from '../../../PlannetMonthlyTexts/images/monthlyLink.svg';

type PlannerItemProps = {
  index: number;
  idstr: string;
  planner: any;
  city: any;
  onOpenDownloadModal: Function;
  audioUrl: string;
  playingId?: string;
  onAudioChange: Function;
  isCheck: boolean;
  isLink: boolean;
};

export default function PlannerItem({
  index = 0,
  planner,
  idstr = '',
  playingId = '',
  city,
  audioUrl,
  onOpenDownloadModal,
  onAudioChange,
  isLink = false,
  isCheck = true,
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
        <img
          className={styles.imagePlanner}
          src={
            planner?.profilePictureUrl_CF
              ? `${planner?.profilePictureUrl_CF}_720`
              : '/assets/images/planneritem/profile_placeholder.png'
          }
          alt="check"
        />
      </div>
      <div className={styles.itemInfo}>
        <div>
          <div className={styles.plannerName}>
            {planner.firstName}
            {isCheck && (
              <span className={styles.check}>
                <Image src={Check} alt="check icon" />
              </span>
            )}
          </div>
          <div className={styles.plannerLocation}>{generateHomeBase()}</div>
          <div className={styles.plannerDescription}>{planner.title}</div>
        </div>
        <div className={styles.audioButton}>
          {isLink ? (
            <div className="bg-[#160E2C] rounded-full lg:h-[30px] lg:w-[30px] md:h-[30px] md:w-[30px] flex items-center justify-center">
              <Link href="https://plannet.io/summary-details/landing/144a41e9-4a7c-4e7e-9bf8-a404407faf02">
                <Image
                  src={linkButton}
                  width={20}
                  height={20}
                  alt="linkBottton"
                />
              </Link>
            </div>
          ) : (
            <>
              {audioUrl && (
                <AudioButton
                  audioUrl={audioUrl}
                  playingId={playingId}
                  plannerId={planner.id}
                  onAudioChange={onAudioChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
