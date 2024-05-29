import Loader from '@/components/Loader/Loader';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useInterval } from 'usehooks-ts';

import {
  lookupBookingAlliance,
  addBookingToTrip,
} from '@/api/beHotel/beHotel.service';
import { queryClient } from '@/pages/_app';

type CheckoutFormProps = {
  isPaymentSuccessful: boolean;
  allainceHoldId: string;
  tripLegId: string;
  setPaymentSuccess: Function;
  onSetEventId: Function;
};

function CheckoutForm({
  allainceHoldId,
  tripLegId,
  isPaymentSuccessful,
  setPaymentSuccess,
  onSetEventId,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isLookingup, setIsLookingup] = useState<boolean>(false);
  const [hotelBookingId, setHotelBookingId] = useState<string>('');
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const onAddBookingToTrip = async (bookingId: string) => {
    try {
      const { tripLeg: tripLegRes, itineraryEvent } = await addBookingToTrip({
        AllianceHotelBookingId: bookingId,
        TripLegId: tripLegId,
      });
      onSetEventId(itineraryEvent.id);
      queryClient.invalidateQueries(['trip', tripLegRes.TripId]);
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  useInterval(
    async () => {
      // Your custom logic here
      if (isPaymentSuccessful) return;
      try {
        const { allianceHotelBooking } = await lookupBookingAlliance({
          AllianceHoldBookingId: allainceHoldId,
        });
        if (
          !isPaymentSuccessful &&
          allianceHotelBooking &&
          allianceHotelBooking.id
        ) {
          setIsLookingup(false);
          setPaymentSuccess(true);
          setHotelBookingId(allianceHotelBooking.id);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // Delay in milliseconds or null to stop it
    isLookingup ? 1000 : null,
  );

  useEffect(() => {
    if (hotelBookingId && !isAdded) {
      setIsAdded(true);
      onAddBookingToTrip(hotelBookingId);
    }
  }, [hotelBookingId]);

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    try {
      setIsFetching(true);
      const result = await stripe.confirmPayment({
        // `Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {},
        redirect: 'if_required',
      });

      if (result.error) {
        // Show error to your customer (for example, payment details incomplete)
        // toast.error(result.error.message);
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
        // onAddBookingToTrip();
        setIsLookingup(true);
      }
    } catch (error) {
      console.log('error');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button
          disabled={!stripe}
          className="bg-green rounded-lg text-base md:text-xl py-2 px-10 mt-5 mx-auto flex text-white"
          type="submit"
        >
          {!stripe || !elements || isFetching || isLookingup ? (
            <Loader color="white" />
          ) : (
            'Pay'
          )}
        </button>
      </form>
    </>
  );
}

export default CheckoutForm;
