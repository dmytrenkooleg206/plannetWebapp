import Modal from '@/components/Modals/Modal';
import styles from './NotificationModal.module.scss';
import Image from 'next/image';

type NotificationModalProps = {
  onClose: Function;
  isOpen: boolean;
};

export default function NotificationModal({
  onClose,
  isOpen,
}: NotificationModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      size="sm"
      bgColor="#1F133E"
      colorType="code"
      animation="slideInTop"
      onClose={onClose}
    >
      <div className={styles.block_download}>
        <div className={styles.image_check}>
          <Image
            width={70}
            height={70}
            src="/assets/images/summary/heart-minus-svg.svg"
            alt="check"
            priority={true}
          />
        </div>
        <div className={styles.text_description}>Removed from Favorites</div>
      </div>
    </Modal>
  );
}
