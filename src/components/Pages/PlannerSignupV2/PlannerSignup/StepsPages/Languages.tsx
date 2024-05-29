import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import styles from '../index.module.scss';

type LanguagesProps = {
  handleChange: Function;
  handleDelLanguages: Function;
  selectedLangs: string[];
  suggestedLanguages: any[];
};

export default function Languages({
  handleChange,
  handleDelLanguages,
  selectedLangs,
  suggestedLanguages,
}: LanguagesProps) {
  const [searchTerm, setSearchTerm] = useState(['', '', '']);
  const [selectedInput, setSelectedInput] = useState<number>(0);

  const handleSearch = (event: any, index: number) => {
    setSearchTerm((prevState) => {
      const newState = [...prevState];
      newState[index] = event.target.value;
      return newState;
    });
    setSelectedInput(index);
  };

  const filteredInterests = suggestedLanguages?.filter(
    (item) =>
      item &&
      item.name &&
      item.name.toLowerCase().includes(searchTerm[selectedInput].toLowerCase()),
  );

  const handleClickInterest = (interest: string) => {
    if (
      (interest.length >= 3 && interest.length <= 0) ||
      selectedLangs.some((item) => item && item === interest)
    )
      return;
    handleChange(interest);
    setSearchTerm((prevState) => {
      const newState = [...prevState];
      newState[selectedLangs.length] = '';
      return newState;
    });
  };

  return (
    <div className="flex-1">
      <div
        className={classNames(
          styles.innerContentTitle,
          'w-[414px] max-sm:w-[214px] mx-auto',
        )}
      >
        Add up to 3 languages you can speak and write fluently.
      </div>
      <div
        className={classNames(styles.inputWrapper, styles.inputWrapperLocation)}
      >
        <div className="flex !flex-wrap gap-[25px] mb-[25px]">
          {[...new Array(3).keys()].map((index) => (
            <>
              {selectedLangs.length >= index + 1 ? (
                <div className="flex items-center gap-[15px] text-[17px] font-[500] outline-none rounded-[8px] bg-[#FFFFFF] p-[10px_15px] text-[#1F133E]">
                  <p>{selectedLangs[index]}</p>
                  <span
                    onClick={() => handleDelLanguages(selectedLangs[index])}
                    className="cursor-pointer"
                  >
                    <FaTimes />
                  </span>
                </div>
              ) : (
                <input
                  type="text"
                  className="!w-fit placholder:text-[#FFFFFF99] text-[24px] font-[500] outline-none rounded-[8px] bg-[#FFFFFF1A] p-[10px_25px] text-white border border-dashed border-[#FFFFFF66]"
                  placeholder="Add language"
                  value={searchTerm[index]}
                  onChange={(e) => handleSearch(e, index)}
                  key={index}
                />
              )}
            </>
          ))}
        </div>
        <div>
          <p className="mb-[15px] uppercase text-[20px] text-[#FFFFFF80] font-[700]">
            Select Language
          </p>
          <div className="flex flex-wrap gap-[10px] mb-[25px] overflow-y-auto h-[200px]">
            {filteredInterests?.map((item, index) => (
              <div
                className={`flex p-[5px_10px] text-white text-[16px] max-sm:text-[14px] font-[500] gap-[10px] items-center border border-white rounded-[8px] ${
                  selectedLangs.some((pre) => pre && pre === item?.name) &&
                  'bg-white !text-[#1F133E]'
                }`}
                key={index}
              >
                {item?.name}
                <span
                  className="cursor-pointer"
                  onClick={() => handleClickInterest(item?.name)}
                >
                  <FaPlus />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
