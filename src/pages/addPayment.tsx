import PaymentsRegister from '@/components/Pages/payment/PaymentAdd/PaymentsRegister';
import PlannerVerify from '@/components/Pages/payment/PaymentAdd/PlannerVerify/PlannerVerify';
import {
  getPlannetPhoneCodeFromLocalStorage,
  getPlannetUserIdFromLocalStorage,
} from '@/lib/localStorage/localStorage';
import { useEffect, useState } from 'react';

export default function AddPayment() {
  // const [userId, setUserId] = useState<any>();
  const [phoneCode, setPhoneCode] = useState<any>();
  useEffect(() => {
    setPhoneCode(getPlannetPhoneCodeFromLocalStorage);
    // setUserId(getPlannetUserIdFromLocalStorage);
  }, []);
  return (
    <>
      <main>
        {phoneCode ? (
          <PaymentsRegister
            phoneCode={phoneCode}
            onSetPhoneCode={(newPhoneCode: any) => setPhoneCode(newPhoneCode)}
          />
        ) : (
          <PlannerVerify
            // onSetUserid={(newUserId: any) => setUserId(newUserId)}
            onSetPhoneCode={(newPhoneCode: any) => setPhoneCode(newPhoneCode)}
          />
        )}
      </main>
    </>
  );
}
