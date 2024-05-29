/* eslint-disable react/no-danger */
import Image, { StaticImageData } from 'next/image';
import classNames from 'classnames';
import styles from './index.module.scss';
// IMAGES

type DATA = {
  explanations: {
    id: string | number;
    img: string | any | StaticImageData;
    alt: string;
    title?: string | JSX.Element;
    text?: string | JSX.Element;
  }[];
  title: string;
  subtitle?: string;
  background: string;
  textColor: string;
  theme?: string;
};

export default function Howitworks({
  explanations,
  title,
  background,
  textColor,
  theme,
  subtitle,
}: DATA) {
  return (
    <div
      className={classNames(styles.root, {
        [styles[`${theme}`]]: theme,
      })}
      style={{ background }}
    >
      <div className={styles.content}>
        <h2 className={styles.title} style={{ color: textColor }}>
          {title}
        </h2>
        {subtitle && (
          <p className="mb-[55px] mx-auto max-sm:mb-[20px] w-[895px] max-sm:w-full text-center text-[30px] max-sm:text-[20px] font-[400] text-white">
            {subtitle}
          </p>
        )}
        <div className={styles.explanations}>
          {explanations.map((item) => {
            return (
              <div className={styles.explanation} key={item.id}>
                <div className={styles.imageWrapper}>
                  <Image
                    className={styles.explanationImg}
                    src={item.img}
                    alt={item.alt}
                  />
                </div>
                {item.title && (
                  <div
                    className={styles.explanationTitle}
                    style={{ color: textColor }}
                    dangerouslySetInnerHTML={{ __html: item.title as string }}
                  />
                )}
                <div
                  className={styles.explanationText}
                  style={{ color: textColor }}
                >
                  {item.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
