import { useRouter } from 'next/router';
import Button from '@/components/Button/Button';
import styles from './NotificationStep.module.scss';

export default function NotificationStep() {
  const router = useRouter();
  const handleOnContinue = () => {
    router.push('/onboarding');
  };
  return (
    <div className={styles.block_notification}>
      <div className={styles.gradient_back} />
      <img
        className={styles.image_logo}
        src="/assets/images/registration/white_logo.png"
        alt="logo"
      />
      <img
        className={styles.image_places}
        src="/assets/images/registration/places.png"
        alt="logo"
      />
      <div className={styles.text_never_miss}>Never miss an update</div>
      <div className={styles.text_info}>
        Get messages and alerts from your friends, family and Planners!
      </div>
      <Button
        text="Continue"
        width="320px"
        onClick={() => handleOnContinue()}
      />
    </div>
  );
}
