import { useState } from 'react';
import Image from 'next/image';
import { FaRegCircle, FaRegCircleDot } from 'react-icons/fa6';
import { useRouter } from 'next/router';
import { cardsIcon } from '@/lib/utils';
import styles from './index.module.scss';
import MasterCardIcon from './images/master.svg';

type PaymentCardListsProps = {
  cards: any;
  selectedCard: any;
  defaultCard: any;
  setSelectedCard: Function;
};

export default function PaymentCardLists({
  cards,
  selectedCard,
  defaultCard,
  setSelectedCard,
}: PaymentCardListsProps) {
  const router = useRouter();

  // const handleClickAddnew = () => {

  // }
  return (
    <div className={styles.innerContent}>
      <h1 className="text-white text-[30px] max-sm:text-[24px] font-[700] text-center mb-[25px]">
        Select Payment Methods
      </h1>
      <div className="flex flex-col gap-[20px] max-sm:gap-[10px]">
        {cards.map((item: any, index: number) => (
          <div
            className={`flex items-center cursor-pointer gap-[15px] justify-between p-[15px_20px] max-sm:p-[15px] w-full rounded-[8px] bg-[#FFFFFF1A] border ${
              item.id === selectedCard
                ? 'border-[#FFFFFF]'
                : 'border-[#FFFFFF26]'
            }`}
            onClick={() => setSelectedCard(item.id)}
            key={index}
          >
            <img
              src={
                cardsIcon.filter((icon) => icon.brand === item.card.brand)[0]
                  ?.icon
              }
              width={40}
              height={25}
              alt="card ison"
            />
            <div className="flex flex-col w-[calc(100%-120px)] gap-10px">
              <p className="flex capitalize gap-[5px] text-white text-[24px] max-sm:text-[21px] font-[500]">
                {item.card.brand} card
                {defaultCard && defaultCard === item.id && (
                  <span className="bg-[#FFFFFF26] rounded-[3px] p-[3px_4px] text-[16px] font-[400] mb-0 items-center w-fit h-fit">
                    Primary
                  </span>
                )}
              </p>
              <p className="flex items-center gap-[5px] items-center text-[16px] text-[#FFFFFFB2] font-[400]">
                Expires {item.card.exp_month}/
                {item.card.exp_year.toString().slice(-2)}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="4"
                  height="5"
                  viewBox="0 0 4 5"
                  fill="none"
                >
                  <circle cx="2" cy="2.5" r="2" fill="white" />
                </svg>
                End {item.card.last4}
              </p>
            </div>
            <span className="text-white text-[24px]">
              {item.id === selectedCard ? <FaRegCircleDot /> : <FaRegCircle />}
            </span>
          </div>
        ))}

        <button
          className="p-[10px_20px] w-full rounded-[8px] !bg-[#FFFFFF1A] border border-[#FFFFFF26] text-white text-center text-[30px] font-[700] max-sm:text-[20px] mb-[20px]"
          onClick={() =>
            router.push({
              pathname: '/addPayment',
              query: { beforeRoute: 'checkout' },
            })
          }
        >
          Add New Payment Method
        </button>
      </div>
    </div>
  );
}
