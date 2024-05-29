import { useRouter } from 'next/router';

import Button from '@/components/Button/Button';

import styles from './TripCard.module.scss';

export default function TripCard() {
  const router = useRouter();
  return (
    <div>
      <div className={styles.trip_card}>
        <div className={styles.block_trip_detail}>
          <div className={styles.trip_detail}>
            <div className={styles.trip_name}>Euro Trip</div>
            <div className={styles.trip_period}>Mar 12 - Mar 16</div>
            <div className={styles.row}>
              <div className={styles.trip_when_start}>In 40 days</div>
              <div className={styles.text_hostedby}>Hosted By</div>
              <div className={styles.host_avatar}>KG</div>
            </div>
          </div>
        </div>
        <div className={styles.trip_location}>
          <div>📍</div>
          <div className={styles.text_location}>
            New York, USA, London, UK, Barcelona, Spain
          </div>
        </div>
      </div>
      <Button
        text="Continue"
        width="340px"
        onClick={() => router.push('/dashboard')}
      />
    </div>
  );
}
