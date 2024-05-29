import React, { useEffect, useState } from 'react';
import { getFormattedDate } from '@/lib/utils';
import ClipLoader from 'react-spinners/ClipLoader';
import styles from '../../../SplashScreen/SplashScreen.module.scss';

export default function LoadingAfterDateChange({
  isOpen,
  range,
  tripData,
  isPriceFound,
  setAfterDateChangeLoader,
  setShowModalPage,
}: any) {
  const messages = [
    'Checking Hotel Prices',
    'Checking Experience Prices',
    'Confirming your local concierge',
  ];

  const [msgIdx, setMsgIdx] = useState<number>(0);
  const handleLoaderHide = () => {
    setAfterDateChangeLoader(false);
    setShowModalPage(false);
  };

  useEffect(() => {
    if (isOpen) {
      if (msgIdx >= messages.length + 1) {
        setMsgIdx(0);
        handleLoaderHide();
      } else {
        setTimeout(() => {
          setMsgIdx(msgIdx + 1);
        }, 2000);
      }
    }
  }, [msgIdx, isOpen]);

  if (!isOpen) return null;
  return (
    <div className="bg-[#1F133E] min-h-[100dvh] text-center text-white px-5 py-7 md:px-8 w-full fixed top-0 left-0 z-50 flex flex-col justify-between py-8">
      <div className="w-full p-4 grow flex items-center">
        <div className="w-full">
          <p className="text-[24px]">
            <span className="font-bold text-[40px] leading-[40px]">
              {tripData?.tripLegs[0]?.City?.name}
              {tripData?.tripLegs[0]?.City?.country != ''
                ? `, ` + tripData?.tripLegs[0]?.City?.country
                : ''}
            </span>
            <br />
            {range.length >= 2 &&
              `${getFormattedDate(range[0])} - ${getFormattedDate(range[1])}`}
          </p>
          <img
            className="mx-auto rounded-[15px] mt-6 border border-4 border-white"
            alt=""
            width={220}
            height={220}
            src={
              tripData?.tripLegs[0]?.City?.photoUrl ||
              '/assets/images/summary/city-plchldr.png'
            }
          />
          {msgIdx < messages.length && (
            <div className="flex w-[220px] mx-auto mt-[24px] gap-2">
              <div className={`${styles.block_loader} text-white`}>
                <ClipLoader
                  className={`${styles.loader} ${styles['white']}`}
                  size={50}
                  speedMultiplier={0.5}
                />
              </div>
              <p className="text-[20px] text-left">{messages[msgIdx]}</p>
            </div>
          )}
        </div>
      </div>
      {isPriceFound && (
        <div className="w-full px-4">
          <button
            className={`block bg-white text-[#1f133e] py-3 w-full font-bold text-[20px] rounded-lg ${
              !isPriceFound && 'opacity-25'
            }`}
            disabled={!isPriceFound}
            onClick={handleLoaderHide}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
