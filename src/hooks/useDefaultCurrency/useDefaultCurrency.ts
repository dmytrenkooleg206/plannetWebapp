import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const storedCurrencyLocalStorageKey = 'plannet-default-currency';

export function useDefaultCurrency(): [
  string,
  Dispatch<SetStateAction<string>>,
] {
  const [defaultCurrency, setDefaultCurrency] = useState<string>('');

  useEffect(() => {
    const localStoragedCurrency = localStorage.getItem(
      storedCurrencyLocalStorageKey,
    );
    if (localStoragedCurrency) {
      setDefaultCurrency(JSON.parse(localStoragedCurrency));
    } else {
      setDefaultCurrency('USD');
    }
  }, []);

  return [defaultCurrency, setDefaultCurrency];
}
