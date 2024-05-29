import Modal from '@/components/Modals/Modal';
import Button from '@/components/Button/Button';
import styles from './ConfirmModal.module.scss';
import PNModal from '../PNModal';

type ConfirmModalProps = {
  onClose: Function;
  isOpen: boolean;
  isDark?: boolean;
  onConfirm: Function;
  text: string;
};

export default function ConfirmModal({
  onClose,
  isOpen,
  onConfirm,
  text,
  isDark = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;
  return (
    <PNModal
      isOpen={isOpen}
      onClose={onClose}
      isDark={isDark}
      maxWidth="max-w-lg"
    >
      <div className={styles.block_confirm}>
        <div className={styles.content_trash}>
          <img src="/assets/images/onboarding/trash.svg" alt="trash" />
        </div>
        <div className={styles.text_remove}>{text}</div>
        <div className={styles.actions}>
          <div className={styles.action_button}>
            <Button
              text="Remove"
              color="red-white"
              onClick={() => onConfirm()}
            />
          </div>
          <div className={styles.action_button}>
            <Button text="Cancel" color="black" onClick={() => onClose()} />
          </div>
        </div>
      </div>
    </PNModal>
  );
}
