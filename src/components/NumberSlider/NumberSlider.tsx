type NumberSliderProps = {
  title: string;
  description: string;
  value: number;
  onChange: Function;
  min?: number;
};
export default function NumberSlider({
  title,
  description,
  value,
  onChange,
  min = 0,
}: NumberSliderProps) {
  const handleChange = (type: number) => {
    if (type === 0 && value > 0 && value > min) onChange(value - 1);
    if (type === 1) onChange(value + 1);
  };
  return (
    <div className="bg-white shadow-xl rounded-lg p-2.5 md:p-5 flex mt-5">
      <div className="text-lg md:text-2xl my-auto mr-2 md:mr-5">{title}</div>
      <div className="text-base md:text-xl my-auto opacity-60">
        {description}
      </div>
      <div className="flex ml-auto">
        <button
          className="my-auto"
          onClick={() => handleChange(0)}
          type="button"
        >
          <img src="/assets/images/onboarding/decrease.svg" alt="decrease" />
        </button>
        <div className="text-base md:text-xl my-auto mx-2.5 my-7">
          {value.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })}
        </div>
        <button
          className="my-auto"
          onClick={() => handleChange(1)}
          type="button"
        >
          <img src="/assets/images/onboarding/increase.svg" alt="increase" />
        </button>
      </div>
    </div>
  );
}
