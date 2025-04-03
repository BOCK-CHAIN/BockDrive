import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

function HelpDialog({ isOpen, onClose }) {
  const helpSections = [
    {
      title: 'File Management',
      items: [
        'Upload files by clicking the upload button or drag and drop',
        'Create new folders to organize your files',
        'Star important files for quick access',
        'Move files to trash before permanent deletion'
      ]
    },
    {
      title: 'Navigation',
      items: [
        'Use the sidebar to switch between views',
        'Click folders to navigate inside them',
        'Use breadcrumbs to navigate back',
        'Switch between list and grid views'
      ]
    },
    {
      title: 'Search & Filter',
      items: [
        'Search files by name',
        'Filter files by type and date',
        'Sort files by name, date, or size',
        'Use the filter dialog for advanced filtering'
      ]
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
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl 
                bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 dark:text-white">
                    Help & Documentation
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
                  {helpSections.map((section) => (
                    <div key={section.title}>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {section.title}
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {section.items.map((item) => (
                          <li key={item} className="text-sm text-gray-600 dark:text-gray-300">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Need more help? Contact support at support@example.com
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default HelpDialog;
