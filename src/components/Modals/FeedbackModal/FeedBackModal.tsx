import { sendContactMessage } from '@/api/auth/auth.service';
import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Modal from '../Modal';
import Styles from './Feedback.module.scss';

type FeedBackModalProps = {
  onClose: Function;
  isOpen: boolean;
  userdata: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
};

type FormValues = {
  content: string;
};

const questions = [
  'Have any questions or feedback on how we can make Plannet better?',
  // 'What made you choose Plannet for your Trip?',
  // 'Any other feedback or ideas for us?',
  // 'Can we contact you about this feedback? If so, please provide your email.',
  'Thank you for your feedback',
];

interface IObjectKeys {
  [key: number]: {
    required: string;
    validate?: { matchPattern: any };
  };
}

const errorMessage: IObjectKeys = {
  0: {
    required: 'Feedback is required',
  },
  1: {
    required: 'Answer is required',
  },
  2: {
    required: 'Answer is required',
  },
  3: {
    required: 'Email is required',
  },
};
export default function FeedBackModal({
  onClose,
  isOpen,
  userdata,
}: FeedBackModalProps) {
  const [questionIntex, setQuestionIndex] = useState(0);
  const [btnLoading, setBtnLoading] = useState(false);
  const [data, setData] = useState<any>({
    feedback: '',
    error: '',
  });

  if (!userdata?.user) {
    return <></>;
  }

  const handleChange = (e: { target: { value: any } }) => {
    setData({ feedback: e.target.value });
  };

  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const handleSubmit = async () => {
    try {
      if (data.feedback != '') {
        setData({ error: '' });
        if (questionIntex === 3) {
          const validate = reg.test(data.feedback);
          if (!validate) {
            setData({ error: { required: 'Enter valid Email' } });
          }
          setQuestionIndex(questionIntex + 1);
        } else {
          if (questionIntex === 1) {
            setQuestionIndex(0);
            onClose();
            return;
          }
          const { email, firstName, lastName } = userdata.user || {};
          setBtnLoading(true);
          await sendContactMessage({
            message: data.feedback,
            email: email || '',
            firstName: firstName || '',
            lastName: lastName || '',
          });
          setQuestionIndex(questionIntex + 1);
          setData({ feedback: '' });
          setBtnLoading(false);
          return;
        }
      } else {
        setData({ error: errorMessage[questionIntex] });
      }
    } catch (err) {
      setBtnLoading(false);
      toast.error('Error while creating feedback');
    }
  };

  let btnName = questionIntex === 0 ? 'Submit' : 'Continue';
  btnName = questionIntex === 1 ? 'Done' : btnName;
  let placeholder =
    questionIntex === 0 ? 'Type your feedback here' : 'Type your answer here';
  placeholder = questionIntex === 3 ? 'name@example.com' : placeholder;

  if (!isOpen) return null;

  return (
    <Modal
      size="md"
      animation="slideInTop"
      onClose={onClose}
      bgColor="black"
    >
      <form
        // onSubmit={handleSubmit}
        className={`py-6 px-8  ${Styles.feedback_thanks_continer}`}
      >
        {questionIntex === 1 ? (
          <div className={Styles.parent}>
            <div className={Styles.parentBtn}>
              <svg
                width="50"
                height="50"
                viewBox="0 0 70 70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M50.4999 22.8551C51.2384 23.5155 51.3049 24.6533 50.6485 25.3963L31.567 46.9963C31.2276 47.3805 30.741 47.6004 30.23 47.6004C29.719 47.6004 29.2325 47.3805 28.893 46.9963L19.3523 36.1963C18.6959 35.4533 18.7624 34.3155 19.5008 33.6551C20.2392 32.9946 21.37 33.0615 22.0263 33.8046L30.23 43.091L47.9744 23.0046C48.6308 22.2615 49.7615 22.1946 50.4999 22.8551Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        ) : null}
        <p
          className={`my-4 text-slate-500 ${
            questionIntex !== 1
              ? `text-2xl ${Styles.feedback_question}`
              : `${Styles.feedback_thanks_message} text-center`
          }`}
        >
          {questions[questionIntex]}
        </p>
        {questionIntex === 1 ? null : (
          <div className={Styles.feedback_textbox}>
            <textarea
              onChange={handleChange}
              value={data.feedback}
              rows={3}
              className={`${Styles.feedback_textarea} block p-2.5 w-full text-sm text-gray-900 bg-black rounded-lg mt-4`}
              placeholder={placeholder}
            />
            {data.error && data.error != '' && (
              <span className={`mt-2 text-sm ${Styles.error_message}`}>
                {data.error?.required}
              </span>
            )}
          </div>
        )}
        <button
          className={`${Styles.feedback_update_btn} bg-emerald-500 text-white active:bg-emerald-600 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
          type="button"
          onClick={handleSubmit}
        >
          {btnLoading ? (
            <div className={Styles.loader}>
              <div aria-label="Loading..." role="status">
                <svg className="h-5 animate-spin" viewBox="3 3 18 18">
                  <path
                    className="full-gray-800"
                    fill="#9066f7"
                    d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                  />
                  <path
                    className="fill-white-800"
                    d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
                  />
                </svg>
              </div>
            </div>
          ) : (
            btnName
          )}
        </button>
      </form>
    </Modal>
  );
}
