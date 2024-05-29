import { useEffect, useRef, useState } from 'react';
import { isValidPhoneNumber } from 'libphonenumber-js';
import zonesData from 'moment-timezone/data/meta/latest.json';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { getPlaceHolder } from '@/lib/utils';
import styles from './LoginPhoneNumberInput.module.scss';

export type OnPhoneChange = (
  phone: string,
  dialCode: string,
  formatedValue: string,
) => void;

type PhoneNumberInputProps = {
  onPhoneActive?: Function;
  onPhoneChange?: OnPhoneChange;
  onEnter?: Function;
  isDark?: boolean;
  customStyle?: string;
};

export const getCountry = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions()
    .timeZone as keyof typeof zones;
  const { zones } = zonesData;
  if (!timezone || !zones[timezone]) {
    return 'us';
  }
  if (zones[timezone].countries && zones[timezone].countries.length)
    return zones[timezone].countries[0];
  return 'us';
};

export default function LoginPhoneNumberInput({
  onPhoneActive,
  onPhoneChange,
  onEnter,
  isDark = false,
  customStyle,
}: PhoneNumberInputProps) {
  const [country, setCountry] = useState('us');
  const [countryCode, setCountryCode] = useState('1');
  const [phone, setPhone] = useState('');
  const [placeholder, setPlaceholder] = useState<string>(' (123) 456 - 7890');

  useEffect(() => setCountry(getCountry()), []);

  const handlePhoneNumberChange = (
    val: string,
    country: any,
    _: any,
    formatedValue: string,
  ) => {
    const dialCode = val.slice(0, country.dialCode.length);
    // Check if the user use auto-fill or paste
    if (country.dialCode !== dialCode) {
      onPhoneActive?.(false);
      setCountryCode('');
      onPhoneChange?.('', '', '');
      return;
    }
    if (isValidPhoneNumber(formatedValue, country?.countryCode?.toUpperCase()))
      onPhoneActive?.(true);
    else onPhoneActive?.(false);
    if (val === country?.dialCode)
      setPlaceholder(getPlaceHolder(country.format));
    else setPlaceholder('');
    setPhone(val);
    setCountryCode(dialCode);
    onPhoneChange?.(val.slice(dialCode.length), dialCode, formatedValue);
  };

  return (
    <div
      className={`relative rounded border-black-200 border-solid border summary-login ${
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      } ${customStyle}`}
    >
      {countryCode && (
        <div
          className={`${styles['plannet-tel-input']}`}
          style={{ left: `${65 + countryCode.length * 15}px` }}
        >
          {placeholder}
        </div>
      )}

      {/* <IoIosArrowDown/> */}

      <PhoneInput
        inputClass={`${styles.input_class} placeholder:text-white-500 ${
          isDark ? 'text-white' : 'text-black'
        } ${customStyle}`}
        buttonClass={styles.button_class}
        dropdownClass={styles.dropdown_class}
        searchClass={styles.search_class}
        placeholder="+1 (123) 456 - 7890"
        country={country.toLocaleLowerCase()}
        value={phone}
        onChange={handlePhoneNumberChange}
        // enableSearch
        disableCountryCode={false}
        // searchPlaceholder="Search country code"
        onKeyDown={(e) => {
          if (e.key === 'Enter') onEnter?.();
        }}
      />
    </div>
  );
}
