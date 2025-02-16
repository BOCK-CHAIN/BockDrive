import { MagnifyingGlassIcon, FolderIcon } from '@heroicons/react/24/outline';

function EmptyState({ searchTerm, onClearSearch, handleRefresh }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        {searchTerm ? (
          <>
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">
              No results found
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              No items match your search for "{searchTerm}"
            </p>
            <button
              onClick={onClearSearch}
              className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Clear search
            </button>
          </>
        ) : (
          <>
            <FolderIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">
              No files yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Upload files or create folders to get started
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default EmptyState;
