import { FaTimes } from 'react-icons/fa';

type AskModalProps = {
  mode: string;
  selectedCard: any;
  handleConfirm: Function;
  setAskModalShow: Function;
};
export default function AskModal({
  mode,
  selectedCard,
  handleConfirm,
  setAskModalShow,
}: AskModalProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[#00000099] z-[100]">
      {/* <div className="relative"> */}
      <div className="flex flex-col justify-center absolute w-[500px] max-sm:w-[calc(100%-76px)] h-fit rounded-[25px] px-[70px] pt-[84px] pb-[30px] max-sm:p-[15px] max-sm:pt-[42px] bg-[#fff] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]">
        <p
          className="absolute top-[30px] right-[30px] max-sm:top-[15px] max-sm:right-[15px] text-[24px] text-[#1F133E]"
          onClick={() => setAskModalShow(false)}
        >
          <FaTimes />
        </p>
        <p className="text-[#1F133E] text-[36px] font-[700] max-sm:text-[22px] text-center mb-[10px] max-sm:mb-[8px]">
          {mode === 'delete' ? 'Delete Card' : 'Set As Primary'}
        </p>
        <p className="text-[#1F133E] text-[24px] font-[400] max-sm:text-[18px] text-center mb-[30px] max-sm:mb-[15px]">
          {mode === 'delete'
            ? `Are you sure you want to Delete your ${selectedCard.card.brand} Card End ${selectedCard.card.last4}?`
            : `Are you sure you want to set as \nprimary your ${selectedCard.card.brand} Card End ${selectedCard.card.last4}?`}
        </p>
        <button
          className={`rounded-[8px] text-[#fff] text-[24px] max-sm:w-[100%] max-sm:mb-[15px] font-[700] py-[12px] w-[290px] mx-[auto] mb-[25px] ${
            mode === 'delete' ? 'bg-[#FF453A]' : 'bg-[#1F133E]'
          }`}
          onClick={() => handleConfirm()}
        >
          {mode === 'delete' ? 'Delete Card' : 'Set As Primary'}
        </button>
        <p
          className="text-center cursor-pointer text-[24px] max-sm:text-[18px] font-[700] text-[#1F133E]"
          onClick={() => setAskModalShow(false)}
        >
          <u>Cancel</u>
        </p>
      </div>
      {/* </div> */}
    </div>
  );
}
