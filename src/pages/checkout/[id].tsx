import { useEffect, useState } from 'react';
import PaymentProccess from '@/components/Pages/payment/PaymentProccess';
import PlannerVerify from '@/components/Pages/payment/PaymentProccess/PlannerVerify/PlannerVerify';
import { getPlannetPhoneCodeFromLocalStorage } from '@/lib/localStorage/localStorage';

export default function Checkout() {
  const [phoneCode, setPhoneCode] = useState<any>();
  const [verfiySHow, setVerfiyShow] = useState<boolean>(false);
  const [isVerified, setIsVerfied] = useState<boolean>(false);

  useEffect(() => {
    setPhoneCode(getPlannetPhoneCodeFromLocalStorage);
  }, []);

  return (
    <>
      <main>
        {!verfiySHow ? (
          <PaymentProccess
            phoneCode={phoneCode}
            isVerified={isVerified}
            onVerifyShow={(isShow: any) => setVerfiyShow(isShow)}
          />
        ) : (
          <PlannerVerify
            onVerifyShow={(isShow: any) => setVerfiyShow(isShow)}
            onVerify={(isVerify: boolean) => setIsVerfied(isVerify)}
            onSetPhoneCode={(newCode: any) => setPhoneCode(newCode)}
          />
        )}
      </main>
    </>
  );
}
