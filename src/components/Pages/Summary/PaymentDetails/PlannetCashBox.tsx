import React from 'react';

export default function PlannetCashBox({
  bgColor,
  textColor,
  setChecked,
  checked,
  value,
}: any) {
  return (
    <>
      {value > 0 && (
        <div
          className={`${bgColor} p-2 rounded-lg flex flex-start gap-2 mt-4 `}
        >
          <div className="flex justify-between w-full">
            <div className="flex gap-2 items-top">
              <input
                type="checkbox"
                id="plannetCash"
                name="plannetCash"
                value=""
                className="rounded h-4 w-4 mt-1.5"
                onChange={() => setChecked()}
              />

              <label htmlFor="plannetCash">
                <span className={`text-lg font-bold ${textColor}`}>
                  Pay with plannet Cash
                </span>{' '}
                <br />
                <span className={`text-base font-light ${textColor}`}>
                  Available Balance ${value / 100}.
                </span>
              </label>
            </div>
            <p
              className={`text-ls flex justify-end font-extrabold text-xl ${textColor}`}
            >
              -${value / 100}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
