import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';
import { useWindowSize } from '@/hooks/useWindowSize';

import { tabItems } from './faqValues';

import OpenIcon from './icons/open.svg';
import CloseIcon from './icons/close.svg';
import styles from './index.module.scss';

type FAQsProps = {
  contentFAQs: any;
};

type FAQItemProps = {
  data: any;
  index: number;
  openItemIndex: any;
  setOpenItemIndex: Function;
};

const MOBILE_SCREEN = 768;

function FAQItem({
  data,
  index,
  openItemIndex,
  setOpenItemIndex,
}: FAQItemProps) {
  const isOpen = openItemIndex === index;

  return (
    <div className={styles.faqItem}>
      <div className={styles.faqItemHeader}>
        <p>{data.question}</p>
        <span onClick={() => setOpenItemIndex(isOpen ? null : index)}>
          <Image
            src={isOpen ? CloseIcon : OpenIcon}
            width={50}
            height={50}
            alt="icon"
          />
        </span>
      </div>
      {isOpen && (
        <>
          <div className={styles.devider} />
          <div className={styles.faqDescription}>{data.answer}</div>
        </>
      )}
    </div>
  );
}
export default function FAQContent({ contentFAQs }: FAQsProps) {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [showData, setShowData] = useState<any>(null);
  const [openItemIndex, setOpenItemIndex] = useState<any>(null);

  const { width } = useWindowSize();
  const isMobile = useMemo(() => width && width <= MOBILE_SCREEN, [width]);

  useEffect(() => {
    if (contentFAQs) {
      switch (selectedTab) {
        case 0:
          setShowData(contentFAQs.faqTraveler);
          break;
        case 1:
          setShowData(contentFAQs.faqPlanner);
          break;
        case 2:
          setShowData(contentFAQs.faqPlannetLinks);
          break;

        default:
          break;
      }
    }
  }, [contentFAQs, selectedTab]);

  const handleClickTabs = (id: number) => {
    setSelectedTab(id);
  };

  return (
    <div className={styles.faqContent}>
      <ul className={styles.tabs}>
        {tabItems.map((item, index) => (
          <li
            className={`${selectedTab === index ? styles.active : ''}`}
            key={index}
            onClick={() => handleClickTabs(index)}
          >
            {!isMobile && (
              <Image
                src={selectedTab === index ? item.iconSel : item.icon}
                width={24}
                height={24}
                alt="icon"
              />
            )}

            {item.caption}
          </li>
        ))}
      </ul>

      <div className={styles.faqLists}>
        {showData?.length ? (
          showData.map((item: any, index: number) => (
            <FAQItem
              data={item}
              key={index}
              index={index}
              openItemIndex={openItemIndex}
              setOpenItemIndex={setOpenItemIndex}
            />
          ))
        ) : (
          <div className="text-[30px] max-sm:text-[20px] text-white text-center p-[50px]">
            <i>No questions added</i>
          </div>
        )}
      </div>
    </div>
  );
}
