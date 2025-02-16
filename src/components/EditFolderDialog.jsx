import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

function EditFolderDialog({ isOpen, onClose, onEdit, initialName }) {
  const [folderName, setFolderName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = async () => {
    if (!folderName.trim() || folderName.trim() === initialName) {
      onClose();
      return;
    }
    
    setIsEditing(true);
    try {
      await onEdit(folderName.trim());
      onClose();
    } catch (error) {
      console.error('Error editing folder:', error);
    } finally {
      setIsEditing(false);
    }
  };

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
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl 
                bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 dark:text-white">
                    Rename Folder
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                      transition-colors duration-200"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                <div className="mt-4">
                  <input
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder="Enter new folder name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                      placeholder-gray-500 dark:placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                      hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                      hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                      rounded-lg transition-colors duration-200 disabled:opacity-50"
                    onClick={handleEdit}
                    disabled={!folderName.trim() || folderName.trim() === initialName || isEditing}
                  >
                    {isEditing ? 'Renaming...' : 'Rename'}
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

export default EditFolderDialog; 