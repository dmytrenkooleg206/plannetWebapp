import React, {useEffect, useState} from "react";
import Image, {StaticImageData} from "next/image";
import styles from './index.module.scss';
import classNames from "classnames";


type DATA = {
  handleGetStartedOpen?: any;
  title: string;
  description: string;
  buttonText?: string;
  image: string | StaticImageData;
    theme?: string;
    reverse?: boolean,
  maxTextWidth?: string
}

export default function BlockWithImage ({ handleGetStartedOpen, title, description, buttonText, image, theme, reverse, maxTextWidth }: DATA) {
  return (
    <div className={classNames(styles.root, {
        [styles[`${theme}`]]: theme,
        [styles.reverse]: reverse
    })}>
      <div className={styles.content}>
        <div className={styles.textContainer} style={{ ...( maxTextWidth && { maxWidth: maxTextWidth} ) }}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.description}>
            {description}
          </div>
          {
            (buttonText && handleGetStartedOpen) &&
              <div className={styles.getStarted} onClick={handleGetStartedOpen(true)}>{buttonText}</div>
          }
        </div>
        <div className={styles.imageWrapper}>
          <Image src={image} alt={'image'}/>
        </div>
        {
          (buttonText && handleGetStartedOpen) &&
            <div className={styles.getStarted} onClick={handleGetStartedOpen(true)}>{buttonText}</div>
        }
      </div>
    </div>
  );
}
