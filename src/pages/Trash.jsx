import { useEffect, useState } from 'react';
import { TrashIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import useFileStore from '../store/fileStore';
import useAuthStore from '../store/authStore';
import EmptyTrashDialog from '../components/EmptyTrashDialog';

function Trash() {
  const { user } = useAuthStore();
  const { 
    trashFiles, 
    loading, 
    error, 
    fetchTrashFiles, 
    restoreFromTrash,
    emptyTrash
  } = useFileStore();
  const [isEmptyTrashDialogOpen, setIsEmptyTrashDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTrashFiles(user.uid);
    }
  }, [user, fetchTrashFiles]);

  const handleRestore = async (fileId) => {
    try {
      await restoreFromTrash(fileId, user.uid);
    } catch (error) {
      console.error('Error restoring file:', error);
    }
  };

  const handleEmptyTrash = async () => {
    try {
      await emptyTrash(user.uid);
      setIsEmptyTrashDialogOpen(false);
    } catch (error) {
      console.error('Error emptying trash:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full dark:bg-gray-900">
        <div className="text-red-500 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Trash</h1>
          {trashFiles.length > 0 && (
            <button 
              onClick={() => setIsEmptyTrashDialogOpen(true)}
              className="px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
            >
              Empty Trash
            </button>
          )}
        </div>
      </div>
      
      {trashFiles.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <TrashIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">Trash is Empty</h2>
            <p className="text-gray-500 dark:text-gray-400">Files you delete will appear here</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-2">
            {trashFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700 
                  bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-3">
                  <TrashIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Deleted {file.deletedAt?.toDate().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRestore(file.id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 
                    hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <ArrowUpIcon className="w-4 h-4" />
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <EmptyTrashDialog
        isOpen={isEmptyTrashDialogOpen}
        onClose={() => setIsEmptyTrashDialogOpen(false)}
        onConfirm={handleEmptyTrash}
      />
    </div>
  );
}

export default Trash;
