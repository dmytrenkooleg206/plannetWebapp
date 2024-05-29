import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import styles from '../index.module.scss';

type InteretsProps = {
  handleChange: Function;
  handleDelInterests: Function;
  selectedInterests: string[];
  suggestedInterests: any[];
};

export default function Interest({
  handleChange,
  handleDelInterests,
  selectedInterests,
  suggestedInterests,
}: InteretsProps) {
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

  const filteredInterests = suggestedInterests?.filter(
    (item) =>
      item &&
      item.name &&
      item.name.toLowerCase().includes(searchTerm[selectedInput].toLowerCase()),
  );

  const handleClickInterest = (interest: any) => {
    if (
      selectedInterests.length === 3 ||
      selectedInterests.some((item) => item && item === interest.name)
    )
      return;
    handleChange(interest);
    setSearchTerm((prevState) => {
      const newState = [...prevState];
      newState[selectedInterests.length] = '';
      return newState;
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-[25px] mas-sm:gap-[20px]">
      <div
        className={classNames(
          styles.innerContentTitle,
          'w-[321px] max-sm:w-[214px] mx-auto',
        )}
      >
        Add 3 Interest that best describe you.
      </div>
      <div className="">
        <div className="flex flex-col gap-[25px] max-sm:gap-[20px] mb-[25px] max-sm:mb-[20px]">
          {[...new Array(3).keys()].map((index) => (
            <>
              {selectedInterests.length >= index + 1 ? (
                <div className="flex items-center justify-between text-[24px] max-sm:text-[15px] font-[500] outline-none rounded-[8px] bg-[#FFFFFF] p-[16px_25px] max-sm:p-[14px_20px] text-[#1F133E]">
                  <p>{selectedInterests[index]}</p>
                  <span
                    onClick={() => handleDelInterests(selectedInterests[index])}
                    className="cursor-pointer"
                  >
                    <FaTimes />
                  </span>
                </div>
              ) : (
                <input
                  type="text"
                  className="placholder:text-[#FFFFFF99] text-[24px] max-sm:text-[15px] font-[500] outline-none rounded-[8px] bg-[#FFFFFF1A] p-[16px_25px] max-sm:p-[14px_20px] text-white border border-dashed border-[#FFFFFF66]"
                  placeholder="Add Interest"
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
            Suggested
          </p>
          <div className="flex flex-wrap gap-[10px] mb-[25px] overflow-y-auto h-fit max-h-[200px] min-h-[100px]">
            {filteredInterests?.map((item, index) => (
              <div
                className={`flex p-[5px_10px] h-fit text-white text-[16px] max-sm:text-[14px] font-[500] gap-[10px] items-center border border-white rounded-[8px] ${
                  selectedInterests.some((pre) => pre && pre === item?.name) &&
                  'bg-white !text-[#1F133E]'
                }`}
                key={index}
                onClick={() => handleClickInterest(item)}
              >
                {item?.name}
                <span className="cursor-pointer">
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
