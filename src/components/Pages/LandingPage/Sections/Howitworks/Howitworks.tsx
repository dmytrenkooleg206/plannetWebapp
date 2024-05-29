import styles from './Howitworks.module.scss';

export default function Howitworks() {
  const explanations = [
    {
      id: 1,
      img: '/assets/images/landingpage/howitworks1.png',
      title: 'Seamless Planning',
      text: 'In one click, create a trip where you can plan your itinerary and keep track of your expenses with friends and family',
    },
    {
      id: 2,
      img: '/assets/images/landingpage/howitworks2.png',
      title: 'Flights & Hotels',
      text: 'We have all your favorites with 300+ airlines and over 1M+ properties! Yes, we make sure you get your points and miles! ',
    },
    {
      id: 3,
      img: '/assets/images/landingpage/howitworks3.png',
      title: 'Plannet',
      text: 'Local experts take care of the planning for you. So easy, you just have to make it to the airport!',
    },
  ];
  return (
    <section className={styles.section_howitwork}>
      <div className={styles.container}>
        <div className={styles.text_title}>HOW IT WORKS</div>
        <div className={styles.divider} />
        <div className={styles.text_description}>
          The easiest way to plan a trip
        </div>
        <div className={styles.explanations}>
          {explanations.map((item) => {
            return (
              <div className={styles.explanation} key={item.id}>
                <img
                  className={styles.explanation_img}
                  src={item.img}
                  alt={item.title}
                />
                <div className={styles.explanation_title}>{item.title}</div>
                <div className={styles.explanation_text}>{item.text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
