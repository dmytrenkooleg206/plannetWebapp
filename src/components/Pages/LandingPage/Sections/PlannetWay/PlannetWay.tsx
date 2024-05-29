import { useRouter } from 'next/router';
import { getPlannetUserIdFromLocalStorage } from '@/lib/localStorage/localStorage';
import styles from './PlannetWay.module.scss';

export default function PlannetWay() {
  const router = useRouter();
  const handlePlanATrip = () => {
    const userId = getPlannetUserIdFromLocalStorage();
    if (userId) router.push('/onboarding');
    else router.push('/signup');
  };
  return (
    <section className={styles.section_plannetway}>
      <img
        className={styles.image_back}
        src="/assets/images/landingpage/way_left.png"
        alt="way_left"
      />
      <img
        className={styles.image_back_mobile}
        src="/assets/images/landingpage/way_top.png"
        alt="way_top"
      />
      <div className={styles.plannet_way}>
        <div className={styles.text_title}>THE PLANNET WAY</div>
        <div className={styles.divider} />
        <div className={styles.text_description}>
          Play with <span>Confidence</span>
        </div>
        <div className={styles.text_description}>
          Book with <span>Trust</span>
        </div>
        <div className={styles.text_description}>
          Travel with <span>Plannet</span>
        </div>
        <div className="flex justify-center mt-10">
        </div>
      </div>
      <img
        className={styles.image_back}
        src="/assets/images/landingpage/way_right.png"
        alt="way_bottom"
      />
      <img
        className={styles.image_back_mobile}
        src="/assets/images/landingpage/way_bottom.png"
        alt="way_left"
      />
    </section>
  );
}
