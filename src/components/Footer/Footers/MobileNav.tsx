import Link from 'next/link';
import styles from '../Footer.module.scss';

type MobileNavProps = {
  text?: string;
  href: string;
  color: string;
  fontsize: string;
};

export default function MobileNav({
  text,
  href,
  color = '#FFFFFF',
  fontsize = '24px',
}: MobileNavProps) {
  return (
    <Link
      className={styles.button_footer_nav}
      href={href}
      style={{ color, fontSize: fontsize }}
    >
      {text}
    </Link>
  );
}
