import styles from './Modal.module.scss';

type ModalProps = {
  children: any;
  size?: 'md' | 'lg' | 'sm' | 'mb-full';
  animation?: string;
  onClose: Function;
  position?: string;
  bgColor?: string;
  colorType?: string;
};

export default function Modal({
  children,
  size = 'md',
  onClose,
  animation = '',
  position = 'center',
  bgColor = 'white',
  colorType = 'schema',
}: ModalProps) {
  return (
    <div>
      <div
        role="presentation"
        className={styles.modal}
        onClick={() => onClose()}
      />
      <div
        style={{ zIndex: 99999 }}
        className={`${styles.model_container} 
          ${styles[size]} 
          ${styles[animation]} 
          ${styles[position]} 
          ${colorType === 'schema' ? `bg-${bgColor}` : `bg-[${bgColor}]`}
          max-h-[98%] overflow-auto`}
      >
        {children}
      </div>
    </div>
  );
}
