import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

function FilterDialog({ isOpen, onClose, onApplyFilters, initialFilters }) {
  const [filters, setFilters] = useState(initialFilters || {
    type: 'all',
    date: 'all'
  });

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
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
                    Filter Files
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                      transition-colors duration-200"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      File Type
                    </label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {['all', 'file', 'folder'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFilters({ ...filters, type })}
                          className={`px-4 py-2 text-sm rounded-lg capitalize ${
                            filters.type === type
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Date Modified
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {['all', 'lastDay', 'lastWeek', 'lastMonth'].map((date) => (
                        <button
                          key={date}
                          onClick={() => setFilters({ ...filters, date })}
                          className={`px-4 py-2 text-sm rounded-lg capitalize ${
                            filters.date === date
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {date === 'all' ? 'Any time' : date.replace('last', 'Last ')}
                        </button>
                      ))}
                    </div>
                  </div>
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
                      rounded-lg transition-colors duration-200"
                    onClick={handleApply}
                  >
                    Apply Filters
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

export default FilterDialog;
