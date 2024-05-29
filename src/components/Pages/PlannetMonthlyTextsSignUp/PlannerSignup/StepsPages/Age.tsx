import classNames from 'classnames';
import styles from '../index.module.scss';
import { ageSuggests } from '../suggestValues';

type AgeProps = {
  handleChange: Function;
  selectedID: number | null;
};
export default function Age({ handleChange, selectedID }: AgeProps) {
  const handleSelect = (id: number) => {
    handleChange(id);
  };
  return (
    <div className="flex-1">
      <div className={styles.innerContentTitle}>
        What best describes your age?
      </div>
      <div
        className={classNames(styles.inputWrapper, styles.inputWrapperLocation)}
      >
        <div className="relative flex flex-col gap-[25px] mt-[25px]">
          {ageSuggests.map((item, index) => (
            <div
              className={`flex items-center justify-center cursor-pointer gap-[12px] p-[18px_20px] max-sm:p-[14px_20px] bg-[#FFFFFF1A] rounded-[8px] text-white text-[24px] max-sm:text-[15px] font-[400] ${
                selectedID === index ? 'bg-white !text-[#1F133E]' : ''
              }`}
              key={index}
              onClick={() => handleSelect(index)}
            >
              {item.range}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
