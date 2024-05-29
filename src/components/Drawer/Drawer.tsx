import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';

type DrawerProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: Function;
  showOverlay?: boolean;
  isDark?: boolean;
  maxWidth?: string;
  showCloseButton?: boolean;
};

export default function Drawer({
  children,
  isOpen,
  onClose,
  showOverlay = true,
  isDark = true,
  maxWidth = 'max-w-sm',
  showCloseButton = true,
}: DrawerProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => onClose()}>
        {showOverlay && (
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-60" />
          </Transition.Child>
        )}
        <div className="fixed left-0 top-0 w-full">
          <div
            className={`w-full transform transition-all ${maxWidth} float-right`}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-in-out"
              enterFrom="translate-x-full opacity-0"
              enterTo="translate-x-0 opacity-100"
              leave="transition ease-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel
                className={`w-full h-screen transform transition-all overflow-x-hidden overflow-y-auto flex flex-col bg-gray-113 ${
                  !isDark ? 'bg-gray-158 text-black' : 'text-white'
                }`}
              >
                {showCloseButton && (
                  <button
                    className="bg-black w-10 md:w-12 h-10 md:h-12 absolute rounded-full flex top-3 right-3 z-20"
                    type="button"
                    onClick={() => onClose()}
                  >
                    <FaTimes className="text-lg md:text-2xl m-auto" />
                  </button>
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
