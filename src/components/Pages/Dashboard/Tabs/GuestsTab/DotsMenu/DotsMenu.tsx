import { useCallback, useState } from 'react';
import Image from 'next/image';
import { useQueryClient } from 'react-query';

import Button from '@/components/Button/Button';
import { StandardConfirmModal } from '@/components/Modals/StandardConfirmModal';
import {
  deleteTripGuests,
  updateTripGuests,
} from '@/api/tripGuest/tripGuest.service';

import type { Guest } from '@/lib/types';

const labels = {
  dotsIcon: 'options',
  tooltipTextBorder: 'Co-Host',
  tooltipButtonMake: 'Make ',
  tooltipButtonRemove: 'Remove from trip',
  removeGuest: 'Remove Guest',
  guestRemoved: 'Guest Removed',
  titleConfirmCoHost: 'Are you sure make Co-Host?',
  confirm: 'Confirm',
  remove: 'Remove',
  madeCoHost: 'Guest made Co-Host',
};

const styles = {
  dotsMenu: 'relative',
  dotsIcon: 'm-auto grow-0 cursor-pointer',
  tooltipWrapper:
    'absolute -right-6 top-9 w-[270px] md:w-[320px] bg-gray-113 z-10 rounded-xl p-5',
  tooltipIndicator:
    'w-0 h-0 block absolute right-6 -top-[12px] border-x-[8px] border-b-[12px] border-solid border-t-[transparent] border-r-[transparent] border-l-[transparent] border-b-gray-113',
  tooltipTextBorder:
    'border px-1 md:px-2 py-1 pt-2 ml-2 uppercase leading-4 rounded',
};

export type DotsMenuProps = {
  currentUser: Guest | null;
  user: Guest;
  setCurrentUser: Function;
  tripId: string;
  flashMessageRef: any;
};

export default function DotsMenu({
  currentUser,
  user,
  setCurrentUser,
  tripId,
  flashMessageRef,
}: DotsMenuProps) {
  const queryClient = useQueryClient();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);

  const guestId = currentUser?.TripGuest?.id;
  const isCurrentUser = currentUser?.id === user.id;

  const onOpen = useCallback(() => {
    if (!user.id) return;
    if (isCurrentUser) {
      setCurrentUser(null);
      return;
    }

    setCurrentUser(user);
  }, [isCurrentUser, setCurrentUser, user]);

  const closeConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setCurrentUser(null);
  }, [setCurrentUser]);

  const closeChangeRoleModal = useCallback(
    () => setIsChangeRoleModalOpen(false),
    [],
  );

  const confirmRemoveGuest = useCallback(() => {
    if (!guestId) {
      return;
    }

    closeConfirmModal();
    flashMessageRef.current?.show(labels.guestRemoved);

    deleteTripGuests(guestId)
      .then(() => queryClient.refetchQueries(['trip', tripId]))
      .finally(flashMessageRef.current?.loaded);
  }, [closeConfirmModal, flashMessageRef, guestId, queryClient, tripId]);

  const confirmMakeCoHost = useCallback(() => {
    if (!guestId) {
      return;
    }

    closeChangeRoleModal();
    flashMessageRef.current?.show(labels.madeCoHost);
    updateTripGuests(guestId, { isCoHost: true })
      .then(() => queryClient.refetchQueries(['trip', tripId]))
      .finally(flashMessageRef.current?.loaded);
  }, [closeChangeRoleModal, flashMessageRef, guestId, queryClient, tripId]);

  const firstName =
    currentUser?.firstName || currentUser?.TripGuest?.firstNameOnInvite;
  const lastName =
    currentUser?.lastName || currentUser?.TripGuest?.lastNameOnInvite;

  return (
    <>
      <div className={styles.dotsMenu}>
        <Image
        loading="lazy"
          className={styles.dotsIcon}
          width={20}
          height={20}
          src="/assets/images/dashboard/dots.svg"
          alt={labels.dotsIcon}
          onClick={onOpen}
        />
        {isCurrentUser && (
          <div className={styles.tooltipWrapper}>
            <span className={styles.tooltipIndicator} />
            <Button
              color="black"
              radius="regular"
              text={
                <>
                  {labels.tooltipButtonMake}
                  <span className={styles.tooltipTextBorder}>
                    {labels.tooltipTextBorder}
                  </span>
                </>
              }
              justify="start"
              icon="plus"
              onClick={() => setIsChangeRoleModalOpen(true)}
            />
            <br />
            <Button
              color="black-red"
              radius="regular"
              text={labels.tooltipButtonRemove}
              icon="close"
              justify="start"
              onClick={() => setIsConfirmModalOpen(true)}
            />
          </div>
        )}
      </div>
      <StandardConfirmModal
        type="removeGuest"
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmRemoveGuest}
        title={`${labels.removeGuest} "${firstName} ${lastName}" ?`}
        confirmBtnText={labels.remove}
      />
      <StandardConfirmModal
        type="changeRole"
        isOpen={isChangeRoleModalOpen}
        onClose={closeChangeRoleModal}
        onConfirm={confirmMakeCoHost}
        title={labels.titleConfirmCoHost}
        confirmBtnText={labels.confirm}
      />
    </>
  );
}
