import React from 'react';
import Image from 'next/image';
import { data } from './EarnTravelCreditData';

function ItinerariesCard({
  itineraryitem,
  tabId,
  handleModal,
  showDownloadAppModal,
}: any) {
  const ItemImg =
    data &&
    data.Travel &&
    data.Travel.filter(
      (dataitem: any) => dataitem.category === itineraryitem.category,
    );

  return (
    <>
      <div
        className="px-2 cursor-pointer"
        key={itineraryitem.id}
        onClick={() => handleModal(!showDownloadAppModal)}
      >
        <div className=" rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-full">
          <div className="w-full max-w-full px-3 py-2 bg-black rounded-lg">
            <div className={`p-3 `}>
              <div>
                {ItemImg && ItemImg[0] && ItemImg[0].id && (
                  <img src={ItemImg[0].image} className="w-full" />
                )}
              </div>
              <div className=" mt-4 text-[24px] font-bold min-w-[240px] max-w-[284px] break-words">
                <span>{itineraryitem.name}</span>
              </div>
              <div className="mt-2 flex">
                {tabId == 'pending' && (
                  <>
                    {' '}
                    <Image
                      src="/assets/images/earnTravelCredit/pendingbtn.png"
                      alt=""
                      loading="lazy"
                      width={40}
                      height={40}
                    />
                    <h3 className=" ml-2 text-[24px] font-bold">
                      Pending approval
                    </h3>{' '}
                  </>
                )}
                {tabId == 'completed' && (
                  <>
                    {' '}
                    <Image
                      loading="lazy"
                      src="/assets/images/earnTravelCredit/completedbtn.png"
                      alt=""
                      width={40}
                      height={40}
                    />
                    <h3 className=" ml-2 text-[24px] font-bold">Completed</h3>{' '}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ItinerariesCard;
