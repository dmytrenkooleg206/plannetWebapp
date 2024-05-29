import VerificationInput from 'react-verification-input';
import Alert from '@/components/Alert/Alert';
import styles from './CodeInput.module.scss';

type CodeInputProps = {
  isError: boolean;
  errorText: string;
  onCodeChange: Function;
  onEnter: Function;
  customClass?: string;
};
export default function CodeInput({
  isError,
  errorText,
  onCodeChange,
  onEnter,
  customClass,
}: CodeInputProps) {
  return (
    <>
      <div
        className={`flex justify-center ${customClass}`}
        role="presentation"
        onKeyDown={(e) => {
          if (e.key === 'Enter') onEnter();
        }}
      >
        <VerificationInput
          classNames={{
            character: `rounded-lg text-2xl flex justify-center items-center ${
              isError && styles.errorInput
            }`,
            container: 'flex',
          }}
          onChange={(code) => onCodeChange(code)}
        />
      </div>
      {isError ? (
        <div className={styles.block_alert}>
          <p className="text-[#FF4D42] text-[18px] max-sm:text-[16px] font-[400] mt-[15px]">
            {errorText}{' '}
          </p>
        </div>
      ) : null}
    </>
  );
}
