import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon, FolderIcon, DocumentIcon, TrashIcon } from '@heroicons/react/24/outline';
import useFileStore from '../store/fileStore';
import useAuthStore from '../store/authStore';
import FilePreview from '../components/FilePreview';
import { useState } from 'react';

function Starred() {
  const { user } = useAuthStore();
  const { starredFiles, fetchStarredFiles, loading, error, moveToTrash } = useFileStore();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchStarredFiles(user.uid);
    }
  }, [user, fetchStarredFiles]);

  const handleFileClick = (file) => {
    if (file.type === 'folder') {
      navigate(`/folder/${file.id}`);
    } else {
      setSelectedFile(file);
    }
  };

  const handleMoveToTrash = async (fileId, e) => {
    e.stopPropagation();
    if (!user) return;
    try {
      await moveToTrash(fileId, user.uid);
    } catch (error) {
      console.error('Error moving to trash:', error);
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

  if (!starredFiles.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <StarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">No starred files</h2>
          <p className="text-gray-500">Files you star will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Starred</h1>
          {starredFiles.length > 0 && (
            <button 
              onClick={() => setIsEmptyTrashDialogOpen(true)}
              className="px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
            >
              Empty Trash
            </button>
          )}
        </div>
      </div>
      
      {starredFiles.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <StarIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">No starred files</h2>
            <p className="text-gray-500 dark:text-gray-400">Files you star will appear here</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {starredFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => handleFileClick(file)}
                className="group relative flex flex-col items-center p-4 rounded-lg 
                  border border-gray-200 dark:border-gray-700 
                  bg-white dark:bg-gray-800 
                  hover:bg-gray-50 dark:hover:bg-gray-700 
                  transition-colors duration-200 cursor-pointer"
              >
                {file.type === 'folder' ? (
                  <FolderIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-2" />
                ) : (
                  <DocumentIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-2" />
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center truncate w-full">
                  {file.name}
                </span>
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100">
                  <button
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    onClick={(e) => handleMoveToTrash(file.id, e)}
                  >
                    <TrashIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {file.updatedAt?.toDate()?.toLocaleDateString() || 'Unknown date'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <FilePreview
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        file={selectedFile}
      />
    </div>
  );
}

export default Starred;
