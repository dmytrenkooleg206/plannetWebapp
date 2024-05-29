import VerificationInput from 'react-verification-input';
import styles from '../../../../components/CodeInput/CodeInput.module.scss';

type CodeInputProps = {
    isError: boolean;
    errorText: string;
    onCodeChange: Function;
    onEnter: Function;
};
export default function VerifyInput({
    isError,
    errorText,
    onCodeChange,
    onEnter,
}: CodeInputProps) {
    return (
        <>
            <div
                className="flex justify-center"
                role="presentation"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') onEnter();
                }}
            >
                <VerificationInput
                    classNames={{
                        character: `text-[#ffffff] bg-white-100 border rounded-lg text-2xl flex justify-center items-center ${isError ? "border-[#FF453A] border-2": 'border-white-100'}`,
                        container: 'flex',
                    }}
                    onChange={(code) => onCodeChange(code)}
                />
            </div>
            {isError ? (
                <div className={`ml-[-5.3rem] mt-2  ${styles.block_alert}`}>
                    <p className='text-[#FF453A] text-lg'>
                        {errorText}
                    </p>
                </div>
            ) : null}
        </>
    );
}
