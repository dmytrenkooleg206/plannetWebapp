import styles from './Question.module.scss';

type QuestionProps = {
  questionText: string;
  questionType: number | undefined;
};

export default function Question({
  questionText,
  questionType,
}: QuestionProps) {
  const renderQuestionTag = () => {
    if (questionType === 1) {
      return <div className={styles.location_help}>Location Helper</div>;
    }
    if (questionType === 2) {
      return <div className={styles.location_help}>Date Helper</div>;
    }
    return <div className={styles.text_plannet}>Plannet</div>;
  };
  return (
    <div className={styles.question}>
      <img
        className={styles.image_question}
        src="/assets/images/onboarding/plannet_chat.svg"
        alt=""
      />
      <div className={styles.question_block}>
        {renderQuestionTag()}
        <div className={styles.text_question}>{questionText}</div>
      </div>
    </div>
  );
}
