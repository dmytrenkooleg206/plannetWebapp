import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import PhoneNumberInput from '@/components/PhoneNumberInput/PhoneNumberInput';
import { sendContactBusinessMessage } from '@/api/auth/auth.service';
import styles from './index.module.scss';

// eslint-disable-next-line @typescript-eslint/naming-convention
const company_sizes = [
  { id: 0, string: '1-10', value: '1' },
  { id: 1, string: '10-20', value: '10' },
  { id: 2, string: '20-50', value: '20' },
  { id: 3, string: '50-100', value: '50' },
  { id: 4, string: '100-500', value: '100' },
  { id: 5, string: '500+', value: '500' },
];
export default function BusinessContact() {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
  const [formatedPhoneNumber, setFormatedPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [companySize, setCompanySize] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isAgree, setIsAgree] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [isSentMessage, setIsSentMessage] = useState<boolean>(false);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState<boolean>(false);

  const onPhoneNumberChange = (
    newPhoneNumber: string,
    newCountryCode: string,
    newFormatedPhoneNumber: string,
  ) => {
    setPhoneNumber(newPhoneNumber);
    setCountryCode(newCountryCode);
    setFormatedPhoneNumber(newFormatedPhoneNumber);
  };

  useEffect(() => {
    if (
      firstName &&
      lastName &&
      (phoneNumber || countryCode || formatedPhoneNumber) &&
      email &&
      companySize &&
      message &&
      isAgree
    ) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [
    firstName,
    lastName,
    phoneNumber,
    countryCode,
    formatedPhoneNumber,
    email,
    companySize,
    message,
    isAgree,
  ]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setEmail('');
    setMessage('');
    setCompanySize('1');
    setIsAgree(false);
    setActive(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await sendContactBusinessMessage({
        email,
        firstName,
        lastName,
        message,
        companySize,
        countryCode,
        phoneNumber,
      });
      setIsSentMessage(true);
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let intv: any;
    if (isSentMessage) {
      intv = setInterval(() => setIsSentMessage(false), 5000);
    }
    return () => clearInterval(intv);
  }, [isSentMessage]);

  return (
    <div className={styles.root} id="contact_form">
      <div className={styles.content}>
        <h2 className={styles.title}>Want to learn more?</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.form_control}>
              <label className={styles.label}>First Name</label>
              <input
                type="text"
                className={styles.input_control}
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
              />
            </div>
            <div className={styles.form_control}>
              <label className={styles.label}>Last Name</label>
              <input
                type="text"
                className={styles.input_control}
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
              />
            </div>
            <div className={styles.form_control}>
              <label className={styles.label}>Phone Number</label>
              <PhoneNumberInput
                onPhoneActive={(isValid: boolean) =>
                  setIsValidPhoneNumber(isValid)
                }
                onPhoneChange={onPhoneNumberChange}
                // onEnter={handleContinue}
                customStyle="!p-[7px_15px] max-sm:!py-[10px] rounded-[8px] !text-[24px] text-[#1f133e] font-[700]"
              />
              {/* <input type="text" className={styles.input_control} /> */}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.form_control}>
              <label className={styles.label}>Company Email</label>
              <input
                type="email"
                className={styles.input_control}
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Johndoe@gmail.com"
              />
            </div>
            <div className={styles.form_control}>
              <label className={styles.label}>Company Size</label>
              <select
                className={styles.input_control}
                name="companySize"
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
              >
                <option
                  value=""
                  disabled
                  selected
                  className="!text-[#221A364D]"
                >
                  Select
                </option>

                {company_sizes.map((item, id) => (
                  <option value={item.value} key={id}>
                    {item.string}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.form_control}>
              <label className={styles.label}>Message</label>
              <textarea
                rows={10}
                className={styles.text_control}
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please tell us more about your business and travel needs"
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                name="isAgree"
                checked={isAgree}
                onChange={(e) => setIsAgree(e.target.checked)}
              />
              <span>
                By submitting this form, you consent to us collecting and using
                your provided information to contact you and share relevant
                information about our products or services. Your information
                will will be kept confidential and not shared with third parties
                without your consent. You can unsubscribe at any time.
              </span>
            </div>
          </div>
          <button type="submit" disabled={!active} className="submitBtn">
            Send Message
          </button>
        </form>
        {isSentMessage && (
          <div
            className={classNames(styles.successAlert, 'cursor-pointer')}
            onClick={() => setIsSentMessage(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
            >
              <path
                d="M29.5015 36.5848C30.1643 36.5842 30.7998 36.3204 31.2682 35.8514L43.7688 23.3509L40.2353 19.8174L29.5015 30.5512L23.7679 24.8176L20.2344 28.3511L27.7347 35.8514C28.2031 36.3204 28.8386 36.5842 29.5015 36.5848Z"
                fill="black"
              />
              <path
                d="M10.0835 56.6189C10.9972 56.9977 12.0028 57.0969 12.9729 56.904C13.9431 56.7112 14.8343 56.2349 15.5337 55.5355L20.7423 50.3353H48.6686C50.8788 50.3353 52.9985 49.4573 54.5614 47.8944C56.1243 46.3315 57.0023 44.2118 57.0023 42.0016V15.3337C57.0023 13.1235 56.1243 11.0038 54.5614 9.44089C52.9985 7.87801 50.8788 7 48.6686 7H15.3337C13.1235 7 11.0038 7.87801 9.44089 9.44089C7.87801 11.0038 7 13.1235 7 15.3337V52.002C7.00027 52.9902 7.2933 53.956 7.8421 54.7777C8.39089 55.5995 9.17084 56.2401 10.0835 56.6189ZM12.0002 45.3351V15.3337C12.0002 14.4496 12.3514 13.6017 12.9766 12.9766C13.6017 12.3514 14.4496 12.0002 15.3337 12.0002H48.6686C49.5527 12.0002 50.4005 12.3514 51.0257 12.9766C51.6508 13.6017 52.002 14.4496 52.002 15.3337V42.0016C52.002 42.8857 51.6508 43.7336 51.0257 44.3587C50.4005 44.9839 49.5527 45.3351 48.6686 45.3351H18.6672L12.0002 52.002V45.3351Z"
                fill="black"
              />
            </svg>
            Message Sent
          </div>
        )}
      </div>
    </div>
  );
}
