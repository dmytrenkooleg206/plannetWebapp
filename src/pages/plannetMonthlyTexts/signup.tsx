import PlannerSignup from '@/components/Pages/PlannetMonthlyTextsSignUp/PlannerSignup/PlannerSignup';
import PlannerVerify from '@/components/Pages/PlannetMonthlyTextsSignUp/PlannerVerify/PlannerVerify';
import { getPlannetUserIdFromLocalStorage } from '@/lib/localStorage/localStorage';
import { useEffect, useState } from 'react';

export default function Signup() {
  const [userId, setUserId] = useState<any>();
  useEffect(() => {
    setUserId(getPlannetUserIdFromLocalStorage());
  }, []);
  return (
    <>
      <main>
        {userId ? (
          <PlannerSignup userId={userId} />
        ) : (
          <PlannerVerify
            onSetUserid={(newUserId: any) => setUserId(newUserId)}
          />
        )}
      </main>
    </>
  );
}
