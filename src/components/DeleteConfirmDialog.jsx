import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline';

function DeleteConfirmDialog({ isOpen, onClose, onConfirm, onMoveToTrash, itemName }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-500" />
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 dark:text-white">
                    Delete "{itemName}"?
                  </Dialog.Title>
                </div>

                <div className="mt-4 space-y-4">
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
                      hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    onClick={onMoveToTrash}
                  >
                    <TrashIcon className="h-5 w-5" />
                    <span>Move to Trash</span>
                  </button>

                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-500 
                      hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    onClick={onConfirm}
                  >
                    <TrashIcon className="h-5 w-5" />
                    <span>Delete Permanently</span>
                  </button>

                  <button
                    className="w-full px-4 py-2 text-sm text-gray-500 dark:text-gray-400 
                      hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default DeleteConfirmDialog;
