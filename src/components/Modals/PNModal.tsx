import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';

type PNModalProps = {
  children: React.ReactNode;
  onClose: Function;
  isOpen: boolean;
  maxWidth?: string;
  isDark?: boolean;
  showCloseButton?: boolean;
  noPadding?: boolean;
  fitContent?: boolean;
};
export default function PNModal({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-[660px]',
  isDark = true,
  showCloseButton = false,
  noPadding = false,
  fitContent = false,
}: PNModalProps) {
  // const cn = `w-full max-w-[${maxWidth}] transform overflow-hidden rounded-2xl bg-gray-113 px-5 py-7 md:px-8 md:py-10 text-left align-middle shadow-xl transition-all text-white`;
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => onClose()}>
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

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-0 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full transform overflow-hidden rounded-2xl bg-gray-113 px-5 py-7 md:px-8 md:py-10 text-left align-middle shadow-xl transition-all ${maxWidth} ${
                  !isDark ? 'bg-gray-158 text-black' : 'text-white'
                }
                ${noPadding && 'no-padding'}
                ${fitContent && 'fit-content'}
                `}
              >
                {showCloseButton && (
                  <button
                    className="bg-black w-10 md:w-12 h-10 md:h-12 absolute rounded-full flex top-4 right-4 z-20"
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
