import styles from './BookHotel.module.scss';

export default function BookHotel() {
  return (
    <section className={styles.section_book}>
      <div className={styles.text_title}>SMARTER TRAVEL</div>
      <div className={styles.divider} />
      <div className={styles.text_description}>
        You pay the same, and get way more!
      </div>
      <div className={styles.container}>
        <div className={styles.block_book}>
          <div className={styles.book_title}>
            Book <br /> your Hotel
          </div>
          <div className={styles.book_text}>
            and we <span>Plannet</span> for free!
          </div>
        </div>
        <div className={styles.book_background}>
          <div className={styles.triangle} />
        </div>
      </div>
    </section>
  );
}
