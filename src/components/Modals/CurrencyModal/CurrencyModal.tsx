import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Modal from '@/components/Modals/Modal';
import { TOP_CURRENCIES } from '@/lib/constants';
import { TypeCurrency } from '@/lib/types';
import { getAllCurrencies } from '@/api/web/web.service';
import styles from './CurrencyModal.module.scss';

type CurrencyModalProps = {
  onClose: Function;
  isOpen: boolean;
  onChange: Function;
};

export default function CurrencyModal({
  onClose,
  isOpen,
  onChange,
}: CurrencyModalProps) {
  const [allCurrencies, setAllCurrencies] = useState<TypeCurrency[]>([]);
  const [filteredCurrencies, setFilteredCurrencies] = useState<TypeCurrency[]>(
    [],
  );
  const { isSuccess, data } = useQuery('currencies', getAllCurrencies, {
    staleTime: 60000,
    cacheTime: 60000,
    retry: false,
    enabled: true,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const tempCurrencies: TypeCurrency[] = [];
      Object.keys(data).forEach((key: string) => {
        tempCurrencies.push({
          symbol: key,
          name: data[key].name,
          displayName: data[key].displayName,
          symbolNative: data[key].symbolNative,
        });
      });
      setAllCurrencies(tempCurrencies);
      setFilteredCurrencies(tempCurrencies);
    }
  }, [isSuccess, data]);

  const handleSelectCurrency = (newSymbol: string, newSymbolNative: string) => {
    onChange(newSymbol, newSymbolNative);
    onClose();
  };

  const handleSearchChange = (newSearch: string) => {
    setFilteredCurrencies(
      allCurrencies.filter((currency: TypeCurrency) => {
        return (
          currency.displayName
            .toLowerCase()
            .includes(newSearch.toLowerCase()) ||
          currency.symbol.toLowerCase().includes(newSearch.toLowerCase())
        );
      }),
    );
  };

  if (!isOpen) return null;

  return (
    <Modal size="md" animation="slideInTop" onClose={onClose}>
      <div className={styles.block_currency}>
        <div className={styles.text_gray}>Top Currency</div>
        <div className={styles.top_currencies}>
          {TOP_CURRENCIES.map((currency) => (
            <button
              key={currency.symbol}
              type="button"
              className={styles.button_currency}
              onClick={() =>
                handleSelectCurrency(currency.symbol, currency.symbolNative)
              }
            >
              {currency.displayName}
            </button>
          ))}
        </div>
        <div className={styles.text_gray}>All Currencies</div>
        <div className={styles.block_search}>
          <img src="/assets/images/landingpage/search.svg" alt="" />
          <input
            type="text"
            className={styles.input_search}
            placeholder="Search currency"
            autoComplete="off"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className={styles.all_currencies}>
          <div className={styles.filtered_currencies}>
            {filteredCurrencies.map((currency) => (
              <button
                key={currency.symbol}
                type="button"
                className={styles.button_currency}
                onClick={() =>
                  handleSelectCurrency(currency.symbol, currency.symbolNative)
                }
              >
                {currency.displayName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
