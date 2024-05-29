import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Loader from '@/components/Loader/Loader';
import { TripDashboard } from '@/components/Pages/Dashboard';
import { getPlannetUserIdFromLocalStorage } from '@/lib/localStorage/localStorage';
import Signup from '../signup';

export default function Dashboard() {
  const router: any = useRouter();
  const [tripId, setTripId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    if (router.query.tripid) {
      setTripId(router.query.tripid);
    }
  }, [router]);

  useEffect(() => {
    const userId = getPlannetUserIdFromLocalStorage();
    if (userId) {
      setUserId(userId);
    }
  }, []);

  if (!tripId)
    return (
      <div className="h-screen flex my-auto">
        <Loader size={50} />
      </div>
    );
  if (userId) return <TripDashboard tripId={tripId} />;
  router.push('/signin');
}
