import { useRouter } from 'next/router';
import { getPlannetUserIdFromLocalStorage } from '@/lib/localStorage/localStorage';
import styles from './Introduction.module.scss';

export default function Introduction() {
  const router = useRouter();
  const handlePlanATrip = () => {
    const userId = getPlannetUserIdFromLocalStorage();
    if (userId) router.push('/onboarding');
    else router.push('/signup');
  };
  return (
    <section className={styles.section_introduction}>
      <div className={styles.container}>
        <div className={styles.introduction_left}>
          <div className={styles.text_title}>
            We plan,
            <br /> you travel.
          </div>
          <div className={styles.text_description}>
            Plannet is your local concierge. We get you.
            We make sure you experience the right spots, taste the best food
            and make the most of your time in our city.{' '}
          </div>
        </div>
        <div className={styles.introduction_right}>
          <img
            className={styles.image_desktop_show}
            src="/assets/images/landingpage/landing_page.png"
            alt="Desktop show"
          />
        </div>
      </div>
    </section>
  );
}
