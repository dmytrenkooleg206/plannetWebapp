import Slider from 'react-slick';
import CustomDots from '../CustomDots';

export default function ItineraryImageSlider({ images }: any) {
  const settings = {
    autoplay: false,
    autoplaySpeed: 2000,
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: (dots: any) => (
      <div className="slickDots">
        <ul style={{ margin: '0px' }}> {dots} </ul>
      </div>
    ),
    customPaging: (i: number) => (
      <CustomDots
        width="50px"
        fsize="16px"
        fw="400"
        bg="#1F133E"
        bR="8px"
        active={`${i + 1}/${images?.length}`}
      />
    ),
  };

  return (
    <div className="rounded customSliderNumber">
      <Slider {...settings}>
        {images.map((img: string, i: number) => (
          <div key={`slider-${img}`} className="overflow-hidden w-full h-96">
            <img
              placeholder="blur"
              src={img}
              className="w-full h-full rounded-t object-cover"
              width={0}
              height={0}
              alt="hotel"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
