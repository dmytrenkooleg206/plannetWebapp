export const resetSliderPosition = () => {
  setTimeout(() => {
    if (
      document.querySelectorAll('.slick-track') &&
      document.querySelectorAll('.slick-track').length > 0
    ) {
      Array.from(
        document.querySelectorAll<HTMLElement>('.slick-track'),
      ).forEach(
        (item) => (item.style.transform = 'translate3d(0px, 0px, 0px)'),
      );
    }
  }, 500);
};
