import styles from './Alert.module.scss';

type AlertProps = {
  errorText: string;
};
export default function Alert({ errorText }: AlertProps) {
  return (
    <div className={styles.block_alert}>
      <div className={styles.alert}>
        <img src="/assets/images/registration/alert.svg" alt="" />
        <span className={styles.text_alert}>{errorText}</span>
      </div>
    </div>
  );
}
