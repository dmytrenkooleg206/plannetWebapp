import { useSelector } from 'react-redux';

import { selectors } from '@/store/user/user.slice';
import CityAnswer from './CityAnswer/CityAnswer';

import styles from './Answer.module.scss';

type AnswerProps = {
  answer: any;
  onAddCity?: Function;
  onChangeCity?: Function;
  onDeleteCity?: Function;
  onEditDateHelper?: Function;
  onEditRange?: Function;
  onChangeDate?: Function;
  onGoToQuestion?: Function;
};

const helperAnswers: any = {
  Hot: { icon: '/assets/images/onboarding/hot.png', text: 'hot' },
  Cold: { icon: '/assets/images/onboarding/cold.png', text: 'cold' },
  Party: { icon: '/assets/images/onboarding/party.svg', text: 'party' },
  Romantic: {
    icon: '/assets/images/onboarding/romantic.svg',
    text: 'romantic',
  },
  Budget: { icon: '/assets/images/onboarding/budget.svg', text: 'budget' },
  Culture: { icon: '/assets/images/onboarding/culture.svg', text: 'culture' },
  Relax: { icon: '/assets/images/onboarding/relax.svg', text: 'relax' },
  International: {
    icon: '/assets/images/onboarding/international.svg',
    text: 'international',
  },
  Domestic: {
    icon: '/assets/images/onboarding/domestic.svg',
    text: 'domestic',
  },
};

export default function Quetion({
  answer,
  onAddCity = () => {},
  onChangeCity = () => {},
  onDeleteCity = () => {},
  onEditDateHelper = () => {},
  onEditRange = () => {},
  onChangeDate = () => {},
  onGoToQuestion = () => {},
}: AnswerProps) {
  const user = useSelector(selectors.user);
  const { key: answerKey, answerText, answerType, time, cities } = answer;

  if (answerType === 'cities')
    return (
      <CityAnswer
        cities={cities}
        onAddCity={onAddCity}
        onChangeCity={onChangeCity}
        onDeleteCity={onDeleteCity}
        time={time}
        onChangeDate={onChangeDate}
      />
    );

  const renderAnswer = () => {
    if (answerKey === 'answer_number_guests_0')
      return (
        <div className={styles.block_answer}>
          <div className={styles.date_helper}>
            <div
              className={styles.button_edit}
              role="presentation"
              onClick={() => onGoToQuestion('number_guests')}
            >
              <img src="/assets/images/onboarding/edit.svg" alt="edit" />
            </div>
            {answerText}
          </div>
        </div>
      );
    if (answerKey.includes('budget'))
      return (
        <div className={styles.block_answer}>
          <div className={styles.date_helper} id="budget">
            <div
              className={styles.button_edit}
              role="presentation"
              onClick={() => onGoToQuestion('budget')}
            >
              <img src="/assets/images/onboarding/edit.svg" alt="edit" />
            </div>
            {answerText}
          </div>
        </div>
      );
    if (answerType === 'date_helper_month' || answerType === 'date_helper_days')
      return (
        <div className={styles.block_answer}>
          <div className={styles.date_helper}>
            <div
              className={styles.button_edit}
              role="presentation"
              onClick={() => onEditDateHelper(answerType)}
            >
              <img src="/assets/images/onboarding/edit.svg" alt="edit" />
            </div>
            {answerText}
          </div>
        </div>
      );
    if (answerType === 'go_when' || answerType === 'date_helper_days')
      return (
        <div className={styles.block_answer}>
          <div className={styles.date_helper}>
            <div
              className={styles.button_edit}
              role="presentation"
              onClick={() => onEditRange()}
            >
              <img src="/assets/images/onboarding/edit.svg" alt="edit" />
            </div>
            {answerText}
          </div>
        </div>
      );
    if (helperAnswers[answerText])
      return (
        <div
          className={`${styles.block_answer} ${
            styles[helperAnswers[answerText].text]
          }`}
        >
          <img
            className={styles.image_answer}
            src={helperAnswers[answerText].icon}
            alt="hot"
          />
          <div className={styles.text_answer}>{answerText}</div>
        </div>
      );
    return <div className={styles.block_answer}>{answerText}</div>;
  };

  return (
    <div className={styles.answer}>
      <div className={styles.answer_block}>
        {renderAnswer()}
        <div className={styles.text_time}>{time}</div>
      </div>
      <img
        className={styles.image_avatar}
        src={
          user?.profilePictureUrl_CF
            ? `${user.profilePictureUrl_CF}_720`
            : '/assets/images/planneritem/profile_placeholder.png'
        }
        alt=""
      />
    </div>
  );
}
