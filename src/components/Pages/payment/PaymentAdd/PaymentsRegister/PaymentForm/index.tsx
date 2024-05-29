import Button from '@/components/Button/Button';
import {
  useElements,
  useStripe,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';
import { useState } from 'react';

type PaymentFormProps = {
  isLoading: boolean;
  setIsLoading: Function;
  setIsAdded: Function;
  before: any;
  customerId: string;
  stripe: any;
};
export default function PaymentForm({
  isLoading,
  setIsLoading,
  setIsAdded,
  before,
  customerId,
  stripe,
}: PaymentFormProps) {
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [holderName, setHolderName] = useState<string>('');
  const [cards, setCards] = useState<any>();

  const stripe2 = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handleContinue = async (e: any) => {
    e.preventDefault();
    if (!holderName) {
      setErrorMessage("Input the holder's name");
      return;
    }
    if (!elements || !stripe2) {
      return;
    }
    const { error: submitError } = await elements.submit();
    if (submitError) {
      return;
    }
    // try {
    setIsLoading(true);
    const { paymentMethod, error } = await stripe2.createPaymentMethod({
      elements,
      params: {
        billing_details: {
          name: holderName,
        },
      },
    });

    if (error) {
      console.error(error);
    } else {
      try {
        await stripe.paymentMethods.attach(paymentMethod.id, {
          customer: customerId,
        });
        if (before)
          router.push({
            pathname: '/checkout',
            query: { isAddedCard: customerId },
          });
        else setIsAdded(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <form
      className="flex flex-col flex-1 gap-[25px] !text-white mb-[10px]"
      onSubmit={handleContinue}
    >
      <div className="flex flex-col w-full gap-[10px]">
        <label className="text-white text-[30px] font-[500] max-sm:text-[20px]">
          Cardholder’s Name
        </label>
        <input
          className={`bg-[#ffffff1a] text-white placeholder-[#FFFFFF99] font-[500] text-[24px] max-sm:text-[20px] p-[12px_25px] max-sm:p-[10px_20px] rounded-[8px] outline-none ${
            errorMessage &&
            !holderName &&
            'border border-[2px] border-[#F54040]'
          }`}
          placeholder="John Doe"
          value={holderName}
          onChange={(e) => {
            if (e.target.value) {
              setErrorMessage('');
            } else setErrorMessage("Input the holder's name");
            setHolderName(e.target.value);
          }}
        />
        {errorMessage && <p className="text-[#F54040]">{errorMessage}</p>}
      </div>
      <PaymentElement />
      <div className="max-sm:mb-[50px]">
        <Button
          type="submit"
          text="Save Payment Method"
          isDisabled={!stripe2}
          isLoading={isLoading}
          color="gray"
        />
      </div>
    </form>
  );
}
