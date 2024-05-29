import { useState, useRef } from 'react';
import { FaChevronDown, FaChevronUp, FaPlus, FaTimes } from 'react-icons/fa';
import { useOutsideAlerter } from '@/hooks/useOutsideAlert';

type PNDropdownProps = {
  text: string;
  placeholder: string;
  options: any[];
  filters: any[];
  onSelect: Function;
};
export default function PNDropdown({
  filters,
  text,
  placeholder,
  options,
  onSelect,
}: PNDropdownProps) {
  const wrapperRef = useRef(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useOutsideAlerter(wrapperRef, () => {
    setIsOpen(false);
  });
  return (
    <div className="w-full relative" ref={wrapperRef}>
      <button
        type="button"
        className="w-full flex bg-black-100 rounded-lg py-3 px-5 my-auto justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className=" text-xl font-medium">{text}</div>
        {isOpen ? (
          <FaChevronUp className="my-auto ml-2" />
        ) : (
          <FaChevronDown className="my-auto ml-2" />
        )}
      </button>
      {isOpen && (
        <div className="absolute bg-white right-0 w-[calc(100vw-40px)] lg:w-[500px] shadow-md rounded-md p-5 top-[60px] z-10">
          <div className="flex flex-wrap">
            {options.map((option) => {
              if (!option.selected) return null;
              return (
                <button
                  key={`filter_${text}_${option.index}`}
                  className="bg-black text-white flex px-2 py-1 rounded-md mr-2.5 mb-2.5"
                  type="button"
                  onClick={() => onSelect(option.index)}
                >
                  <div>{option.text}</div>
                  <FaTimes className="my-auto ml-1 font-thin" />
                </button>
              );
            })}
          </div>
          <div className="text-black-300 text-left my-1 font-bold">
            {placeholder}
          </div>
          <div className="flex flex-wrap">
            {options.map((option) => {
              let style = 'flex px-2 py-1 rounded-md mr-2.5 mb-2.5';
              if (!option.selected) style += ' bg-black-100';
              else style += ' bg-black text-white';
              return (
                <button
                  key={`${text}_${option.index}`}
                  className={style}
                  type="button"
                  onClick={() => onSelect(option.index)}
                >
                  <div>{option.text}</div>
                  <FaPlus className="my-auto ml-1 font-thin text-black" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
