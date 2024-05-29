import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import PlannerItem from '@/components/PlannerItem/PlannerItem';
import Carousel from '@/components/Carousel/Carousel';
import { getWebFeed } from '@/api/web/web.service';
import { TypePlanner } from '@/lib/types';
import { DownloadModal } from '@/components/Modals/DownloadModal';
import { QUERY_OPTION } from '@/lib/constants';
import { getAudioURL } from '@/lib/utils';
import styles from './Match.module.scss';

export default function Match() {
  const { isSuccess, data } = useQuery('feedv2', getWebFeed, QUERY_OPTION);
  const [planners, setPlanners] = useState<TypePlanner[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cityById, setCityById] = useState([]);
  const [playingId, setPlayingId] = useState<string>('');
  const [
    PlannerQuestionResponsesByUserId,
    setPlannerQuestionResponsesByUserId,
  ] = useState<any[]>([]);

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
    <section className={styles.section_match}>
      <div className={styles.container}>
        <div className={styles.text_title}>NO MORE TRAVEL STRESS</div>
        <div className={styles.divider} />
        <div className={styles.text_description}>
          We find your perfect match. <br /> They plan your trip for you!
        </div>
        <div className={styles.desktop_planners}>
          {planners.map((planner) => {
            return (
              <PlannerItem
                key={`desktop_planner_${planner.id}`}
                index={0}
                idstr=""
                planner={planner}
                city={cityById[planner.HomeBaseId]}
                audioUrl={getAudioURL(
                  planner,
                  planner.id,
                  PlannerQuestionResponsesByUserId,
                )}
                onOpenDownloadModal={() => setIsOpen(true)}
                onAudioChange={(newId: string) => setPlayingId(newId)}
                playingId={playingId}
              />
            );
          })}
        </div>
        <div className={styles.mobile_planners}>
          <Carousel>
            {planners.map((planner, index) => {
              return (
                <PlannerItem
                  key={`mobile_planner_${planner.id}`}
                  index={index}
                  idstr="match-slider-"
                  planner={planner}
                  city={cityById[planner.HomeBaseId]}
                  audioUrl={getAudioURL(
                    planner,
                    planner.id,
                    PlannerQuestionResponsesByUserId,
                  )}
                  onOpenDownloadModal={() => setIsOpen(true)}
                  onAudioChange={(newId: string) => setPlayingId(newId)}
                  playingId={playingId}
                />
              );
            })}
          </Carousel>
        </div>
      </div>
      <DownloadModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </section>
  );
}
