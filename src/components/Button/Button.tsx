/* eslint-disable @typescript-eslint/no-unused-expressions */
import Image from 'next/image';

import Loader from '../Loader/Loader';
import styles from './Button.module.scss';

const icons = {
  plus: '/assets/images/dashboard/plus.svg',
  close: '/assets/images/dashboard/close.svg',
};

type ButtonProps = {
  text: string | JSX.Element;
  onClick?: Function;
  size?: string;
  color?:
    | 'primary'
    | 'secondary'
    | 'black'
    | 'red'
    | 'green'
    | 'gray'
    | 'black-red'
    | 'red-light'
    | 'red-white'
    | 'gray-medium'
    | 'white'
    | 'navy';
  isLoading?: boolean;
  isDisabled?: boolean;
  width?: string;
  weight?: string;
  radius?: 'lg' | 'md' | 'sm' | 'regular';
  justify?: 'start' | 'center' | 'end';
  icon?: 'plus' | 'close';
  id?: string;
  type?: any;
};

export default function Button({
  text,
  onClick,
  size = '20px',
  color = 'primary',
  width = '100%',
  weight = 'normal',
  isLoading = false,
  isDisabled = false,
  radius = 'lg',
  justify = 'center',
  icon,
  id,
  type,
}: ButtonProps) {
  if (isLoading) {
    return (
      <div
        className={`button-loader ${styles.button} ${styles[color]} ${
          isDisabled ? styles.disabled : ''
        }`}
        style={{ width }}
      >
        <Loader color={color} />
      </div>
    );
  }
  return (
    <button
      disabled={isDisabled}
      type={type || 'button'}
      className={`${styles.button} ${styles[color]} ${
        isDisabled ? styles.disabled : ''
      } rounded${
        radius !== 'regular' ? `-${radius}` : ''
      } justify-${justify} p-5`}
      style={{
        fontSize: size,
        width,
        fontWeight: weight,
      }}
      onClick={() => {
        if (onClick) onClick();
      }}
      id={id}
    >
      {icon && (
        <Image
          className={`${styles.icon} mr-2 self-center p-1 border border-white rounded-full`}
          width={24}
          height={24}
          src={icons[icon]}
          alt=""
          loading="lazy"
        />
      )}

      {text}
    </button>
  );
}
