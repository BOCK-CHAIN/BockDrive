import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DocumentIcon, FolderIcon } from '@heroicons/react/24/outline';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

function FilePreview({ isOpen, onClose, file }) {
  const getFileType = (mimeType) => {
    if (!mimeType) return 'unknown';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf')) return 'pdf';
    return 'other';
  };

  const renderFileContent = () => {
    if (!file || !file.downloadURL) {
      return (
        <div className="text-center p-8">
          <p className="text-gray-500">No preview available</p>
        </div>
      );
    }

    const fileType = getFileType(file?.mimeType);

    switch (fileType) {
      case 'image':
        return (
          <img
            src={file.downloadURL}
            alt={file.name}
            className="max-w-full max-h-[80vh] object-contain"
          />
        );
      case 'video':
        return (
          <video
            controls
            className="max-w-full max-h-[80vh]"
          >
            <source src={file.downloadURL} type={file.mimeType} />
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <audio
            controls
            className="w-full"
          >
            <source src={file.downloadURL} type={file.mimeType} />
            Your browser does not support the audio tag.
          </audio>
        );
      case 'pdf':
        return (
          <iframe
            src={file.downloadURL}
            title={file.name}
            className="w-full h-[80vh]"
          />
        );
      default:
        return (
          <div className="text-center p-8">
            <p className="text-gray-500 mb-4">Preview not available</p>
            <a
              href={file.downloadURL}
              download={file.name}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Download file
            </a>
          </div>
        );
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl 
                bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 dark:text-white">
                    {file?.name}
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
                  {file?.type === 'file' ? (
                    <div className="space-y-4">
                      <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg 
                        flex items-center justify-center">
                        <DocumentIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Size: {formatFileSize(file.size)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Modified: {file.updatedAt?.toDate().toLocaleDateString()}
                          </p>
                        </div>
                        <a
                          href={file.downloadURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium 
                            text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                          Download
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FolderIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">This is a folder</p>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default FilePreview;
