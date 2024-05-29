import React, { useState } from 'react';
import styles from '../Summary.module.scss';
import Image from 'next/image';
import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import SaveCard from './SaveCard';

export default function PaymentCard({
  isOpen,
  onClose,
  onComplete,
  paymentInfo,
  tripId,
  tripLegId,
  oneClickAlliance,
  amount,
  tripRefetch,
}: any) {
  const [saveCard, setSaveCard] = useState(true);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const handleSaveCardDetails = (e: any) => {
    setSaveCard(e.target.checked);
    if (document != undefined && saveCard) {
      document.body.style.display = 'none';
    }
    document.body.style.display = 'block';
  };

  /**
   * Configurations for the payment card modal strip
   */
  const options: StripeElementsOptions | undefined = {
    clientSecret: paymentInfo?.clientSecret,
    // Fully customizable with appearance API.
    appearance: {
      theme: 'night',
    },
  };
  const stripePromise = loadStripe(paymentInfo?.publishableKey);

  if (!isOpen) return null;
  return (
    <>
      <div className={` ${styles.modal}`}>
        <div
          role="presentation"
          className={` w-full bg-[#1F133E] text-center items-center text-white p-5 
          fixed   ${styles.modal_cont}
           
          `}
        >
          <div className="flex cursor-pointer" onClick={() => onClose()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          {/* {!saveCard ? ( */}
          <div className="mt-5">
            <button className="bg-white text-black p-3 w-full rounded-[8px] flex text-center items-center justify-center">
              <Image
                className="mr-2"
                alt=""
                width={33}
                height={32}
                src="/assets/images/summary/apple-logo 1.svg"
              />
              <p className=" font-bold">Pay</p>
            </button>
            <div className="mt-5  flex items-center">
              <div
                className="flex-grow h-px bg-gray-400"
                style={{ background: 'gray' }}
              ></div>
              <span className="flex-shrink text-[16px] text-gray px-3">
                Or pay with a card
              </span>
              <div
                className="flex-grow h-px bg-gray-400"
                style={{ background: 'gray' }}
              ></div>
            </div>
            <div className="mt-5">
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm
                  amount={amount}
                  onComplete={onComplete}
                  handleSaveCard={(e: any) => handleSaveCardDetails(e)}
                  // oneClickId={oneClickAlliance}
                  tripLegId={tripLegId}
                  isPaymentSuccessful={isPaymentSuccessful}
                  tripRefetch={tripRefetch}
                  setPaymentSuccess={(isSuccessful: boolean) =>
                    setIsPaymentSuccessful(isSuccessful)
                  }
                />
              </Elements>
            </div>
          </div>
          {/* // ) : (
          //   <SaveCard isClose={() => setSaveCard(false)} />
          // )} */}
        </div>
      </div>
    </>
  );
}
