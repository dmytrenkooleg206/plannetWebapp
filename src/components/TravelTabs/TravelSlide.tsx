import React, { useState } from 'react';
import Image from 'next/image';
import { createPlannerItinerary } from '@/api/travel/earnCredit.service';
import { toast } from 'react-toastify';
import styles from '../../styles/Travel.module.scss';
import { useMutation } from 'react-query';
import { queryClient } from '@/pages/_app';

function TravelSlide({ item }: any) {
  const [category, setCategory] = useState<string>('');

  /**
   * Callback function to call creat itinerary API
   * @param param0 
   */
  const setData = async ({ category }: any) => {
    await createPlannerItinerary({ category })
      .then((response: any) => {
        return response.trip;
      })
      .catch((error) => {
        return error;
      });
  };

  /**
   * mutation to create itinerary & refecth the user and trip data
   */
  const { mutate, error, data }: any = useMutation(setData, {
    onSuccess: () => {
      queryClient.invalidateQueries(["user-trips"]);
      queryClient.invalidateQueries(["current_user"]);
      toast.success('Itinerary Created Successfully !');
    },
    onError: () => {
      toast.error(error?.response?.data?.message);
    },
  });

  /**
   * Method to create itinerary
   * @param category string
   */
  const createItinerary = async (category: any) => {
    try {
      setCategory(category);
      mutate({ category });
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <div className="px-2" key={`travelSlide-${item.id}`}>
        <div className="border-dashed border-2  border-[#7440F5] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-full">
          <div className="w-full max-w-full px-3 py-2 bg-[#170D31] rounded-lg">
            <div className={`p-3 `}>
              <div style={{ marginBottom: '-10px' }}>
                <img src={item.image} className="w-full" />
                <div
                  className={`${styles.TravelDiv} cursor-pointer`}
                  onClick={() => createItinerary(item.category)}
                >
                  <Image
                    loading="lazy"
                    src="/assets/images/earnTravelCredit/plus.png"
                    alt="chat"
                    width={60}
                    height={60}
                  />
                </div>
              </div>
              <div className="text-center text-[24px] font-bold">
                <span>{item.name}</span>
                <br />
                <span>{item.nameBreak}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TravelSlide;
