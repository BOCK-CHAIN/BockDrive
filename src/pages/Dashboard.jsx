import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  UserPlusIcon,
  StarIcon,
  EllipsisVerticalIcon,
  FolderIcon,
  DocumentIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  ChevronUpIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import useFileStore from '../store/fileStore';
import useAuthStore from '../store/authStore';
import NewFileDialog from '../components/NewFileDialog';
import FilePreview from '../components/FilePreview';
import BreadcrumbNav from '../components/BreadcrumbNav';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import HelpDialog from '../components/HelpDialog';
import RenameDialog from '../components/RenameDialog';

function Dashboard() {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    files, 
    currentFolder, 
    loading, 
    error,
    setCurrentFolder, 
    fetchFiles,
    createNewFolder,
    uploadNewFile,
    deleteItem,
    uploadProgress,
    toggleFileStarred,
    setUploadProgress,
    clearUploadProgress,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    searchFiles,
    getSortedFiles,
    clearSearch,
    moveToTrash,
    currentPath,
    fetchFolderPath,
    activeFilters,
    setFilters,
    renameItem,
  } = useFileStore();
  
  const [viewMode, setViewMode] = useState('list');
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [itemToRename, setItemToRename] = useState(null);

  useEffect(() => {
    setCurrentFolder(folderId || null);
    if (user) {
      fetchFiles(user.uid, folderId || null);
      fetchFolderPath(folderId, user.uid);
    }
  }, [folderId, user, setCurrentFolder, fetchFiles, fetchFolderPath]);

const handleFileUpload = async (event) => {
  const files = event.target.files;
  if (!files.length || !user) return;

  for (const file of files) {
    const fileId = `${file.name}-${Date.now()}`;
    setUploadingFiles(prev => ({
      ...prev,
      [fileId]: { progress: 0, name: file.name }
    }));

    try {
      const onProgress = (progress) => {
        setUploadingFiles(prev => ({
          ...prev,
          [fileId]: { ...prev[fileId], progress }
        }));
      };

      await uploadNewFile(file, user.uid, onProgress);
      
      // Refresh the file list after successful upload
      await fetchFiles(user.uid, currentFolder);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file: ' + error.message);
    } finally {
      setUploadingFiles(prev => {
        const newState = { ...prev };
        delete newState[fileId];
        return newState;
      });
    }
  }
};

const handleCreateFolder = async (name) => {
  if (!user) return;
  try {
    const newFolder = await createNewFolder(name, user.uid);
    return newFolder;
  } catch (error) {
    console.error('Error creating folder:', error);
  }
};

  const handleDeleteClick = (file, e) => {
    e.stopPropagation();
    setFileToDelete(file);
  };

  const handlePermanentDelete = async () => {
    if (!user || !fileToDelete) return;
    try {
      await deleteItem(fileToDelete.id, user.uid);
      setFileToDelete(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleMoveToTrash = async () => {
    if (!user || !fileToDelete) return;
    try {
      await moveToTrash(fileToDelete.id, user.uid);
      setFileToDelete(null);
    } catch (error) {
      console.error('Error moving to trash:', error);
    }
  };

  const handleFolderClick = (folderId) => {
    navigate(`/folder/${folderId}`);
  };

  const handleToggleStar = async (fileId, e) => {
    e.stopPropagation();
    if (!user) return;
    await toggleFileStarred(fileId, user.uid);
  };

  const handleSearch = (value) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    
    setSearchTimeout(setTimeout(() => {
      if (!value.trim()) {
        // Clear search and fetch normal files
        clearSearch();
        fetchFiles(user.uid, currentFolder);
      } else {
        searchFiles(user.uid, value);
      }
    }, 300));
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleApplyFilters = (filters) => {
    setFilters(filters);
  };

  const handleFileClick = (file) => {
    if (file.type === 'folder') {
      handleFolderClick(file.id);
    } else {
      setSelectedFile(file);
    }
  };

  const handleRenameClick = (file, e) => {
    e.stopPropagation();
    setItemToRename(file);
  };

  const handleRename = async (newName) => {
    if (!user || !itemToRename) return;
    try {
      await renameItem(itemToRename.id, newName, user.uid);
      // Refresh the files list after renaming
      await fetchFiles(user.uid, currentFolder);
    } catch (error) {
      console.error('Error renaming item:', error);
    }
  };

  const sortedFiles = getSortedFiles();

  // Update the loading state UI
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
        <div className="text-red-500 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

const renderUploadProgress = () => {
  const uploadingFilesList = Object.entries(uploadingFiles);
  if (uploadingFilesList.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Uploading Files</h3>
      <div className="space-y-3">
        {uploadingFilesList.map(([fileId, { name, progress }]) => (
          <div key={fileId}>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{name}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      {searchTerm ? (
        <>
          <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">No results found</h2>
          <p className="text-gray-500 dark:text-gray-400">
            No items match your search for "{searchTerm}"
          </p>
          <button
            onClick={() => {
              clearSearch();
              fetchFiles(user.uid, currentFolder);
            }}
            className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Clear search
          </button>
        </>
      ) : (
        <>
          <FolderIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">No files yet</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Upload files or create folders to get started
          </p>
        </>
      )}
    </div>
  </div>
);

const renderListView = () => {
  if (!sortedFiles.length) {
    return <EmptyState />;
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
          <th 
            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={() => handleSort('name')}
          >
            <div className="flex items-center gap-1">
              Name
              {sortBy === 'name' && (
                sortOrder === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
              )}
            </div>
          </th>
          <th className="px-4 py-2">Owner</th>
          <th 
            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={() => handleSort('modified')}
          >
            <div className="flex items-center gap-1">
              Last modified
              {sortBy === 'modified' && (
                sortOrder === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
              )}
            </div>
          </th>
          <th 
            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={() => handleSort('size')}
          >
            <div className="flex items-center gap-1">
              File size
              {sortBy === 'size' && (
                sortOrder === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
              )}
            </div>
          </th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
        {sortedFiles.map((file) => (
          <tr
            key={file.id}
            className="border-b border-gray-100 dark:border-gray-700 
              hover:bg-gray-50 dark:hover:bg-gray-800 
              transition-colors duration-200 cursor-pointer"
            onClick={() => handleFileClick(file)}
          >
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                {file.type === 'folder' ? (
                  <FolderIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                ) : (
                  <DocumentIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                )}
                <span className="text-gray-900 dark:text-gray-100">{file.name}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">me</td>
            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
              {file.updatedAt && file.updatedAt.toDate ? file.updatedAt.toDate().toLocaleDateString() : 'Invalid Date'}
            </td>
            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
              {file.type === 'folder' ? '--' : formatFileSize(file.size)}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={(e) => handleToggleStar(file.id, e)}
                >
                  <StarIcon 
                    className={`w-4 h-4 ${file.starred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600 dark:text-gray-400'}`} 
                  />
                </button>
                <button
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={(e) => handleRenameClick(file, e)}
                >
                  <PencilIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={(e) => handleDeleteClick(file, e)}
                >
                  <TrashIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                {file.type === 'file' && (
                  <a
                    href={file.downloadURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </a>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const renderGridView = () => {
  if (!sortedFiles.length) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {sortedFiles.map((file) => (
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
              onClick={(e) => handleToggleStar(file.id, e)}
            >
              <StarIcon 
                className={`w-4 h-4 ${file.starred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600 dark:text-gray-400'}`} 
              />
            </button>
            <button
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              onClick={(e) => handleRenameClick(file, e)}
            >
              <PencilIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              onClick={(e) => handleDeleteClick(file, e)}
            >
              <TrashIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            {file.type === 'file' && (
              <a
                href={file.downloadURL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <ArrowDownTrayIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </a>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {file.updatedAt && file.updatedAt.toDate ? file.updatedAt.toDate().toLocaleDateString() : 'Invalid Date'}
          </div>
        </div>
      ))}
    </div>
  );
};

return (
  <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
    {renderUploadProgress()}
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search in Drive"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
              border border-transparent dark:border-gray-600"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button 
          className="p-2 rounded-full transition-colors duration-200
            hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setIsHelpOpen(true)}
        >
          <QuestionMarkCircleIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>

    {/* Toolbar with Breadcrumb */}
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="flex items-center gap-2">
        <BreadcrumbNav path={currentPath} />
      </div>
      <div className="flex items-center gap-3">
        <input
          type="file"
          id="file-upload"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer p-2.5 rounded-lg transition-colors duration-200
            hover:bg-gray-100 dark:hover:bg-gray-700 
            text-gray-700 dark:text-gray-200"
        >
          <ArrowUpTrayIcon className="w-5 h-5" />
        </label>
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
        <button
          onClick={() => setViewMode('list')}
          className={`p-2.5 rounded-lg transition-colors duration-200 
            ${viewMode === 'list' 
              ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' 
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
        >
          <ViewColumnsIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2.5 rounded-lg transition-colors duration-200
            ${viewMode === 'grid' 
              ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' 
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
        >
          <Squares2X2Icon className="w-5 h-5" />
        </button>
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
        <button 
          className="p-2.5 rounded-lg text-gray-700 dark:text-gray-200 
            hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          onClick={() => setIsFilterDialogOpen(true)}
        >
          <FunnelIcon className="w-5 h-5" />
        </button>
      </div>
    </div>

    {/* File List/Grid */}
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
      {viewMode === 'list' ? renderListView() : renderGridView()}
    </div>

    <NewFileDialog
      isOpen={isNewFileDialogOpen}
      onClose={() => setIsNewFileDialogOpen(false)}
      onCreateFolder={handleCreateFolder}
    />
    <FilePreview
      isOpen={!!selectedFile}
      onClose={() => setSelectedFile(null)}
      file={selectedFile}
    />
    <DeleteConfirmDialog
      isOpen={!!fileToDelete}
      onClose={() => setFileToDelete(null)}
      onConfirm={handlePermanentDelete}
      onMoveToTrash={handleMoveToTrash}
      itemName={fileToDelete?.name}
    />
    <HelpDialog
      isOpen={isHelpOpen}
      onClose={() => setIsHelpOpen(false)}
    />
    <RenameDialog
      isOpen={!!itemToRename}
      onClose={() => setItemToRename(null)}
      onRename={handleRename}
      initialName={itemToRename?.name || ''}
      itemType={itemToRename?.type || 'item'}
    />
  </div>
);
}

function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default Dashboard;
