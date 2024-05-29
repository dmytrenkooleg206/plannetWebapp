import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog, Transition, Listbox, Switch } from '@headlessui/react';
import { FaChevronDown } from 'react-icons/fa';

import Button from '@/components/Button/Button';
import { deleteTrip } from '@/api/trip/trip.service';
import PNModal from '../PNModal';

type TripEditModalProps = {
  onClose: Function;
  onUpdate: Function;
  isOpen: boolean;
  trip: any;
};

export default function TripEditModal({
  onClose,
  onUpdate,
  isOpen,
  trip,
}: TripEditModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const permissions = [
    { key: 0, text: 'Private: Invite Only' },
    { key: 1, text: 'Public: Anyone with link can access' },
  ];

  const [selected, setSelected] = useState<any>(permissions[0]);
  const [options, setOptions] = useState<any>([
    {
      key: 'add_itinerary',
      text: 'Add events to itinerary',
      image: 'itinerary',
      enabled: false,
    },
    {
      key: 'add_expenses',
      text: 'Can add expenses',
      image: 'expenses',
      enabled: false,
    },
    {
      key: 'add_message',
      text: 'Can message Planner',
      image: 'message',
      enabled: false,
    },
  ]);

  useEffect(() => {
    setTitle(trip.name);
    if (trip.isPrivate) setSelected(permissions[0]);
    else setSelected(permissions[1]);
    const tempOptions = [...options];
    tempOptions[0].enabled = trip.canAddEvents;
    tempOptions[1].enabled = trip.canAddExpenses;
    tempOptions[2].enabled = trip.canSendMessages;
    setOptions([...tempOptions]);
  }, [trip]);

  const handleUpdate = () => {
    if (!title) return;
    const permissionsData = {
      canAddEvents: options[0].enabled,
      canAddExpenses: options[1].enabled,
      canSendMessages: options[2].enabled,
      isPrivate: selected.key === 0,
    };
    onClose();
    onUpdate(title, permissionsData);
  };

  const handleDelete = async () => {
    try {
      router.push('/onboarding');
      await deleteTrip({ tripId: trip.id });
      toast.success('Trip deleted successfully!');
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <PNModal isOpen={isOpen} onClose={onClose}>
      <Dialog.Title
        as="h3"
        className="text-xl md:text-3xl font-medium leading-6"
      >
        Title
      </Dialog.Title>
      <div className="my-3 md:my-5">
        <input
          className="w-full text-lg md:text-2xl bg-black rounded-md border border-black focus:border-primary focus:outline-none py-4 px-5"
          value={title}
          autoComplete="off"
          placeholder="Input trip name"
          onChange={(e: any) => {
            setTitle(e.target.value);
          }}
        />
      </div>
      <div className="p-5 rounded-md bg-gray-212">
        <div className="text-xl md:text-3xl font-medium">Permissions</div>
        <Listbox value={selected} onChange={setSelected}>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-gray-10 py-3 pl-5 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate text-base md:text-xl">
                {selected.text}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <FaChevronDown
                  className="h-5 w-5 text-[#8E91A5]"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-10 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                {permissions.map((permission) => (
                  <Listbox.Option
                    key={permission.text}
                    className="relative cursor-pointer select-none py-3 px-5 text-base md:text-lg text-white-700"
                    value={permission}
                  >
                    {permission.text}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
        <div className="mt-5 text-bold text-base md:text-xl">Guests can:</div>
        <div className="divide-y divide-white-200">
          {options.map((option: any, index: number) => {
            return (
              <div className="py-4 flex" key={option.key}>
                <img
                  className="max-w-[24px] w-full"
                  src={`/assets/images/dashboard/${option.image}.svg`}
                  alt="itinerary"
                />
                <div className="text-base md:text-xl my-auto ml-3 mr-auto">
                  {option.text}
                </div>
                <Switch
                  checked={option.enabled}
                  onChange={() => {
                    const tOptions = options;
                    tOptions[index].enabled = !tOptions[index].enabled;
                    setOptions([...tOptions]);
                  }}
                  className={`${option.enabled ? 'bg-primary' : 'bg-white-400'}
                      relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 p-[2px]`}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={`${
                      option.enabled ? 'translate-x-9' : 'translate-x-0'
                    }
                        pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-gray-113 shadow-lg ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              </div>
            );
          })}
        </div>
      </div>
      <div className="py-7">
        <Button
          text="Update"
          onClick={() => handleUpdate()}
          isDisabled={!title}
        />
      </div>
      <button
        className="flex text-red mx-auto cursor-pointer select-none"
        type="button"
        onClick={handleDelete}
      >
        Delete trip
      </button>
    </PNModal>
  );
}
