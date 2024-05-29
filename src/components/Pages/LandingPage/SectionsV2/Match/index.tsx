import React, { createRef, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import Slider from 'react-slick';
import { useRouter } from 'next/router';
import { getWebFeed } from '@/api/web/web.service';
import { TypePlanner } from '@/lib/types';
import { DownloadModal } from '@/components/Modals/DownloadModal';
import { QUERY_OPTION } from '@/lib/constants';
import { getAudioURL } from '@/lib/utils';
import { useWindowSize } from '@/hooks/useWindowSize';
import styles from './index.module.scss';
import PlannerItem from '../PlannerItem';

type DATA = {
  handleGetStartedOpen: any;
  isSuccess: boolean;
  data: any;
  title: string;
  subtitle?: string;
};

const MOBILE_WIDTH = 768;

export default function Match({
  handleGetStartedOpen,
  isSuccess,
  data,
  title,
  subtitle,
}: DATA) {
  const [planners, setPlanners] = useState<TypePlanner[]>([]);
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cityById, setCityById] = useState([]);
  const [playingId, setPlayingId] = useState<string>('');
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width && width <= MOBILE_WIDTH, [width]);
  const [
    PlannerQuestionResponsesByUserId,
    setPlannerQuestionResponsesByUserId,
  ] = useState<any[]>([]);

  const { pathname } = useRouter();

  useEffect(() => {
    if (isSuccess && data) {
      setPlanners(data.planners.slice(0, 8));
      setCityById(data.cityById);
      setPlannerQuestionResponsesByUserId(
        data.plannerQuestionData?.PlannerQuestionResponsesByUserId,
      );
    }
  }, [isSuccess, data]);

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.title}>
          <p
            className={`p-0 ${
              pathname === '/plannetMonthlyTexts'
                ? 'max-sm:!text-[40px]'
                : 'max-sm:!text-[60px]'
            }`}
          >
            {title}
          </p>
        </div>
        {subtitle && <div className={styles.description}>{subtitle}</div>}
        {width && !isMobile && (
          <div className={styles.plannersDesktop}>
            {planners.map((planner, index) => {
              return (
                <div
                  key={`desktop_planner_${planner.id}`}
                  className={styles.itemWrapper}
                >
                  <PlannerItem
                    index={index}
                    idstr=""
                    planner={planner}
                    city={cityById[planner.HomeBaseId]}
                    audioUrl={getAudioURL(
                      planner,
                      planner.id,
                      PlannerQuestionResponsesByUserId,
                    )}
                    onOpenDownloadModal={handleGetStartedOpen(true)}
                    onAudioChange={(newId: string) => setPlayingId(newId)}
                    playingId={playingId}
                    isCheck
                    isLink={false}
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
                {planners.map((planner, index) => {
                  return (
                    <div
                      key={`mobile_planner_${planner.id}`}
                      className={styles.itemWrapper}
                    >
                      <PlannerItem
                        index={index}
                        idstr="match-slider-"
                        planner={planner}
                        city={cityById[planner.HomeBaseId]}
                        audioUrl={getAudioURL(
                          planner,
                          planner.id,
                          PlannerQuestionResponsesByUserId,
                        )}
                        onOpenDownloadModal={handleGetStartedOpen(true)}
                        onAudioChange={(newId: string) => setPlayingId(newId)}
                        playingId={playingId}
                        isCheck
                        isLink={false}
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
