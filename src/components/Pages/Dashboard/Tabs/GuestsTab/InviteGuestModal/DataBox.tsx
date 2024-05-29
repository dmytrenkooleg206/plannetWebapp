import { useCallback, useEffect, useState, memo } from 'react';
import Image from 'next/image';

import type { Guest } from '@/lib/types';
import { useGuests } from '@/contexts/GuestsProvider';
import { Input, useInput } from '@/components/Input';

const labels = {
  firstName: 'First Name',
  lastName: 'Last Name',
  phoneNumber: 'Phone Number',
};

const styles = {
  container: 'border-b pb-7 border-white-200 relative',
  row: 'flex flex-row gap-6 self-start',
  col: 'mt-8 flex-col',
  halfColumn: 'basis-1/2',
  closeButton: 'absolute top-0 right-0 cursor-pointer',
};

type DataBoxProps = {
  guest: Guest;
  closeModal: Function;
};

function DataBox({ guest, closeModal }: DataBoxProps) {
  const id = guest.tempid;
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const { setGuests } = useGuests();

  const firstNameRef = useInput();
  const lastNameRef = useInput();
  const phoneRef = useInput();

  const removeGuest = useCallback(
    () =>
      setGuests((guests: Guest[]) => {
        if (guests.length === 1) {
          closeModal();
          return guests;
        }
        return guests.filter((item) => item.tempid !== id);
      }),
    [setGuests, id],
  );

  const validate = useCallback(() => {
    const isFirstNameValid = firstNameRef.value?.length! > 0;
    const isLastNameValid = lastNameRef.value?.length! > 0;
    const isValid = isFirstNameValid && isLastNameValid && isPhoneValid;

    setGuests((guests: Guest[]) =>
      guests.reduce((acc, item) => {
        let newItem = item;
        if (item.tempid === id) {
          newItem = {
            ...item,
            firstNameOnInvite: firstNameRef.value,
            lastNameOnInvite: lastNameRef.value,
            countryCode: phoneRef.value?.countryCode,
            phoneNumber: phoneRef.value?.phoneNumber,
            isValid,
          };
        }
        return acc.concat(newItem);
      }, [] as Guest[]),
    );
  }, [
    firstNameRef.value,
    lastNameRef.value,
    phoneRef.value,
    isPhoneValid,
    setGuests,
    id,
  ]);

  useEffect(validate, [validate]);

  return (
    <div className={styles.container}>
      <Image
      loading="lazy"
        className={styles.closeButton}
        width={20}
        height={20}
        src="/assets/images/onboarding/close.png"
        alt="Invite travelers"
        onClick={removeGuest}
      />
      <div className={styles.row}>
        <div className={styles.halfColumn}>
          <Input
            inputRef={firstNameRef}
            placeholder="John"
            label={labels.firstName}
            color="black"
          />
        </div>
        <div className={styles.halfColumn}>
          <Input
            inputRef={lastNameRef}
            placeholder="Doe"
            label={labels.lastName}
            color="black"
          />
        </div>
      </div>
      <div className={styles.col}>
        <Input
          inputRef={phoneRef}
          label={labels.phoneNumber}
          type="phonenumber"
          color="black"
          onChange={(isActive: boolean) =>
            isActive !== undefined && setIsPhoneValid(isActive)
          }
        />
      </div>
    </div>
  );
}

export default memo(DataBox);
