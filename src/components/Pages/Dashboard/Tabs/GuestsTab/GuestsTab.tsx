import { useCallback, useState } from 'react';

import type { Guest } from '@/lib/types';
import GuestsProvider from '@/contexts/GuestsProvider';
import { GuestsList } from './GuestsList';
import InviteGuestModal from './InviteGuestModal/InviteGuestModal';

const styles = {
  container: 'pt-14 max-w-[1200px] w-full px-6 mx-auto mb-24',
  wrapper: 'max-w-[440px] w-full ',
};

export type GuestTabProps = {
  tripId: string;
  users: Guest[];
};

export default function GuestsTab({ users, tripId }: GuestTabProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const onOpenInviteModal = useCallback(() => setIsInviteModalOpen(true), []);
  const closeInviteModal = useCallback(() => setIsInviteModalOpen(false), []);

  return (
    <GuestsProvider>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <GuestsList
            users={users}
            tripId={tripId}
            onOpenInviteModal={onOpenInviteModal}
          />
        </div>
      </div>
      <InviteGuestModal
        tripId={tripId}
        isOpen={isInviteModalOpen}
        onClose={closeInviteModal}
      />
    </GuestsProvider>
  );
}
