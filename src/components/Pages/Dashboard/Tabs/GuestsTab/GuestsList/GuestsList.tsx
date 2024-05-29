import { useRef, useState } from 'react';
import Image from 'next/image';
import { FlashMessage, FlashMessageRef } from '@/components/FlashMessage';
import { DotsMenu } from '@/components/Pages/Dashboard/Tabs/GuestsTab/DotsMenu';
import { toast } from 'react-toastify';
import type { Guest } from '@/lib/types';

const labels = {
  title: 'Trip Guests',
  shareIcon: 'share',
  role: 'Planner',
  addIcon: 'Invite travelers',
  txtAddGuests: 'Invite other travelers',
};

const styles = {
  wrapper: 'bg-black rounded-md p-4 mb-5 space-y-4 max-h-screen',
  titleContainer: 'flex',
  title: 'text-2xl mb-1 grow',
  shareIcon: 'm-auto grow-0',
  guestRow:
    'flex flex-row gap-2.5 border-b border-indigo-200 border-b-white/50 pb-3.5 mb-3',
  guestImage: 'rounded flex mx-auto',
  name: 'text-xl my-auto  grow',
  role: 'pt-3 text-sm md:text-lg rounded grow-0 h-7 items-center flex p-2 uppercase font-bold',
  addGuestButton:
    'text-xl text-primary underline underline-offset-4 decoration-1 flex gap-2.5 cursor-pointer',
  addIcon: 'm-auto grow-0',
  txtAddGuests: 'grow',
};

function getTagRole(tripGuest: any) {
  if (tripGuest.isPlanner) return 'Planner';
  if (tripGuest.isHost) return 'Host';
  if (tripGuest.isCoHost) return 'Co-host';
  return null;
}

type GuestsListProps = {
  users: Guest[];
  tripId: string;
  onOpenInviteModal: () => void;
};

export default function GuestsList({
  users,
  tripId,
  onOpenInviteModal,
}: GuestsListProps) {
  const flashMessageRef = useRef<FlashMessageRef>(null);
  const [currentUser, setCurrentUser] = useState<Guest | null>(null);

  const handleOpenInviteGuest = () => {
    onOpenInviteModal();
    setCurrentUser(null);
  };

  const onShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/trip/${tripId}`);
    toast.success('Share link saved to clipboard');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>
          {labels.title} ({users.length ?? 0})
        </span>

        <button type="button" onClick={onShare}>
          <Image
          loading="lazy"
            className={styles.shareIcon}
            width={32}
            height={32}
            src="/assets/images/dashboard/share.svg"
            alt={labels.shareIcon}
          />
        </button>
      </div>

      {users?.map((user) => {
        const role = getTagRole(user.TripGuest);

        return (
          <div className={styles.guestRow} key={user.id}>
            <Image
            loading="lazy"
              className={styles.guestImage}
              width={32}
              height={32}
              src="/assets/images/planneritem/profile_placeholder.png"
              alt=""
            />
            <div className={styles.name}>
              {user.firstName || user.TripGuest?.firstNameOnInvite}{' '}
              {user.lastName || user.TripGuest?.lastNameOnInvite}
            </div>

            {role && (
              <div
                className={`${styles.role} bg-${
                  user.TripGuest?.isPlanner ? 'primary' : 'white'
                }  text-${user.TripGuest?.isPlanner ? 'white' : 'black'}`}
              >
                {role}
              </div>
            )}
            {!role && (
              <DotsMenu
                user={user}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                tripId={tripId}
                flashMessageRef={flashMessageRef}
              />
            )}
            <FlashMessage ref={flashMessageRef} />
          </div>
        );
      })}

      <div role="button" className={styles.addGuestButton}>
        <Image
        loading="lazy"
          className={styles.addIcon}
          width={20}
          height={20}
          src="/assets/images/dashboard/guests-add.svg"
          alt={labels.addIcon}
        />{' '}
        <div
          className={styles.txtAddGuests}
          onKeyDown={() => {}}
          role="button"
          tabIndex={0}
          onClick={handleOpenInviteGuest}
        >
          {labels.txtAddGuests}
        </div>
      </div>
    </div>
  );
}
