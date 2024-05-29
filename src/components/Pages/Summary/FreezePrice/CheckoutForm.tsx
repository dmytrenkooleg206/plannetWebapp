import Loader from '@/components/Loader/Loader';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { useInterval } from 'usehooks-ts';

export default function CheckoutForm({
  onComplete,
  handleSaveCard,
  oneClickId,
  tripLegId,
  isPaymentSuccessful,
  setPaymentSuccess,
  amount,
  tripRefetch,
}: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isLookingup, setIsLookingup] = useState<boolean>(false);

  useInterval(
    async () => {
      // Your custom logic here
      if (isPaymentSuccessful) return;
      try {
        if (!isPaymentSuccessful && oneClickId) {
          setIsLookingup(false);
          setPaymentSuccess(true);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // Delay in milliseconds or null to stop it
    isLookingup ? 1000 : null,
  );

  /**
   * Method to submit card details
   * @param event
   * @returns
   */
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
      setIsLookingup(true);
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
        setIsLookingup(false);
        onComplete();
      }
    } catch (error) {
      console.log('error');
    } finally {
      tripRefetch();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <div className="flex items-center mt-5">
          <input
            id="checked-checkbox"
            type="checkbox"
            value=""
            className="w-4 h-4 text-[#7440F5]-600 bg-[#7440F5] border-[#7440F5]-300 rounded "
            onChange={(e) => handleSaveCard(e)}
          />
          <label
            htmlFor="checked-checkbox"
            className="ml-2 text-[16px] font-bold text-gray dark:text-gray-300"
          >
            Save this card for future Plannet Inc. Payment
          </label>
        </div>
        <button
          disabled={!stripe}
          className="bg-[#7440F5] mt-5 p-3 bg-white w-full rounded-[8px] flex text-center items-center justify-center"
        >
          {!stripe || !elements || isFetching || isLookingup ? (
            <Loader color="white" />
          ) : (
            <p className="text-[20px] text-[#1f133e] font-bold">
              Pay {amount} US$
            </p>
          )}
        </button>
      </form>
    </div>
  );
}
