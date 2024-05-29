import styles from './ProgressBar.module.scss';

type ProgressBarProps = {
  size: number;
  progress: number;
};
export default function ProgressBar({ size, progress }: ProgressBarProps) {
  return (
    <div className={styles.progress_bar}>
      {[...new Array(size).keys()].map((index) => {
        return (
          <div
            key={`progress_${index}`}
            className={`${styles.bar} ${
              index <= progress ? styles.passed : ''
            }`}
          />
        );
      })}
    </div>
  );
}
