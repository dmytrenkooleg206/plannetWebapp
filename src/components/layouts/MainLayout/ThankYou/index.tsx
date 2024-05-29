import React from 'react';
import Image from "next/image";
// STYLES
import styles from './index.module.scss';
// IMAGES
import Close from './images/close.svg';
import Check from './images/check.svg';

type DATA = {
    onClose: any;
}

const ThankYou = ({ onClose }: DATA) => {
    return (
        <div className={styles.root}>
            <div className={styles.close} onClick={onClose}>
                <Image src={Close} alt={'close'} priority={true}/>
            </div>
            <div className={styles.content}>
                <div className={styles.check}>
                    <Image src={Check} alt={'check'} priority={true}/>
                </div>
                <div className={styles.title}>Your message has been received!</div>
                <div className={styles.button} onClick={onClose}>
                    Ok
                </div>
            </div>
        </div>
    );
};

export default ThankYou;
