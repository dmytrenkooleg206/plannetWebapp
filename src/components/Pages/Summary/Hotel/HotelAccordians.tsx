import React, { useRef } from 'react';
import { Disclosure } from '@headlessui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import RoomsSelector from './RoomsSelector';
import HotelReviews from './HotelReviews';

export default function HotelAccordians({ hotelData, itiEve, reviews }: any) {
  const buttonRefs = useRef<HTMLButtonElement[]>([]);
  const openedRef = useRef<HTMLButtonElement | null>(null);

  const clickRecent = (index: number) => {
    const clickedButton = buttonRefs.current[index];
    if (clickedButton === openedRef.current) {
      openedRef.current = null;
      return;
    }
    if (Boolean(openedRef.current?.getAttribute('data-value'))) {
      openedRef.current?.click();
    }
    openedRef.current = clickedButton;
  };

  const items = [
    // {
    //   id: 'room_nums',
    //   title: 'Number of rooms',
    //   panel: <RoomsSelector hotelData={hotelData} itiEve={itiEve} />,
    // },
    {
      id: 'reviews',
      title: 'Reviews',
      panel: <HotelReviews reviews={reviews} />,
    },
  ];

  const refs = React.useMemo(() => {
    return (
      items.map(() => {
        return React.createRef<HTMLButtonElement>();
      }) ?? []
    );
  }, [items]);

  return (
    <>
      {items.map((item, idx) => (
        <div className="mt-4 rounded-lg" key={item.id}>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={
                    open
                      ? 'text-xl p-3 w-full bg-white-100 rounded-t-lg'
                      : 'text-xl p-3 w-full bg-white-100 rounded-lg'
                  }
                  data-id={item.id}
                  data-value={open}
                  ref={(ref) => {
                    buttonRefs.current[idx] = ref!;
                  }}
                  onClick={() => clickRecent(idx)}
                >
                  <div className="flex justify-between">
                    <div className="font-[700] text-lg md:text-2xl">{item.title}</div>
                    {!open ? (
                      <FaChevronDown style={{ height: 'auto' }} />
                    ) : (
                      <FaChevronUp style={{ height: 'auto' }} />
                    )}
                  </div>
                </Disclosure.Button>

                <Disclosure.Panel
                  className={
                    open
                      ? 'bg-white-100 rounded-b-lg'
                      : 'bg-white-100 rounded-lg'
                  }
                >
                  {item.panel}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      ))}
    </>
  );
}
