import Image from 'next/image';

import Modal from '@/components/Modals/Modal';
import Button from '@/components/Button/Button';

const labels = {
  confirm: 'Confirm',
  cancel: 'Cancel',
};

const styles = {
  container:
    'px-5 py-7 md:px-10 md:py-12 flex gap-5 md:gap-7 flex-col text-center',
  modalColor: 'gray-113',
  title: 'text-xl md:text-3xl grow text-redLight',
  icon: 'rounded-full self-center w-12 md:w-28 h-12 md:h-28',
  row: 'flex flex-row justify-center gap-6 md:gap-10',
};

type StandardConfirmModalProps = {
  onClose: Function;
  isOpen: boolean;
  onConfirm: Function;
  title: string;
  type: 'changeRole' | 'removeGuest';
  confirmBtnText?: string;
  cancelBtnText?: string;
};

const modalTypes = {
  changeRole: {
    icon: '/assets/images/dashboard/check.svg',
    altText: 'change-role',
    titleStyle: 'text-white',
    iconStyle: 'bg-white-100 p-8',
    buttonColor: 'primary',
  },
  removeGuest: {
    icon: '/assets/images/dashboard/redDelete.svg',
    altText: 'remove',
    titleStyle: 'text-redLight',
    iconStyle: 'bg-redLight-100 p-0',
    buttonColor: 'red-light',
  },
} as const;

export default function StandardConfirmModal({
  onClose,
  isOpen,
  onConfirm,
  title,
  type,
  confirmBtnText = labels.confirm,
  cancelBtnText = labels.cancel,
}: StandardConfirmModalProps) {
  if (!isOpen) return null;
  return (
    <Modal
      size="md"
      animation="slideInTop"
      onClose={onClose}
      bgColor={styles.modalColor}
    >
      <div className={styles.container}>
        <Image
        loading="lazy"
          className={`${styles.icon} ${modalTypes[type].iconStyle}`}
          width={110}
          height={110}
          src={modalTypes[type].icon}
          alt={modalTypes[type].altText}
        />
        <h2 className={`${styles.title} ${modalTypes[type].titleStyle}`}>
          {title}
        </h2>
        <div className={styles.row}>
          <Button
            color={modalTypes[type].buttonColor}
            radius="regular"
            text={confirmBtnText}
            onClick={onConfirm}
          />
          <Button
            color="gray-medium"
            radius="regular"
            text={cancelBtnText}
            onClick={onClose}
          />
        </div>
      </div>
    </Modal>
  );
}
