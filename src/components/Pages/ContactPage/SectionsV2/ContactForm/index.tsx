import React, { useEffect, useMemo, useState } from 'react';
import PNModal from '@/components/Modals/PNModal';
import Button from '@/components/Button/Button';
import { sendContactMessage } from '@/api/auth/auth.service';
import ThankYou from '@/components/layouts/MainLayout/ThankYou';
import { useWindowSize } from '@/hooks/useWindowSize';
import classNames from 'classnames';
import styles from './index.module.scss';

const MOBILE_WIDTH = 768;

export default function ContactForm() {
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width && width <= MOBILE_WIDTH, [width]);

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [thankYouPopup, setThankYouPopup] = useState(false);
  const [isCanSumbit, setIsCanSubmit] = useState(false);

  const handleClosePopup = () => {
    setThankYouPopup(false);
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setMessage('');
    setThankYouPopup(true);
  };

  const handleContactMessageSubmit = async (e: any) => {
    if (loading) return;
    if (firstName && lastName && email && message) {
      e.preventDefault();
      try {
        setLoading(true);
        await sendContactMessage({ email, firstName, lastName, message });
        resetForm();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (firstName && lastName && email && message) setIsCanSubmit(true);
    else setIsCanSubmit(false);
  }, [firstName, lastName, email, message]);

  return (
    <>
      <div className={styles.formContainer}>
        <form onSubmit={handleContactMessageSubmit} className={styles.form}>
          <div className={styles.inputsDouble}>
            <div className={styles.inputContainer}>
              <label htmlFor="firstname" className={styles.label}>
                First Name
              </label>
              <input
                id="firstname"
                type="text"
                className={styles.input}
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="lastname" className={styles.label}>
                Last Name
              </label>
              <input
                id="lastname"
                type="text"
                className={styles.input}
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="text"
              id="email"
              className={styles.input}
              placeholder="john.doe@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="message" className={styles.label}>
              Message to Plannet
            </label>
            <textarea
              id="message"
              className={styles.textarea}
              placeholder="Thoughts, suggestions or feedback...."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={styles.submit}
            disabled={!isCanSumbit}
          >
            Send Message
          </button>
        </form>
      </div>
      <PNModal
        isOpen={thankYouPopup}
        onClose={handleClosePopup}
        isDark={false}
        noPadding
        fitContent
      >
        <ThankYou onClose={handleClosePopup} />
      </PNModal>
    </>
  );
}
