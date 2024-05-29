import React from "react";
import Image from "next/image";
import styles from './index.module.scss';
import Slider, { Settings } from "react-slick";
// IMAGES
import BackgroundWebp from './images/background-min.webp';
import Background1Webp from './images/background1-min.webp';
import Background2Webp from './images/background2-min.webp';
import Background3Webp from './images/background3-min.webp';
import Background4Webp from './images/background4-min.webp';
import Background5Webp from './images/background5-min.webp';
import Background6Webp from './images/background6-min.webp';
import Background7Webp from './images/background7-min.webp';
import Background8Webp from './images/background8-min.webp';
import Background9Webp from './images/background9-min.webp';
import Background10Webp from './images/background10-min.webp';
import Background11Webp from './images/background11-min.webp';
import Background12Webp from './images/background12-min.webp';
import Background13Webp from './images/background13-min.webp';

const SLIDES = [
    {
        pathWebp: BackgroundWebp
    },
    {
        pathWebp: Background1Webp
    },
    {
        pathWebp: Background2Webp
    },
    {
        pathWebp: Background3Webp
    },
    {
        pathWebp: Background4Webp
    },
    {
        pathWebp: Background5Webp
    },
    {
        pathWebp: Background6Webp
    },
    {
        pathWebp: Background7Webp
    },
    {
        pathWebp: Background8Webp
    },
    {
        pathWebp: Background9Webp
    },
    {
        pathWebp: Background10Webp
    },
    {
        pathWebp: Background11Webp
    },
    {
        pathWebp: Background12Webp
    },
    {
        pathWebp: Background13Webp
    }
];

type DATA = {
    handleGetStartedOpen: any;
}

export default function PlanTrip ({ handleGetStartedOpen }: DATA) {
    const settings: Settings = {
        dots: false,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        fade: true,
    }

  return (
    <div className={styles.root}>
      <div className={styles.imageWrapper}>
          <Slider
              className={styles.slider}
              dots={false}
            speed={1000}
            autoplay={true}
            autoplaySpeed={5000}
            arrows={false}
            slidesToShow={1}
            slidesToScroll={1}
            infinite={true}
            fade={true}
          >
              {
                  SLIDES.map((item, i) => (
                      <Image src={item.pathWebp} alt={'Plan trip'} key={i}/>
                  ))
              }
          </Slider>
    </div>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{'Planning your \nnext trip'}</h1>
          <div className={styles.description}>
              is now as simple as sending a text
          </div>
          <div className={styles.getStarted} onClick={handleGetStartedOpen(true)}>Get Started</div>
        </div>
      </div>
    </div>
  );
}
