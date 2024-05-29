import styles from './IconButton.module.scss';

type IconButtonProps = {
  text: string;
  onClick: Function;
  width?: string;
  type: string;
};

export default function IconButton({
  text,
  onClick,
  width = '100%',
  type = 'hot',
}: IconButtonProps) {
  const renderImage = () => {
    switch (type) {
      case 'cold':
        return <img src="/assets/images/onboarding/cold.png" alt="cold" />;
      case 'party':
        return <img src="/assets/images/onboarding/party.svg" alt="party" />;
      case 'romantic':
        return (
          <img src="/assets/images/onboarding/romantic.svg" alt="romantic" />
        );
      case 'budget':
        return <img src="/assets/images/onboarding/budget.svg" alt="budget" />;
      case 'culture':
        return (
          <img src="/assets/images/onboarding/culture.svg" alt="culture" />
        );
      case 'relax':
        return <img src="/assets/images/onboarding/relax.svg" alt="relax" />;
      case 'no_preference':
        return null;
      case 'international':
        return (
          <img
            src="/assets/images/onboarding/international.svg"
            alt="international"
          />
        );
      case 'domestic':
        return (
          <img src="/assets/images/onboarding/domestic.svg" alt="domestic" />
        );
      default:
        return <img src="/assets/images/onboarding/hot.png" alt="hot" />;
    }
  };
  return (
    <div
      className={`${styles.icon_button} ${styles[type]}`}
      style={{
        width,
      }}
      role="presentation"
      onClick={() => onClick()}
    >
      {renderImage()}
      <div className={styles.text}>{text}</div>
    </div>
  );
}
