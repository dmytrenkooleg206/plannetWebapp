import ClipLoader from 'react-spinners/ClipLoader';
import Image from 'next/image';
import styles from './SplashScreen.module.scss';

type LoaderProps = {
  color?: string;
  size?: number;
};
export default function SplashScreen({
  color = 'secondary',
  size = 26,
}: LoaderProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col justify-center items-center my-auto">
      <div>
        <img
          width={180}
          height={180}
          className="max-w-[210px] w-full h-full pr-2"
          src="/assets/images/logos/Logo@3x.png"
          alt="planet logo"
        />
      </div>
      <div className="text-white">
        <p>A friend in every city</p>
      </div>
      <div className={`${styles.block_loader} text-white mt-[24px]`}>
        <ClipLoader
          className={`${styles.loader} ${styles[color]}`}
          size={size}
          speedMultiplier={0.5}
        />
      </div>
    </div>
  );
}
