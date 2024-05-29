import styles from '@/styles/Registration.module.scss';
import OnboardingPage from '@/components/Pages/OnboardingPage/OnboardingPage';
import useChangeBgImage from '@/hooks/useChangeBgImage';

export default function Onboarding() {
  const bgChangingContainer = useChangeBgImage();
  return (
    <div ref={bgChangingContainer} className={styles.container_parent}>
      <div className={styles.container_registration}>
        <div className={styles.overlay} />
        <OnboardingPage />
      </div>
    </div>
  );
}
