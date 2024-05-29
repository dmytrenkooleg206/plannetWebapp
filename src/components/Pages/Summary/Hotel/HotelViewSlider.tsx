import React from 'react';
import Slider from 'react-slick';

export default function HotelViewSlider({ page, image }: any) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoPlay: true,
  };
  return (
    <>
      <div className={`${page === 'experience' ? '' : 'hotelSlider'} `}>
        <Slider {...settings}>
          {image && image[0] && (
            <div className=" float-left -mr-[100%] w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none">
              <img
                src={image[0]}
                className="block w-full h-80"
                alt={`${page === 'experience' ? 'tours' : 'hotel'}`}
              />
            </div>
          )}
        </Slider>
      </div>
    </>
  );
}
