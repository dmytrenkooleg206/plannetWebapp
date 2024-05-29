import SigninPage from '@/components/Pages/Registration/Signin/SigninPage';
import useChangeBgImage from '@/hooks/useChangeBgImage';
import styles from '@/styles/Registration.module.scss';

export default function Signin() {
  const bgChangingContainer = useChangeBgImage();
  return (
    <div ref={bgChangingContainer} className={styles.container_parent}>
      <div className={styles.container_registration}>
        <div className={styles.overlay} />
        <SigninPage />
      </div>
    </div>
  );
}
