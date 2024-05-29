import styles from './Carousel.module.scss';

type CarouselProps = {
  children: any;
  maxWidth?: string;
};
export default function Carousel({
  children,
  maxWidth = 'max-w-[300px]',
}: CarouselProps) {
  return (
    <div className={`${maxWidth} w-full overflow-hidden mx-auto text-center`}>
      <div className={styles.slides}>{children}</div>
    </div>
  );
}
