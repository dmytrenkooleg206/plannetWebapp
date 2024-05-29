import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const storedTokenLocalStorageKey = 'plannet-token';

export function usePlannetToken(): [string, Dispatch<SetStateAction<string>>] {
  const [plannetToken, setPlannetToken] = useState<string>('');

  useEffect(() => {
    const localStoragedToken = localStorage.getItem(storedTokenLocalStorageKey);
    if (localStoragedToken) {
      setPlannetToken(JSON.parse(localStoragedToken));
    } else {
      setPlannetToken('USD');
    }
  }, []);

  return [plannetToken, setPlannetToken];
}
