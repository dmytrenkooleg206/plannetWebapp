import { Disclosure } from '@headlessui/react';
import Image from 'next/image';
import React, { useRef } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import dayjs from 'dayjs';
import ItineraryImageSlider from './ItineraryImageSlider';
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

export default function ItineraryDailyList({ customEvents }: any) {
  const buttonRefs = useRef<HTMLButtonElement[]>([]);

  const clickRecent = (index: number) => {
    if (buttonRefs.current) {
      buttonRefs.current.forEach((ref, idx) => {
        if (idx !== index && ref.getAttribute('data-value') === 'true') {
          ref.click();
        }
      });
    }
  };

  const checkAndConverDate = (time: string) => {
    if (time && !(time.includes('AM') || time.includes('PM'))) {
      return dayjs(`1/1/1 ${time}`).format('hh:mm A');
    }
    return time;
  };

  const items: any = [];

  customEvents.forEach((event: any) => {
    const itemFound = items.find(
      (itm: any) => itm.startDateOffset === event.startDateOffset,
    );

    if (itemFound) {
      itemFound.events.push(event);
      if (
        event &&
        event.BusinessEntity &&
        event.BusinessEntity.photoUrl_CF &&
        event.BusinessEntity.photoUrl_CF !== ''
      ) {
        itemFound.images.push(event.BusinessEntity.photoUrl_CF);
      }
    } else {
      let defaultStartOffset = event.startDateOffset
        ? event.startDateOffset
        : 0;
      items.push({
        startDateOffset: defaultStartOffset,
        id: 'day_' + (defaultStartOffset + 1),
        events: [event],
        images: [],
      });

      if (
        event &&
        event.BusinessEntity &&
        event.BusinessEntity.photoUrl_CF &&
        event.BusinessEntity.photoUrl_CF !== ''
      ) {
        items[items.length - 1].images.push(event.BusinessEntity.photoUrl_CF);
      }
    }
  });

  const refs = React.useMemo(() => {
    return (
      items.map(() => {
        return React.createRef<HTMLButtonElement>();
      }) ?? []
    );
  }, [items]);

  items.sort((a: any, b: any) => a.startDateOffset - b.startDateOffset);

  items.map((item: any, idx: any) => {
    item.events.sort((a: any, b: any) => {
      return dayjs(a.startTime, 'hh:mm A').isBefore(
        dayjs(b.startTime, 'hh:mm A'),
      )
        ? -1
        : 1;
    });
  });

  return (
    <div className="mt-4 bg-white-100 rounded-lg divide-y divide-white-200">
      <h4 className="text-[24px] font-[700] p-3 leading-7">Itinerary</h4>
      {items.map((item: any, idx: any) => (
        <div key={idx + `_` + item.id}>
          <Disclosure defaultOpen={idx === 0}>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className="text-xl p-3 w-full "
                  data-id={item.id}
                  data-value={open}
                  ref={(ref) => {
                    buttonRefs.current[idx] = ref!;
                  }}
                  onClick={() => clickRecent(idx)}
                >
                  <div className="flex justify-between">
                    <div className="text-lg font-[700] text-[18px">
                      {item && item.startDateOffset >= 0 && item.events
                        ? `DAY ${item.startDateOffset + 1}`
                        : 'No data'}
                    </div>
                    {!open ? (
                      <FaChevronDown style={{ height: 'auto' }} />
                    ) : (
                      <FaChevronUp style={{ height: 'auto' }} />
                    )}
                  </div>
                </Disclosure.Button>

                <Disclosure.Panel>
                  <div className="divide-y divide-white-200">
                    {item.startDateOffset >= 0 &&
                      item.events &&
                      item.images &&
                      item.images.length > 0 && (
                        <ItineraryImageSlider images={item.images} />
                      )}
                    {item.startDateOffset >= 0 &&
                      item.events.map((eve: any) => (
                        <div key={eve.id}>
                          <div className="p-2">
                            <h4 className="font-[400] text-[18px] inline-block">
                              {checkAndConverDate(eve.startTime)}
                            </h4>
                            <h4 className="font-[400] text-[18px] inline-block ml-[12px]">{`${eve.name}`}</h4>
                            {(eve.description1 || eve.description2) && (
                              <p className="font-[400] text-[#FFFFFF99] mt-[10px]">
                                {`${
                                  eve.description1 !== null
                                    ? eve.description1
                                    : ''
                                } ${
                                  eve.description2 !== null
                                    ? eve.description2
                                    : ''
                                }`}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      ))}
    </div>
  );
}
