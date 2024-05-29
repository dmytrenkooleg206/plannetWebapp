import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { CurrencyModal } from '@/components/Modals/CurrencyModal';

import { getPlannetUserIdFromLocalStorage } from '@/lib/localStorage/localStorage';
import { selectors } from '@/store/user/user.slice';

import { DesktopHeader } from './Headers/DesktopHeader';
import { MobileHeader } from './Headers/MobileHeader';

type HeaderProps = {
  isDark?: boolean;
};

export default function Header({ isDark = false }: HeaderProps) {
  const user = useSelector(selectors.user);

  const [isCurrencyModalOpen, setCurrencyModalOpen] = useState<boolean>(false);
  const [currencySymbolNative, setCurrencySymbolNative] = useState('');
  const [userId, setUserId] = useState<string>('');
  useEffect(() => {
    const symbol = localStorage.getItem('plannet-symbol-native');
    const userId = getPlannetUserIdFromLocalStorage();

    if (symbol) setCurrencySymbolNative(symbol);
    else setCurrencySymbolNative('$');
    setUserId(userId);
  }, []);

  useEffect(() => {
    if (user) {
      setUserId(user);
    }
  }, [user]);

  const handleCurrencyChange = (newSymbol: string, newSymbolNative: string) => {
    localStorage.setItem('plannet-symbol', newSymbol);
    localStorage.setItem('plannet-symbol-native', newSymbolNative);
    setCurrencySymbolNative(newSymbolNative);
  };

  return (
    <div className="z-10">
      <DesktopHeader
        isDark={isDark}
        toggleCurrencyModal={setCurrencyModalOpen}
        currencySymbolNative={currencySymbolNative}
        userId={userId}
        onUpdateUserId={(newUserId: string) => setUserId(newUserId)}
      />
      <MobileHeader
        isDark={isDark}
        toggleCurrencyModal={setCurrencyModalOpen}
        currencySymbolNative={currencySymbolNative}
        userId={userId}
        onUpdateUserId={(newUserId: string) => setUserId(newUserId)}
      />
      <CurrencyModal
        onClose={() => setCurrencyModalOpen(false)}
        isOpen={isCurrencyModalOpen}
        onChange={handleCurrencyChange}
      />
    </div>
  );
}
