import Link from 'next/link';
import Modal from '@/components/Modals/Modal';
import styles from './DownloadModal.module.scss';

type DownloadModalProps = {
  onClose: Function;
  isOpen: boolean;
};

export default function DownloadModal({ onClose, isOpen }: DownloadModalProps) {
  if (!isOpen) return null;
  return (
    <Modal size="md" animation="slideInTop" onClose={onClose}>
      <div className={styles.block_download}>
        <div className={styles.image_check}>
          <img src="/assets/images/planneritem/check.svg" alt="check" />
        </div>
        <div className={styles.text_description}>
          Access your trip dashboard from the Plannet app
        </div>
        <div className={styles.text_download}>Download the Plannet app</div>
        <div className="flex justify-center">
          <Link href={`${process.env.NEXT_PUBLIC_APP_STORE}`} target="blank">
            <img
              className="max-w-[190px] w-full h-full pr-2"
              src="/assets/images/landingpage/app_store.png"
              alt="app store"
            />
          </Link>
        </div>
      </div>
    </Modal>
  );
}
