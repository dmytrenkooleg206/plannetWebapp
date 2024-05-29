/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { FaChevronLeft } from 'react-icons/fa';

import Image from 'next/image';
import { useRouter } from 'next/router';
import { persistPlannetPhoneCodeInLocalStorage } from '@/lib/localStorage/localStorage';
import styles from './index.module.scss';
import Congrates from './Congrates';
// IMAGES
import Logo from '../images/logo.svg';
import PaymentForm from './PaymentForm';
import AskModal from './Modals/AskModal';
import ResultModal from './Modals/ResultModal';

type PaymentsRegisterProps = {
  phoneCode: string;
  onSetPhoneCode: Function;
};

const stripe = require('stripe')(
  // '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',
  'sk_test_51KbV8eBVdnPoK2qmRTCXydtXBPoSy2mcE8RKxZzzPUrJnNFSFPEpJV87hgBJVAtHQ74JZuiEU6vQHxqGfnioWC8600hDMeIpn0',
);

const stripePromise = loadStripe(
  // 'pk_live_51KbV8eBVdnPoK2qmn12rcl1CbZm80dSSqUTFHZ173LBEamZgEdliX5aXwLW3b9uNtW8IahQXIEmoXQuQYf8Gwzhn00dEjV1LRH',
  'pk_test_51KbV8eBVdnPoK2qmWkdhotiZd9Ie541Oo3jyo5r1PsFHSXnrQUFIogK8nLRRsfc8YzyficMb4u5JSh3UY4DSSi4000X2oR1bOm',
);

let didMount = false;
export default function PaymentsRegister({
  phoneCode,
  onSetPhoneCode,
}: PaymentsRegisterProps) {
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [askModalShow, setAskModalShow] = useState<boolean>(false);
  const [resultModalShow, setResultModalShow] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [beforeRoute, setBeforeRoute] = useState<any>(null);
  const router = useRouter();
  const [customerId, setCustomerId] = useState<string>('');
  const [cardAction, setCardAction] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [defaultCard, setDefaultCard] = useState<any>(null);
  const [cards, setCards] = useState<object[]>([]);

  const options: any = {
    mode: 'setup',
    currency: 'usd',
    appearance: {
      theme: 'light',
      variables: {
        colorBackground: '#352A51',
        colorTextPlaceholder: 'AEAAB9',
        colorText: '#fff',
        colorDanger: '#F54040',
        spacingUnit: '2px',
        gridRowSpacing: '25px',
      },
      rules: {
        '.Tab': {
          display: 'none',
        },
        '.Input': {
          padding: '15px 20px',
          outline: 'unset',
          border: 'none',
          fontSize: '24px',
          fontWeight: '500',
          borderRadius: '8px',
        },
        '.TermsText': {
          display: 'none',
        },
        '.Label': {
          fontSize: '30px',
          fontWeight: '500',
          marginBottom: '15px',
        },
        '.Error': {
          fontSize: '18px',
          color: '#F54040',
        },
      },
    },
    paymentMethodCreation: 'manual',
  };

  const fetchCards = async () => {
    const paymentMethods = await stripe.customers.listPaymentMethods(
      customerId,
      { type: 'card' },
    );
    console.log('$#$#$#', paymentMethods.data);
    setCards(paymentMethods?.data);
  };

  const fetchCustomers = async () => {
    const { data } = await stripe.customers.list({
      email: `${phoneCode}@mail.com`,
    });
    if (data.length === 0) {
      const customer = await stripe.customers.create({
        email: `${phoneCode}@mail.com`,
      });
      setCustomerId(customer.id);
      return;
    }
    setCustomerId(data[0].id);
  };

  useEffect(() => {
    setBeforeRoute(router.query?.beforeRoute);
    if (localStorage.getItem('defaultCard')) {
      setDefaultCard(localStorage.getItem('defaultCard'));
    }
  }, []);

  useEffect(() => {
    if (!didMount) {
      didMount = true;
      fetchCustomers();
    }
  }, [customerId]);

  const handleGoBack = () => {
    if (beforeRoute) {
      router.back();
      return;
    }
    if (progress) {
      setProgress(progress - 1);
    } else {
      onSetPhoneCode('');
      persistPlannetPhoneCodeInLocalStorage('');
    }
  };

  const handleAction = async () => {
    switch (cardAction) {
      case 'delete':
        await stripe.paymentMethods.detach(selectedCard.id);
        setAskModalShow(false);
        setResultModalShow(true);
        fetchCards();
        break;
      default:
        setAskModalShow(false);
        setResultModalShow(true);
        setDefaultCard(selectedCard.id);
        localStorage.setItem('defaultCard', selectedCard.id);
        break;
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Link href="/" className={styles.logo}>
          <Image src={Logo} alt="plannet" priority />
        </Link>
        {isAdded ? (
          <Congrates
            setIsAdded={setIsAdded}
            setAskModalShow={setAskModalShow}
            setCardAction={setCardAction}
            setSelectedCard={setSelectedCard}
            fetchCards={fetchCards}
            defaultCard={defaultCard}
            selectedCardItem={selectedCard}
            setIsLoading={setIsLoading}
            cards={cards}
          />
        ) : (
          <>
            <div className={styles.form}>
              <div className={styles.header}>
                Add Payment Method
                <div className={styles.arrowBack} onClick={handleGoBack}>
                  <FaChevronLeft />
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <div className={styles.innerContent}>
                  {stripePromise && (
                    <Elements stripe={stripePromise} options={options}>
                      <PaymentForm
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        setIsAdded={setIsAdded}
                        before={beforeRoute}
                        customerId={customerId}
                        stripe={stripe}
                      />
                    </Elements>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {askModalShow && (
        <AskModal
          mode={cardAction}
          selectedCard={selectedCard}
          handleConfirm={handleAction}
          setAskModalShow={setAskModalShow}
        />
      )}
      {resultModalShow && (
        <ResultModal
          mode={cardAction}
          setResultModalShow={setResultModalShow}
        />
      )}
    </div>
  );
}
