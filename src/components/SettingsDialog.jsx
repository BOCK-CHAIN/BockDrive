import { Fragment } from 'react';
import { Dialog, Transition, Switch } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import useFileStore from '../store/fileStore';

function SettingsDialog({ isOpen, onClose }) {
  const { sortBy, sortOrder, setSortBy, setSortOrder } = useFileStore();

  const settings = [
    {
      title: 'Default View',
      options: [
        { value: 'list', label: 'List View' },
        { value: 'grid', label: 'Grid View' },
      ],
      current: localStorage.getItem('defaultView') || 'list',
      onChange: (value) => localStorage.setItem('defaultView', value)
    },
    {
      title: 'Sort Files By',
      options: [
        { value: 'name', label: 'Name' },
        { value: 'modified', label: 'Last Modified' },
        { value: 'size', label: 'Size' },
      ],
      current: sortBy,
      onChange: (value) => setSortBy(value)
    },
    {
      title: 'Sort Order',
      options: [
        { value: 'asc', label: 'Ascending' },
        { value: 'desc', label: 'Descending' },
      ],
      current: sortOrder,
      onChange: (value) => setSortOrder(value)
    }
  ];

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
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                  Settings
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                {settings.map((setting) => (
                  <div key={setting.title} className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {setting.title}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {setting.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setting.onChange(option.value)}
                          className={`px-4 py-2 text-sm rounded-lg ${
                            setting.current === option.value
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default SettingsDialog;
