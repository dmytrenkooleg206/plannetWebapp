import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import Image from 'next/image';

import Modal from '@/components/Modals/Modal';
import Button from '@/components/Button/Button';
import { useGuests } from '@/contexts/GuestsProvider';
import { createTripGuests } from '@/api/tripGuest/tripGuest.service';

import DataBox from './DataBox';

const labels = {
  title: 'Invite Travelers',
  addPerson: 'Add Person',
  sendInvite: 'Send Invite',
};

const styles = {
  container: 'px-5 py-7 md:px-10 md:py-12 flex gap-7 flex-col',
  modalColor: 'gray-113',
  title: 'text-xl md:text-3xl grow',
  addPersonContainer: 'flex flex-row cursor-pointer gap-3',
  addPersonButton: 'text-base md:text-2xl',
  image: 'grow-0',
};

type InviteGuestModalProps = {
  tripId: string;
  onClose: Function;
  isOpen: boolean;
  onConfirm?: Function;
};

export default function InviteGuestModal({
  onClose,
  isOpen,
  tripId,
  onConfirm,
}: InviteGuestModalProps) {
  const queryClient = useQueryClient();
  const { guests, addGuest } = useGuests();
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(
    function checkDisabled() {
      setIsDisabled(guests.some((guest) => !guest.isValid));
    },
    [guests],
  );

  if (!isOpen) return null;

  return (
    <Modal
      size="md"
      animation="slideInTop"
      onClose={onClose}
      bgColor={styles.modalColor}
    >
      <div className={styles.container}>
        <h2 className={styles.title}>{labels.title}</h2>

        {guests.map((guest) => {
          return (
            <DataBox key={`${guest.id}`} guest={guest} closeModal={onClose} />
          );
        })}

        <div
          className={styles.addPersonContainer}
          onKeyDown={() => {}}
          role="button"
          tabIndex={0}
          onClick={addGuest}
        >
          <Image
          loading="lazy"
            className={styles.image}
            width={20}
            height={20}
            src="/assets/images/dashboard/plus.svg"
            alt={labels.title}
          />
          <span className={styles.addPersonButton}>{labels.addPerson}</span>
        </div>
        <Button
          isDisabled={isDisabled}
          text={labels.sendInvite}
          onClick={() =>
            createTripGuests(tripId, guests).then(() => {
              queryClient.refetchQueries(['trip', tripId]);
              onClose();
            })
          }
        />
      </div>
    </Modal>
  );
}
