import React, { useEffect, useState } from 'react';
// STYLES
import classNames from 'classnames';
import styles from './index.module.scss';

type DATA = {
  handleGetStartedOpen: any;
  title: string;
  background: string;
  textColor: string;
  theme?: string;
};

export default function TextToPlannet({
  handleGetStartedOpen,
  title,
  background,
  textColor,
  theme,
}: DATA) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [showMsgButton, setShowMsgButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;

      if (scrollPosition > window.innerHeight * 0.2) {
        setShowMsgButton(true);
      } else {
        setShowMsgButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <div
      className={
        (classNames(styles.root, { [styles[`${theme}`]]: theme }), 'relative')
      }
      style={{ background }}
    >
      <div className={styles.content}>
        <h2 className={styles.title} style={{ color: textColor }}>
          {title}
        </h2>
        <div className={styles.explanations}>
          <div className={styles.explanationText} style={{ color: textColor }}>
            At Plannet we feel the best way to experience a city is by
            connecting to the <i>right </i> <b>people</b> in it. When you are
            visiting a friend, you can effortlessly get a pulse of whats best by
            just sending a text. When you don’t have someone available and want
            to stay in the know, we are there to provide you with that friend.
          </div>
        </div>
        <div className={styles.plannetWhiteBtn}>
          <div
            onClick={handleGetStartedOpen(true)}
            className={styles.getStarted}
          >
            Text To Plannet
          </div>
        </div>
      </div>

      {showMsgButton && (
        <div className="fixed bottom-[80px] cursor-pointer max-sm:bottom-[24px] right-[80px] max-sm:right-[10px] z-[1000]">
          <p
            className="flex items-center justify-center m-0 rounded-full w-[80px] max-sm:w-[50px] h-[80px] max-sm:h-[50px] bg-white"
            onClick={() => setIsContactOpen(!isContactOpen)}
          >
            {!isContactOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="81"
                height="81"
                viewBox="0 0 81 81"
                fill="none"
              >
                <circle cx="40.3477" cy="40.915" r="40" fill="white" />
                <path
                  d="M40.3478 20.915C29.3198 20.915 20.3478 29.887 20.3478 40.915C20.3478 44.7191 21.4148 48.3955 23.4402 51.5934L20.4428 59.0863C20.2449 59.5817 20.3615 60.1475 20.7384 60.5244C20.993 60.7796 21.3341 60.915 21.6811 60.915C21.8478 60.915 22.0158 60.8838 22.1766 60.82L29.6694 57.8226C32.8673 59.848 36.5438 60.915 40.3478 60.915C51.3758 60.915 60.3478 51.943 60.3478 40.915C60.3478 29.887 51.3758 20.915 40.3478 20.915ZM40.3478 58.2484C36.8426 58.2484 33.463 57.2028 30.5737 55.2256C30.3484 55.0713 30.0854 54.9925 29.8204 54.9925C29.6531 54.9925 29.4852 55.0238 29.325 55.0882L24.0743 57.1885L26.1746 51.9378C26.34 51.5244 26.2885 51.0563 26.0372 50.6891C24.06 47.7998 23.0145 44.4202 23.0145 40.915C23.0145 31.3571 30.7898 23.5817 40.3478 23.5817C49.9057 23.5817 57.6811 31.3571 57.6811 40.915C57.6811 50.473 49.9057 58.2484 40.3478 58.2484ZM43.0145 40.915C43.0145 42.3857 41.8185 43.5817 40.3478 43.5817C38.8771 43.5817 37.6811 42.3857 37.6811 40.915C37.6811 39.4443 38.8771 38.2484 40.3478 38.2484C41.8185 38.2484 43.0145 39.4443 43.0145 40.915ZM35.0145 40.915C35.0145 42.3857 33.8185 43.5817 32.3478 43.5817C30.8771 43.5817 29.6811 42.3857 29.6811 40.915C29.6811 39.4443 30.8771 38.2484 32.3478 38.2484C33.8185 38.2484 35.0145 39.4443 35.0145 40.915ZM51.0145 40.915C51.0145 42.3857 49.8185 43.5817 48.3478 43.5817C46.8771 43.5817 45.6811 42.3857 45.6811 40.915C45.6811 39.4443 46.8771 38.2484 48.3478 38.2484C49.8185 38.2484 51.0145 39.4443 51.0145 40.915Z"
                  fill="#221A36"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
              >
                <path
                  d="M30 38.6875L15 23.6875L17.6875 21L30 33.375L42.3125 21.0625L45 23.75L30 38.6875Z"
                  fill="#221A36"
                />
              </svg>
            )}
          </p>
        </div>
      )}

      {isContactOpen && (
        <div className="fixed bottom-[130px] right-[80px] bg-white rounded-[10px] w-[415px] z-[1000] max-sm:bottom-[84px] max-sm:right-[24px] max-sm:w-[90%]">
          <div className="flex bg-[#221A36] rounded-t-[8px] w-full h-[70px] items-center justify-between p-[20px]">
            <img src="assets/images/logos/Logo-sm.png" alt="Logo small" />
          </div>
          <div className="p-[15px]">
            {!isSubmitted ? (
              <form
                className="flex flex-col be-white gap-[20px] max-sm:gap-[15px]"
                onSubmit={handleSubmit}
              >
                <div className="flex gap-[20px] max-sm:flex-col max-sm:gap-[15px]">
                  <div className="flex flex-col gap-[10px]">
                    <label
                      className="text-[18px] text-[#221A36] font-[700]"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <input
                      className="w-full text-[18px] py-[12px] max-sm:py-[10px] px-[15px] rounded-[8px] border border-[#DCDEE0]"
                      type="text"
                      name="firstname"
                      placeholder="John"
                    />
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <label
                      className="text-[18px] text-[#221A36] font-[700]"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <input
                      className="w-full text-[18px] py-[12px] max-sm:py-[10px] px-[15px] rounded-[8px] border border-[#DCDEE0]"
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <label
                    className="text-[18px] text-[#221A36] font-[700]"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="w-full text-[18px] py-[12px] max-sm:py-[10px] px-[15px] rounded-[8px] border border-[#DCDEE0]"
                    type="email"
                    name="email"
                    placeholder="john.doe@email.com"
                  />
                </div>
                <div className="flex flex-col gap-[10px]">
                  <label
                    className="text-[18px] text-[#221A36] font-[700]"
                    htmlFor="description"
                  >
                    Message
                  </label>
                  <textarea
                    className="p-[18px] text-[18px] rounded-[8px] border border-[#DCDEE0]"
                    name="description"
                    rows={2}
                    placeholder="Thoughts, suggestions or feedback...."
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#1F133E] w-full text-white font-[700] text-[22px] py-[15px] max-sm:py-[10px] rounded-[8px]"
                >
                  Submit
                </button>
              </form>
            ) : (
              <div className="flex flex-col text-center	h-[435px] items-center justify-center gap-[20px]">
                <div className="flex items-center justify-center w-[100px] h-[100px] rounded-full bg-[#1F133E] max-sm:w-[50px] max-sm:h-[50px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100"
                    height="100"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <path
                      d="M72.1422 32.6495C73.1971 33.593 73.2921 35.2184 72.3545 36.2798L45.0952 67.1369C44.6103 67.6859 43.9152 68 43.1852 68C42.4552 68 41.7601 67.6859 41.2751 67.1369L27.6455 51.7084C26.7079 50.6469 26.8029 49.0216 27.8578 48.0781C28.9127 47.1346 30.5279 47.2302 31.4656 48.2917L43.1852 61.5581L68.5344 32.8631C69.472 31.8017 71.0873 31.706 72.1422 32.6495Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <p className="p-0 text-dark font-[700] text-[40px] max-sm:text-[30px]">
                  Your message has been received!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
