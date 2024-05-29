import { useState } from 'react';
import Image from 'next/image';

import Loader from '@/components/Loader/Loader';

import StarIcon from '@/../public/assets/images/bookhotel/star.svg';
import { CustomStayModal } from '../../CustomStayModal';

type HotelsProps = {
  hotels: any[];
  isLoading: boolean;
  onHotelSelect: Function;
  tripLeg: any;
  onComplete: Function;
};
export default function Hotels({
  tripLeg,
  hotels,
  onHotelSelect,
  onComplete,
  isLoading,
}: HotelsProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="flex">
          {isLoading && (
            <div className="w-12">
              <Loader color="white" />
            </div>
          )}
          <div className="text-base md:text-2xl text-white-800">
            {hotels.length} properties found
          </div>
        </div>
        <button
          className="text-base md:text-xl border border-dashed border-green px-5 py-2 rounded-md"
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Custom Stay
        </button>
      </div>

      <div className="flex flex-wrap justify-around">
        {hotels.map((hotelInfo: any, index: number) => {
          const { hotel, minPricePerNightCents } = hotelInfo;
          let hotelImage: string = hotel.images[0].imageUrl;
          hotelImage = hotelImage.replace('_70', '_0');
          return (
            <button
              key={`hotel_${hotel.allianceMetadata.id}`}
              className="bg-black border border-green rounded-lg mb-7 max-w-[300px] w-full text-left"
              type="button"
              onClick={() => {
                onHotelSelect(hotelInfo);
              }}
            >
              <div className="p-5">
                <div className="relative">
                  {hotelImage && (
                    <Image
                    loading="lazy"
                      src={hotelImage}
                      alt="hotel"
                      width={500}
                      height={281.5}
                      sizes="100vw"
                      className="w-full h-[160px] object-cover rounded"
                    />
                  )}
                  <div className="text-xl bg-green absolute top-5 right-[-12px] rounded-t-lg rounded-bl-lg px-2 py-1">
                    <span className="font-bold">
                      ${Math.ceil(minPricePerNightCents / 100)}
                    </span>{' '}
                    / <span className="font-thin">night</span>
                    <div className="absolute right-0 bottom-[-12px] w-0 h-0border-t-[12px] border-t-black border-l-[12px] border-l-green-100 border-b-[12px] border-b-black" />
                  </div>
                </div>
                <div className="flex justify-between mt-5 mb-2">
                  <div className="text-lg md:text-2xl font-bold truncate mr-2">
                    {hotel.name}
                  </div>
                  <div className="text-base md:text-xl bg-primary my-auto px-2 rounded font-bold">
                    #{index + 1}
                  </div>
                </div>
                <div className="text-base md:text-lg text-white-900 mb-2">
                  {hotel.address.city} •{' '}
                  {hotel.location.distanceMiles
                    ? parseFloat(hotel.location.distanceMiles).toFixed(2)
                    : 0}{' '}
                  mile from city center
                </div>
                <div className="flex mb-2">
                  <Image
                  loading="lazy"
                    className="my-auto"
                    src={StarIcon}
                    alt="star"
                    style={{ width: '20px', height: 'auto' }}
                  />
                  <div className="text-lg md:text-xl text-white-600 mt-1 ml-2">
                    {hotel.numStars} star hotel
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <CustomStayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tripLeg={tripLeg}
        onComplete={onComplete}
      />
    </div>
  );
}
