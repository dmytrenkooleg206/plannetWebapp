import { useEffect, useState } from 'react';
import SignUpFooter from '@/components/layouts/MainLayout/SignUpFooter';
import Link from 'next/link';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import { BsThreeDots } from 'react-icons/bs';
import { cardsIcon } from '@/lib/utils';
import CalendarBtn from '../images/calendarBtn.svg';
import CardIcon from '../images/card.svg';
import TrashIcon from '../images/trash.svg';
import styles from './index.module.scss';

type CongratesProps = {
  setIsAdded: Function;
  setCardAction: Function;
  setSelectedCard: Function;
  setAskModalShow: Function;
  setIsLoading: Function;
  fetchCards: Function;
  selectedCardItem: any;
  cards: any;
  defaultCard: any;
};

export default function Congrates({
  setIsAdded,
  setSelectedCard,
  setCardAction,
  setAskModalShow,
  selectedCardItem,
  setIsLoading,
  cards,
  fetchCards,
  defaultCard,
}: CongratesProps) {
  const isMobile = useMediaQuery({
    query: '(min-width: 768px)',
  });
  const [isMoreShow, setIsMoreShow] = useState(false);
  const handleSetPrimary = () => {
    setCardAction('primary');
    setAskModalShow(true);
  };

  const handleCardDel = () => {
    setCardAction('delete');
    setAskModalShow(true);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <>
      <div className={styles.form}>
        <div className={styles.innerContentCongrate}>
          <div className={styles.calendar}>
            <Image
              src={CalendarBtn}
              width={isMobile ? 100 : 80}
              alt="calendar"
            />
          </div>
          <p className={styles.congrateMsg}>
            Payment Method has <br />
            been successful added
          </p>
          <p className={styles.subMSg}>
            {cards.length && `${cards[0].card.brand} ${cards[0].card.last4}`}{' '}
            has been added to your account.
          </p>
        </div>
        <div className="flex flex-col mt-[60px] max-sm:mt-[40px] gap-[20px] mb-[46px]">
          <h3 className="text-white text-center text-[30px] max-sm:text-[24px] font-[500] mb-[5px]">
            Manage Payment Methods
          </h3>
          {cards.length ? (
            cards.map((item: any, index: number) => (
              <div
                className="flex items-center gap-15px] justify-between capitalize p-[15px_20px] w-full rounded-[8px] bg-[#FFFFFF1A] border border-[#FFFFFF26]"
                key={index}
              >
                <img
                  src={
                    cardsIcon.filter(
                      (card) => card.brand === item.card.brand,
                    )[0]?.icon
                  }
                  width={40}
                  height={25}
                  alt="card ison"
                />
                <div className="flex flex-col w-[calc(100%-120px)] gap-10px">
                  <p className="flex gap-[5px] text-white text-[24px] max-sm:text-[21px] font-[500]">
                    {item.card?.brand} card
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
                <div
                  onClick={() => {
                    setIsMoreShow(!isMoreShow);
                    setSelectedCard(item);
                  }}
                  className="relative cursor-pointer flex items-center justify-center w-[40px] h-[40px] rounded-full text-white text-[24px] font-[700] bg-[#FFFFFF26]"
                >
                  <BsThreeDots />
                  {isMoreShow && item.id === selectedCardItem.id && (
                    <div className="absolute top-[-10px] left-[-202px] max-sm:left-[-180px] flex">
                      <div className="flex flex-col gap-[19px] bg-white rounded-[6px] p-[22px_20px] max-sm:p-[15px] max-sm:gap-[15px]">
                        <p
                          className="flex items-center gap-[8px] text-[#1F133E] text-[20px] max-sm:text-[18px] font-[500] cursor-pointer"
                          onClick={() => handleSetPrimary()}
                        >
                          <Image
                            src={CardIcon}
                            width={isMobile ? 20 : 24}
                            height={isMobile ? 20 : 24}
                            alt="icon"
                          />{' '}
                          Set as primary
                        </p>
                        <p
                          className="flex items-center gap-[8px] text-[#1F133E] text-[20px] font-[500] cursor-pointer"
                          onClick={() => handleCardDel()}
                        >
                          <Image
                            src={TrashIcon}
                            width={24}
                            height={24}
                            alt="icon"
                          />{' '}
                          Delete Card
                        </p>
                      </div>
                      <div className="mt-[21px] max-sm:mt-[19px]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="19"
                          viewBox="0 0 10 19"
                          fill="none"
                        >
                          <path
                            d="M9.24736 7.98636C10.171 8.78408 10.171 10.2159 9.24736 11.0136L1.23158e-07 19L9.53674e-07 -4.80825e-07L9.24736 7.98636Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div />
          )}
        </div>
        <div className="flex flex-col justify-center mt-[30px] gap-[20px]">
          <button
            className="bg-white rounded-[8px] text-[#1F133E] text-[30px] max-sm:text-[20px] text-center font-[700] py-[15px] w-full"
            onClick={() => {
              setIsAdded(false);
              setIsLoading(false);
            }}
          >
            Add New Payment Method
          </button>
          {/* <button className="bg-[#FFFFFF1A] border border-white rounded-[8px] text-white text-[30px] font-[700] py-[15px] w-full">
            Manage Payment Methods
          </button> */}
        </div>
      </div>
      <SignUpFooter />
    </>
  );
}
