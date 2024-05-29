import { MouseEvent } from 'react';
import AudioButton from './AudioButton';
import styles from './PlannerItem.module.scss';

type PlannerItemProps = {
  index: number;
  idstr: string;
  planner: any;
  city: any;
  onOpenDownloadModal: Function;
  audioUrl: string;
  playingId?: string;
  onAudioChange: Function;
};

export default function PlannerItem({
  index = 0,
  planner,
  idstr = '',
  playingId = '',
  city,
  audioUrl,
  onOpenDownloadModal,
  onAudioChange,
}: PlannerItemProps) {
  const handleNextorPrev = (event: MouseEvent, targetId: number) => {
    event.preventDefault();
    event.stopPropagation();
    const scrolledY = window.scrollY;
    const target = document.getElementById(`${idstr}${targetId}`);
    if (target && scrolledY) {
      target.scrollIntoView(true);
      window.scroll(0, scrolledY);
    }
  };

  const generateHomeBase = () => {
    let cityName: string = 'N/A';
    let countryName: string = 'N/A';
    if (planner.HomeBase) {
      cityName = planner.HomeBase?.namme;
      countryName = planner.HomeBase?.country;
    } else if (city) {
      cityName = city.name;
      countryName = city.country;
    }
    const num = 23;
    if (cityName && cityName.length > 15) {
      return cityName;
    }

    const str = `${cityName}, ${countryName}`;
    if (str.length > num) {
      return `${str.slice(0, num - 1)}...`;
    }
    return str;
  };

  return (
    <div>
      <div
        className={styles.planner_item}
        id={idstr ? `${idstr}${index}` : ''}
        onClick={() => onOpenDownloadModal()}
        role="presentation"
      >
        <div>
          <div className="relative mb-2.5">
            <img
              className={styles.image_planner}
              src={
                planner?.profilePictureUrl_CF
                  ? `${planner?.profilePictureUrl_CF}_720`
                  : '/assets/images/planneritem/profile_placeholder.png'
              }
              alt="check"
            />
            {idstr ? (
              <button
                type="button"
                className={styles.button_prev}
                onClick={(event) => handleNextorPrev(event, index - 1)}
              >
                <img
                  className={styles.image_prev_next}
                  src="/assets/images/planneritem/prev.svg"
                  alt="next"
                  style={{ opacity: index ? 1 : 0.2 }}
                />
              </button>
            ) : null}
            {idstr ? (
              <button
                type="button"
                className={styles.button_next}
                onClick={(event) => handleNextorPrev(event, index + 1)}
              >
                <img
                  className={styles.image_prev_next}
                  src="/assets/images/planneritem/next.svg"
                  alt="next"
                  style={{ opacity: index < 7 ? 1 : 0.2 }}
                />
              </button>
            ) : null}
          </div>
          <div className={`${styles.flexrow} ${styles.space_between}`}>
            <div>
              <div className={styles.flexrow}>
                <div className={styles.planner_name}>{planner.firstName}</div>
                <img
                  src="/assets/images/planneritem/planner_check.svg"
                  alt="check"
                />
              </div>
              <div className={styles.planner_location}>
                {generateHomeBase()}
              </div>
              <div className={styles.planner_description}>{planner.title}</div>
            </div>
            {/* <AudioButton
              audioUrl={audioUrl}
              playingId={playingId}
              plannerId={planner.id}
              onAudioChange={onAudioChange}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
