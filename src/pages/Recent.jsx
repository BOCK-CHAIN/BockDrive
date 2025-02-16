import { ClockIcon } from '@heroicons/react/24/outline';

function Recent() {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Recent</h1>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <ClockIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">
            No Recent Files
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Files you open will appear here
          </p>
        </div>
      </div>
    </div>
  );
}

export default Recent;
