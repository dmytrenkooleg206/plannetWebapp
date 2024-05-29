import { useRef, useState } from 'react';
import {
  updateEmail,
  updateFirstAndLastName,
  updateProfile,
  updateProfilePicture,
} from '@/api/user/user.service';
import Button from '@/components/Button/Button';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import AirportSearch from '@/components/AirportSearch/AirportSearch';
import { isInvalidEmail } from '@/lib/utils';
import Alert from '@/components/Alert/Alert';
import ImageCrop from '../../RegComponents/ImageCrop/ImageCrop';

import styles from './CreateProfileStep.module.scss';

type TextInputProps = {
  id: string;
  placeholder: string;
  value: string;
  onChange: Function;
  onEnter: Function;
};

function TextInput({
  id = '',
  placeholder = '',
  value,
  onChange,
  onEnter,
}: TextInputProps) {
  const handleChange = (e: any) => {
    onChange(e.target.value);
  };
  return (
    <input
      id={id}
      type="text"
      value={value}
      autoComplete="off"
      onChange={handleChange}
      className={styles.input_text}
      placeholder={placeholder}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onEnter();
      }}
    />
  );
}

type CreateProfileStepProps = {
  onNextStep: Function;
};
export default function CreateProfileStep({
  onNextStep,
}: CreateProfileStepProps) {
  const photoRef: any = useRef(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [userId, setUserId] = useState<string>('');

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');

  const [airport, setAirport] = useState<any>(null);

  const titleTexts = [
    'Create your profile',
    'Enter your email address',
    'Add your Home Base Airport',
    'Add your profile picture',
  ];

  const isButtonDisabled = () => {
    if (errorText) return true;
    if (progress === 0 && firstName && lastName) return false;
    if (progress === 1 && email) return false;
    if (progress === 2 && airport) return false;
    if (progress === 3) return false;
    return true;
  };

  const getImageBlob = async () => {
    const dataUrl = photoRef.current.getImage().toDataURL();
    const result = await fetch(dataUrl);
    const blob = await result.blob();
    return blob;
  };

  const handleContinue = async () => {
    if (isButtonDisabled()) return;
    if (progress === 1) {
      const err: string = isInvalidEmail(email);
      if (err) {
        setErrorText(err);
        return;
      }
    }
    setIsLoading(true);
    try {
      if (progress === 0) {
        const { user } = await updateFirstAndLastName(firstName, lastName);
        setUserId(user.id);
      } else if (progress === 1) await updateEmail(email, userId);
      else if (progress === 2) {
        if (airport.type === 'airport')
          await updateProfile({
            HomeBaseDuffelAirportId: airport.id,
            HomeBaseDuffelCityId: null,
          });
        else
          await updateProfile({
            HomeBaseDuffelCityId: airport.id,
            HomeBaseDuffelAirportId: null,
          });
      } else if (progress === 3 && photoRef.current) {
        const blobData: any = await getImageBlob();
        const formData = new FormData();
        formData.append('image', blobData, 'image');

        await updateProfilePicture(formData);
      }
      if (progress === 3) {
        onNextStep();
      }
      setProgress(progress + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCreateContent = () => {
    if (progress === 0)
      return (
        <>
          <TextInput
            id="firstname"
            placeholder="First name"
            value={firstName}
            onChange={(val: string) => setFirstName(val)}
            onEnter={() => {
              document.getElementById('lastname')?.focus();
            }}
          />
          <TextInput
            id="lastname"
            placeholder="Last name"
            value={lastName}
            onChange={(val: string) => setLastName(val)}
            onEnter={() => handleContinue()}
          />
        </>
      );
    if (progress === 1)
      return (
        <>
          <TextInput
            id="email"
            value={email}
            onChange={(val: string) => {
              if (errorText) setErrorText('');
              setEmail(val);
            }}
            placeholder="user@gmail.com"
            onEnter={() => handleContinue()}
          />
          {errorText ? (
            <div className={styles.block_alert}>
              <Alert errorText="Incorrect email format" />
              <div className={styles.text_error}>{errorText} </div>
            </div>
          ) : null}
        </>
      );
    if (progress === 2)
      return (
        <AirportSearch
          isLoading={isLoading}
          onAirportSelect={(newAirport: any) => setAirport(newAirport)}
        />
      );
    if (progress === 3) {
      return (
        <div>
          <ImageCrop photoRef={photoRef} isLoading={isLoading} />
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <img
        className={styles.image_logo}
        src="/assets/images/header/black_plannet.svg"
        alt="plannet"
      />
      <div className={styles.row_progress}>
        <ProgressBar size={4} progress={progress} />
      </div>
      <div className={styles.text_create_profile}>{titleTexts[progress]}</div>
      {renderCreateContent()}
      <div className={styles.space} />
      <Button
        text="Continue"
        width="320px"
        isDisabled={isButtonDisabled()}
        isLoading={isLoading}
        onClick={() => handleContinue()}
      />
    </div>
  );
}
