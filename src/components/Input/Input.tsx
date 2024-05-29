import React from 'react';
import PhoneNumberInput from '@/components/PhoneNumberInput/PhoneNumberInput';

const theme = {
  white: {
    border: '',
    input: 'text-black',
    inputBgColor: 'bg-white',
  },
  black: {
    border: 'border-white-300 rounded-lg',
    input: 'text-white',
    inputBgColor: 'bg-black',
  },
};

const styles = {
  container: 'flex flex-col gap-2',
  input:
    'w-full rounded-lg border-solid border border-white-300 px-5 py-3 text-base md:text-2xl',
  inputLabel: 'text-base md:text-2xl',
};

type Colors = 'white' | 'black';

type InputProps = {
  placeholder?: string;
  label?: string;
  type?: 'text' | 'phonenumber';
  color?: Colors;
  onChange?: Function;
  inputRef?: any;
};

export function useInput() {
  const ref = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState<any>(undefined);
  return {
    ref,
    value,
    attributes: {},
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue(e.target.value),
  };
}

function Input({
  placeholder = '',
  label = '',
  type = 'text',
  color = 'white',
  onChange,
  inputRef,
}: InputProps) {
  return (
    <div className={styles.container}>
      {label && <span className={styles.inputLabel}>{label}</span>}
      {
        {
          text: (
            <input
              ref={inputRef.ref}
              className={`${styles.input} ${theme[color].input} ${theme[color].inputBgColor}`}
              placeholder={placeholder}
              onChange={inputRef.onChange}
            />
          ),
          phonenumber: (
            <PhoneNumberInput
              onPhoneActive={(isActive: boolean) => onChange?.(isActive)}
              onPhoneChange={(countryCode, phoneNumber) =>
                inputRef.onChange({
                  target: { value: { countryCode, phoneNumber } },
                })
              }
              isDark
              customStyle={`${theme[color].border} ${theme[color].input} ${theme[color].inputBgColor}`}
            />
          ),
        }[type]
      }
    </div>
  );
}

export default React.forwardRef(Input);
