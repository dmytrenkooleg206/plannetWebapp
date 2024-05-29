import React from 'react';
import Link from "next/link";
import Image from "next/image";
// STYLES
import styles from './index.module.scss';
// IMAGES
import CTA from './images/cta.png';
import Close from './images/close.svg';

type DATA = {
    onClose: any;
    title?: string;
}

const GetStarted = ({ onClose, title }: DATA) => {
    return (
        <div className={styles.root}>
            <div className={styles.close} onClick={onClose}>
                <Image src={Close} alt={'close'} priority={true}/>
            </div>
            <div className={styles.content}>
                <div className={styles.title}>{title}</div>
                <div className={styles.subtitle}>Download the Plannet app</div>
                <div className={styles.download}>
                    <Link href={`${process.env.NEXT_PUBLIC_APP_STORE}`} target="blank">
                        <Image src={CTA} alt={'apple store'} priority={true}/>
                    </Link>
                </div>
                <div className={styles.phone}>
                    Or Text us
                    <br/>
                    +1(917)-932-2005
                </div>
            </div>
        </div>
    );
};

export default GetStarted;
