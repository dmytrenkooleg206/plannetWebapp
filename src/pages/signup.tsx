import SignupPage from '@/components/Pages/Registration/Signup/SignupPage';
import useChangeBgImage from '@/hooks/useChangeBgImage';
import styles from '@/styles/Registration.module.scss';

export default function Signup() {
  const bgChangingContainer = useChangeBgImage();
  return (
    <div ref={bgChangingContainer} className={styles.container_parent}>
      <div className={styles.container_registration}>
        <div className={styles.overlay} />
        <SignupPage />
      </div>
    </div>
  );
}
