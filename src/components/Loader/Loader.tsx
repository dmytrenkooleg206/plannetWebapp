import ClipLoader from 'react-spinners/ClipLoader';
import styles from './Loader.module.scss';

type LoaderProps = {
  color?: string;
  size?: number;
};
export default function Loader({
  color = 'secondary',
  size = 26,
}: LoaderProps) {
  return (
    <div className={styles.block_loader}>
      <ClipLoader
        className={`${styles.loader} ${styles[color]}`}
        size={size}
        speedMultiplier={0.5}
      />
    </div>
  );
}
