import React, { useEffect, useRef } from 'react';

const useChangeBgImage = () => {
  const bgChangingContainer = useRef<any>();
  const images = [
    '/assets/images/backgrounds/image-1.webp',
    '/assets/images/backgrounds/image-2.webp',
    '/assets/images/backgrounds/image-3.webp',
    '/assets/images/backgrounds/image-4.webp',
    '/assets/images/backgrounds/image-5.webp',
    '/assets/images/backgrounds/image-6.webp',
    '/assets/images/backgrounds/image-7.webp',
    '/assets/images/backgrounds/image-8.webp',
    '/assets/images/backgrounds/image-9.webp',
    '/assets/images/backgrounds/image-10.webp',
    '/assets/images/backgrounds/image-11.webp',
    '/assets/images/backgrounds/image-12.webp',
    '/assets/images/backgrounds/image-13.webp',
    '/assets/images/backgrounds/image-14.webp',
  ];
  useEffect(() => {
    const intervalId = setInterval(() => {
      bgChangingContainer.current.style.transition =
        'background-image 2s ease-in-out 2s';
      bgChangingContainer.current.style.backgroundImage = `url(${
        images[Math.floor(Math.random() * images.length)]
      })`;
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return bgChangingContainer;
};

export default useChangeBgImage;
