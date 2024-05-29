import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors, actions } from '@/store/onboarding/onboarding.slice';

import Modal from '@/components/Modals/Modal';
import Button from '@/components/Button/Button';

import { MONTHS, NIGHT_DAYS } from '@/lib/constants';
import styles from './DateHelperModal.module.scss';

type DateHelperModalProps = {
  onClose: Function;
  isOpen: boolean;
  setpIndex: number;
  onComplete: Function;
  onEdit: Function;
};

export default function DateHelperModal({
  onClose,
  isOpen,
  onComplete,
  setpIndex = 0,
  onEdit,
}: DateHelperModalProps) {
  const dispatch = useDispatch();
  const month = useSelector(selectors.month);
  const numNightsRange = useSelector(selectors.numNightsRange);
  const [selectedMonth, setSelectedMonth] = useState<number>(-1);
  const [selectedDays, setSelectedDays] = useState<number>(-1);
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if (setpIndex === 1 && selectedMonth === -1) {
      setSelectedMonth(MONTHS.findIndex((item: any) => item.label === month));
    }
    if (setpIndex === 2 && selectedDays === -1) {
      setSelectedDays(
        NIGHT_DAYS.findIndex((item) => item.value === numNightsRange),
      );
    }
  }, [setpIndex]);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(0);
    setSelectedMonth(-1);
    setSelectedDays(-1);
    onClose();
  };

  const handleDone = () => {
    if (setpIndex === 1 && selectedMonth >= 0) {
      dispatch(actions.setMonth(MONTHS[selectedMonth].label));
      onEdit(MONTHS[selectedMonth], 0);
      handleClose();
      return;
    }
    if (setpIndex === 2 && selectedDays >= 0) {
      dispatch(actions.setNumNightsRange(NIGHT_DAYS[selectedDays].value));
      onEdit(NIGHT_DAYS[selectedDays], 1);
      handleClose();
      return;
    }
    if (step === 0 && selectedMonth >= 0) {
      setStep(1);
    } else if (step === 1 && selectedDays >= 0) {
      dispatch(actions.setMonth(MONTHS[selectedMonth].label));
      dispatch(actions.setNumNightsRange(NIGHT_DAYS[selectedDays].value));
      onComplete(MONTHS[selectedMonth], NIGHT_DAYS[selectedDays]);
      handleClose();
    }
  };

  const isDisabledButton = () => {
    if (setpIndex === 1 && selectedMonth >= 0) return false;
    if (setpIndex === 2 && selectedDays >= 0) return false;
    if (step === 0 && selectedMonth >= 0) return false;
    if (step === 1 && selectedDays >= 0) return false;
    return true;
  };

  return (
    <Modal size="md" animation="slideInTop" onClose={handleClose}>
      <div className={styles.block_date_helper}>
        <div className={styles.question}>
          <img
            className={styles.image_question}
            src="/assets/images/onboarding/plannet_chat.svg"
            alt=""
          />
          <div className={styles.question_block}>
            <div className={styles.location_help}>Date Helpers</div>
            {setpIndex === 0 && step === 0 && (
              <div className={styles.text_question}>Select a Month</div>
            )}
            {setpIndex === 0 && step === 1 && (
              <div className={styles.text_question}>Select a Range</div>
            )}
          </div>
        </div>
        {setpIndex === 1 || (setpIndex === 0 && step === 0) ? (
          <div className={styles.months_list}>
            {MONTHS.map((month) => {
              return (
                <div
                  key={month.key}
                  className={`${styles.month_button} ${
                    month.key === selectedMonth ? styles.selected : ''
                  }`}
                  onClick={() => setSelectedMonth(month.key)}
                  role="presentation"
                >
                  {month.label}
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.months_list}>
            {NIGHT_DAYS.map((days) => {
              return (
                <div
                  key={days.key}
                  className={`${styles.days_button} ${
                    days.key === selectedDays ? styles.selected : ''
                  }`}
                  onClick={() => setSelectedDays(days.key)}
                  role="presentation"
                >
                  {days.label}
                </div>
              );
            })}
          </div>
        )}
        <Button
          text="Done"
          onClick={() => handleDone()}
          isDisabled={isDisabledButton()}
        />
      </div>
    </Modal>
  );
}
