import { Disclosure } from '@headlessui/react';
import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function HotelPolicies({ policies }: any) {
  return (
    <>
      <div className="mt-4 rounded-lg" key="amenities_policies">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={
                  open
                    ? 'text-xl p-3 w-full bg-white-100 rounded-t-lg'
                    : 'text-xl p-3 w-full bg-white-100 rounded-lg'
                }
                data-value={open}
              >
                <div className="flex justify-between">
                  <div className="font-[500] text-lg md:text-2xl">Policies</div>
                  {!open ? (
                    <FaChevronDown style={{ height: 'auto' }} />
                  ) : (
                    <FaChevronUp style={{ height: 'auto' }} />
                  )}
                </div>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="bg-white-100 rounded-b-lg">
                  {policies.plannetHotelPolicies &&
                  policies.plannetHotelPolicies.length > 0 ? (
                    policies.plannetHotelPolicies.map(
                      (item: any, index: number) => {
                        return (
                          <div
                            className="p-3 text-white-600"
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                            key={index}
                          />
                        );
                      },
                    )
                  ) : (
                    <div className="p-3 text-white-600">
                      Policies is not available
                    </div>
                  )}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}
