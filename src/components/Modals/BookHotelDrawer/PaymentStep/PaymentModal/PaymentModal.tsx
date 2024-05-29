import PNModal from '@/components/Modals/PNModal';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import CheckoutForm from './CheckoutForm';
import SuccessForm from './SuccessForm';

type PaymentModalProps = {
  paymentInfo: any;
  onClose: Function;
  onComplete: Function;
  allainceHoldId: string;
  tripId: string;
  tripLegId: string;
};
export default function PaymentModal({
  paymentInfo,
  onClose,
  onComplete,
  allainceHoldId,
  tripId,
  tripLegId,
}: PaymentModalProps) {
  const options = {
    // passing the client secret obtained from the server
    clientSecret: paymentInfo.clientSecret,
  };
  const stripePromise = loadStripe(paymentInfo.publishableKey);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [eventId, setEventId] = useState<string>('');
  return (
    <>
      <PNModal
        isOpen={!isPaymentSuccessful}
        onClose={onClose}
        maxWidth="max-w-md"
        isDark={false}
      >
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm
            allainceHoldId={allainceHoldId}
            tripLegId={tripLegId}
            isPaymentSuccessful={isPaymentSuccessful}
            setPaymentSuccess={(isSuccessful: boolean) =>
              setIsPaymentSuccessful(isSuccessful)
            }
            onSetEventId={(newEventId: string) => setEventId(newEventId)}
          />
        </Elements>
      </PNModal>
      <PNModal
        isOpen={isPaymentSuccessful}
        onClose={onClose}
        maxWidth="max-w-md"
        isDark
      >
        <SuccessForm
          onComplete={onComplete}
          tripId={tripId}
          eventId={eventId}
        />
      </PNModal>
    </>
  );
}
