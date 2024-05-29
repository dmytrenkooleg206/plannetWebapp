import { useState } from 'react';
import Image from 'next/image';
import GoogleMapReact from 'google-maps-react-markers';

import StarIcon from '@/../public/assets/images/bookhotel/star.svg';

type HotelsMapProps = {
  hotels: any;
  center: any;
  stayNights: number;
  onHotelSelect: Function;
};
type MarkerProps = {
  lat: number;
  lng: number;
  price: string;
  isSelected: boolean;
  onSelect: Function;
};

function Marker({ lat, lng, price, onSelect, isSelected }: MarkerProps) {
  return (
    <button
      className={`z-10 absolute text-lg border border-green px-3 py-1 rounded-md -translate-x-1/2 -translate-y-1/2 font-bold ${
        isSelected ? 'bg-green text-white' : 'bg-white text-green'
      }`}
      type="button"
      onClick={() => onSelect()}
    >
      ${price}
    </button>
  );
}

type HotelInfoProps = {
  lat: number;
  lng: number;
  selectedHotel: any;
  stayNights: number;
  onHotelSelect: Function;
};
function HotelInfo({
  lat,
  lng,
  selectedHotel,
  onHotelSelect,
  stayNights,
}: HotelInfoProps) {
  if (!selectedHotel) return null;
  const { hotel, minPricePerNightCents } = selectedHotel;
  let hotelImage: string = hotel.images[0].imageUrl;
  hotelImage = hotelImage.replace('_70', '_0');
  const pricePerNight = minPricePerNightCents / 100;
  return (
    <button
      className="p-5 absolute bg-black w-full min-w-[500px] mt-7 rounded-lg text-left -translate-x-1/2"
      type="button"
      onClick={() => onHotelSelect(selectedHotel)}
    >
      <div className="flex w-full">
        <div className="relative min-w-[120px]">
          {hotelImage && (
            <Image
              src={hotelImage}
              loading="lazy"
              alt="hotel"
              width={500}
              height={281.5}
              sizes="100vw"
              className="w-[120px] h-[120px] object-cover rounded"
            />
          )}
        </div>
        <div className="mb-auto ml-5">
          <div className="text-lg md:text-2xl font-bold ">{hotel.name}</div>
          <div className="text-base md:text-lg text-white-900">
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
      </div>
      <div className="bg-green p-3 rounded-md mt-5">
        <div className="text-lg md:text-2xl font-bold">
          $
          {(pricePerNight * stayNights).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <div className="text-base md:text-lg text-white-600">
          for {stayNights} night(s),{' '}
          <span className="text-white">${pricePerNight} per night.</span>
        </div>
      </div>
    </button>
  );
}

export default function HotelsMap({
  hotels,
  center,
  onHotelSelect,
  stayNights,
}: HotelsMapProps) {
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  const renderSelectedHotel = () => {};
  return (
    <div className="w-full h-[600px] relative">
      <GoogleMapReact
        yesIWantToUseGoogleMapApiInternals
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP}
        defaultCenter={center}
        defaultZoom={18}
        events={[
          {
            name: 'onClick',
            handler: () => setSelectedHotel(null),
          },
        ]}
      >
        {hotels.map((hotelInfo: any) => {
          const { hotel, minPricePerNightCents } = hotelInfo;
          return (
            <Marker
              lat={parseFloat(hotel.location.latitude)}
              lng={parseFloat(hotel.location.longitude)}
              price={(minPricePerNightCents / 100).toFixed(2)}
              key={`hotel_map_${hotel.allianceMetadata.id}`}
              isSelected={
                selectedHotel?.hotel.allianceMetadata.id ===
                hotel.allianceMetadata.id
              }
              onSelect={() => setSelectedHotel(hotelInfo)}
            />
          );
        })}
        {selectedHotel && (
          <HotelInfo
            lat={parseFloat(selectedHotel.hotel.location.latitude)}
            lng={parseFloat(selectedHotel.hotel.location.longitude)}
            selectedHotel={selectedHotel}
            onHotelSelect={onHotelSelect}
            stayNights={stayNights}
          />
        )}
      </GoogleMapReact>
    </div>
  );
}
