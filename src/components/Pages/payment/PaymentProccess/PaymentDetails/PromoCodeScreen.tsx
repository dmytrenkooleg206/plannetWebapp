import { promoCodeValidate } from '@/api/promoCode/promoCode.service';
import Loader from '@/components/Loader/Loader';
import React, { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';

type TextInputProps = {
  id: string;
  placeholder: string;
  value: string;
  onChange: Function;
  onEnter: Function;
};

export default function PromoCodeScreen({
  isPromoCodeScreenOpen,
  setIsPromoCodeScreenOpen,
  promoCode,
  setPromoCode,
  setPromoCodeDiscount,
}: any) {
  const [errorText, setErrorText] = useState<string>('');
  const [successText, setSuccessText] = useState<string>('');
  const [promoCodeLocal, setPromoCodeLocal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const result = await promoCodeValidate({ code: promoCodeLocal });
      setPromoCode(promoCodeLocal);
      setPromoCodeDiscount(result.promoCode.amountOffUsdCents / 100);
      setSuccessText(`$${result.promoCode.amountOffUsdCents / 100}`);
      setErrorText('');
      setTimeout(() => {
        setIsPromoCodeScreenOpen(false);
      }, 2000);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setErrorText('Sorry, the code you entered is no longer valid.');
      setPromoCode('');
      setSuccessText('');
      setPromoCodeDiscount(0);
    }
  };
  if (!isPromoCodeScreenOpen) return null;
  return (
    <section className="max-w-[500px] fixed top-0 left-[50%] z-50 w-full mx-auto -translate-x-[50%] min-h-[100dvh] bg-[#1F133E] text-white px-5 py-7 md:px-8">
      <div className="flex relative">
        <button
          className="absolute left-0 top-0"
          onClick={() => setIsPromoCodeScreenOpen(false)}
        >
          <IoIosArrowBack className="text-3xl" />
        </button>
        <p className="font-bold text-2xl w-full text-center">Promo code</p>
      </div>
      <div className="text-left text-base sm:text-xl font-bold mt-6">
        <p className="mb-2">Redeem a code</p>
        <TextInput
          id="promocode"
          placeholder="Invite or promo code"
          value={promoCodeLocal}
          onChange={(val: string) => setPromoCodeLocal(val)}
          onEnter={() => {
            handleSubmit();
          }}
        />
        {errorText ? (
          <div className="mt-2 font-light">
            <p className="text-[#f00]">{errorText}</p>
          </div>
        ) : null}
        {successText ? (
          <div className="mt-2 font-light">
            <p>
              {successText}{' '}
              <span className="font-light">discount successfully applied!</span>
            </p>
          </div>
        ) : null}
      </div>
      <div className="mt-8 w-full absolute bottom-32 left-0 px-8 ">
        <button
          className="bg-[#7440F5] rounded-lg w-full h-[3rem] mb-2.5 font-bold"
          onClick={handleSubmit}
        >
          {isLoading ? <Loader color="white" /> : <span>Submit</span>}
        </button>
      </div>
    </section>
  );
}

function TextInput({
  id = '',
  placeholder = '',
  value,
  onChange,
  onEnter,
}: TextInputProps) {
  const handleChange = (e: any) => {
    onChange(e.target.value);
  };
  return (
    <input
      id={id}
      type="text"
      value={value}
      autoComplete="off"
      onChange={handleChange}
      className="bg-white-100 p-3 rounded-lg w-full focus:outline-none"
      placeholder={placeholder}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onEnter();
      }}
    />
  );
}
