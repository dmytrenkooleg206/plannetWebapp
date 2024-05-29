import { useEffect } from 'react';
import styles from './CodeResent.module.scss';

type CodeResentProps = {
  phoneNumber: string;
  isOpen: boolean;
  onClose: Function;
};
export default function CodeResent({
  phoneNumber,
  isOpen,
  onClose,
}: CodeResentProps) {
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className={styles.code_resent}>
      Code Resent to
      <br />
      {phoneNumber}
    </div>
  );
}
