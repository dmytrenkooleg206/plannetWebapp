import Modal from '@/components/Modals/Modal';
import styles from './LearnMoreModal.module.scss';

type LearnMoreModalProps = {
  onClose: Function;
  isOpen: boolean;
};

export default function LearnMoreModal({
  onClose,
  isOpen,
}: LearnMoreModalProps) {
  if (!isOpen) return null;
  return (
    <Modal size="md" onClose={onClose} position="bottom">
      <div className={styles.block_learn_more}>
        <div className={styles.block_content}>
          <div
            className={styles.button_close}
            role="presentation"
            onClick={() => onClose()}
          >
            <img src="/assets/images/onboarding/close.png" alt="close" />
          </div>
          <div className={styles.image_how_plan}>
            <img src="/assets/images/onboarding/how_plan.png" alt="trip" />
          </div>
          <div className={styles.text_how_plan}>How we Plan</div>
          <div className={styles.row}>
            <img src="/assets/images/onboarding/assist.png" alt="trip" />
            <div className={styles.text_info}>
              1-1 assistance with our Planners
            </div>
          </div>
          <div className={styles.row}>
            <img src="/assets/images/onboarding/trip.png" alt="trip" />
            <div className={styles.text_info}>We plan your trip</div>
          </div>
          <div className={styles.row}>
            <img src="/assets/images/onboarding/reservation.png" alt="trip" />
            <div className={styles.text_info}>We make your reservations</div>
          </div>
          <div className={styles.row}>
            <img src="/assets/images/onboarding/24.png" alt="trip" />
            <div className={styles.text_info}>We are available 24/7</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
