import { forwardRef, useEffect, useState } from 'react';

import Loader from '@/components/Loader/Loader';

const styles = {
  container:
    'w-full h-full z-50 fixed top-0 left-0 h-screen flex items-center justify-center',
  box: 'bg-black-600 text-lg md:text-2xl text-white rounded-lg px-9 md:px-8 py-8 md:py-11 w-52 md:w-63 text-center',
};

type FlashMessageProps = {
  duration?: number;
};

export type FlashMessageRef = {
  show: () => void;
  loaded: () => void;
};

function FlashMessage({ duration = 3000 }: FlashMessageProps, ref: any) {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [text, setText] = useState('');

  ref.current = {
    show: (newText: string) => {
      setIsVisible(true);
      setText(newText);
    },
    loaded: () => setIsLoading(false),
  };

  const close = () => {
    setIsVisible(false);
    setIsLoading(true);
  };

  useEffect(() => {
    if (isLoading) {
      return () => {};
    }

    const timeout = setTimeout(close, duration);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading, duration]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={styles.container}
      onKeyDown={() => {}}
      role="button"
      tabIndex={0}
      onClick={close}
    >
      <div className={styles.box}>
        {isLoading ? <Loader color="white" /> : <>{text}</>}
      </div>
    </div>
  );
}

export default forwardRef(FlashMessage);
