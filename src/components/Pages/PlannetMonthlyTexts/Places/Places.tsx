import React, { useMemo, useState } from 'react';
import { useWindowSize } from '@/hooks/useWindowSize';
import Slider from 'react-slick';
import styles from './index.module.scss';
import { PlacesInterface } from '../PlannetMonthlyTexts';
import PlannerItem from '../PlannerItem';

type DATA = {
  handleGetStartedOpen: any;
  data: PlacesInterface;
};

const MOBILE_WIDTH = 768;

function Places({ handleGetStartedOpen, data }: DATA) {
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width && width <= MOBILE_WIDTH, [width]);
  const [playingId, setPlayingId] = useState<string>('');
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.title}>
          Ideas for your next trip texted directly to you!
        </div>
        {/*
      <div className={styles.getStarted} onClick={handleGetStartedOpen(true)}>Get Started</div>
      */}
        {width && !isMobile && (
          <div className={styles.plannersDesktop}>
            {data.map((planner, index) => {
              return (
                <div
                  key={`desktop_planner_${planner.id}`}
                  className={styles.itemWrapper}
                >
                  <PlannerItem
                    index={index}
                    idstr=""
                    planner={planner}
                    city={planner.HomeBase}
                    onOpenDownloadModal={handleGetStartedOpen(true)}
                  />
                </div>
              );
            })}
          </div>
        )}
        {width && isMobile && (
          <div className={styles.plannersMobile}>
            <div className={styles.carousel}>
              <Slider
                className={styles.slider}
                dots={false}
                speed={500}
                arrows={false}
                slidesToShow={1}
                slidesToScroll={1}
                variableWidth
              >
                {data.map((planner, index) => {
                  return (
                    <div
                      key={`mobile_planner_${planner.id}`}
                      className={styles.itemWrapper}
                    >
                      <PlannerItem
                        index={index}
                        idstr=""
                        planner={planner}
                        city={planner.HomeBase}
                        onOpenDownloadModal={handleGetStartedOpen(true)}
                      />
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>
        )}
      </div>
      {/*
    <DownloadModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    */}
    </div>
  );
}

export default Places;
