import { create } from 'zustand';
import { 
  getFiles, 
  createFolder, 
  uploadFile, 
  deleteFile,
  toggleStarred,
  getStarredFiles,
  searchFiles,
  moveToTrash, 
  restoreFromTrash, 
  getTrashFiles, 
  emptyTrash,
  getFolderPath,
  editFolderName,
  renameItem
} from '../lib/fileService';
import { sortFiles } from '../utils/sortUtils';
import { filterFiles } from '../utils/filterUtils';

const useFileStore = create((set, get) => ({
  files: [],
  starredFiles: [],
  currentFolder: null,
  loading: false,
  error: null,
  uploadProgress: {},
  searchTerm: '',
  sortBy: 'name',
  sortOrder: 'asc',
  searchResults: null,
  trashFiles: [],
  currentPath: [],
  activeFilters: {
    type: 'all',
    date: 'all'
  },

  setCurrentFolder: (folderId) => set({ currentFolder: folderId }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),

  fetchFiles: async (userId, folderId = null) => {
    try {
      set({ loading: true, error: null, searchResults: null, searchTerm: '' });
      const files = await getFiles(userId, folderId);
      set({ files, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchStarredFiles: async (userId) => {
    set({ loading: true, error: null });
    try {
      const starredFiles = await getStarredFiles(userId);
      set({ starredFiles, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createNewFolder: async (name, userId) => {
    try {
      set({ loading: true, error: null });
      const currentFolder = get().currentFolder;
      console.log('Creating folder:', { name, userId, parentId: currentFolder }); // Add this for debugging
      const newFolder = await createFolder(name, userId, currentFolder);
      
      set((state) => ({
        files: [...state.files, newFolder],
        loading: false,
        error: null
      }));

      // Refresh the files list after creating a folder
      await get().fetchFiles(userId, currentFolder);
      return newFolder;
    } catch (error) {
      console.error('Error creating folder:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  uploadNewFile: async (file, userId, onProgress) => {
    try {
      const currentFolder = get().currentFolder;
      const newFile = await uploadFile(file, currentFolder, userId, onProgress);
      set((state) => ({
        files: [...state.files, newFile]
      }));
      return newFile;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  deleteItem: async (fileId, userId) => {
    try {
      set({ loading: true, error: null });
      const success = await deleteFile(fileId, userId);
      if (success) {
        // Remove from all lists
        get().removeFileFromAllLists(fileId);
        // Refresh the current folder to update the UI
        await get().fetchFiles(userId, get().currentFolder);
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  toggleFileStarred: async (fileId, userId) => {
    try {
      const result = await toggleStarred(fileId, userId);
      // Update starred status in all lists
      set((state) => ({
        files: state.files.map(file => 
          file.id === fileId ? { ...file, starred: result.starred } : file
        ),
        starredFiles: result.starred 
          ? [...state.starredFiles, result]
          : state.starredFiles.filter(file => file.id !== fileId),
        searchResults: state.searchResults?.map(file =>
          file.id === fileId ? { ...file, starred: result.starred } : file
        ) || null
      }));
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  },

  setUploadProgress: (fileId, progress) => {
    set(state => ({
      uploadProgress: {
        ...state.uploadProgress,
        [fileId]: progress
      }
    }));
  },

  clearUploadProgress: (fileId) => {
    set(state => {
      const newProgress = { ...state.uploadProgress };
      delete newProgress[fileId];
      return { uploadProgress: newProgress };
    });
  },

  setSearchTerm: (term) => set({ searchTerm: term }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),

  clearSearch: () => {
    set({ 
      searchTerm: '',
      searchResults: null
    });
  },

  searchFiles: async (userId, searchTerm) => {
    try {
      set({ loading: true });
      if (!searchTerm.trim()) {
        // If search is cleared, reset to normal file view
        const files = await getFiles(userId, get().currentFolder);
        set({ 
          searchResults: null, 
          searchTerm: '',
          files,
          loading: false 
        });
        return;
      }

      const results = await searchFiles(userId, searchTerm);
      set({ 
        searchResults: results, 
        searchTerm,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false,
        searchResults: [],
      });
    }
  },

  getSortedFiles: () => {
    const state = get();
    const filesToProcess = state.searchResults !== null ? state.searchResults : state.files;
    const filteredFiles = filterFiles(filesToProcess, state.activeFilters);
    return sortFiles(filteredFiles, state.sortBy, state.sortOrder);
  },

  fetchTrashFiles: async (userId) => {
    try {
      set({ loading: true, error: null });
      const files = await getTrashFiles(userId);
      set({ trashFiles: files, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  moveToTrash: async (fileId, userId) => {
    try {
      await moveToTrash(fileId, userId);
      // Remove file from all lists when moved to trash
      get().removeFileFromAllLists(fileId);
      // Refresh trash files
      await get().fetchTrashFiles(userId);
    } catch (error) {
      console.error('Error moving to trash:', error);
      throw error;
    }
  },

  restoreFromTrash: async (fileId, userId) => {
    try {
      await restoreFromTrash(fileId, userId);
      set((state) => ({
        trashFiles: state.trashFiles.filter(file => file.id !== fileId)
      }));
      await get().fetchFiles(userId);
    } catch (error) {
      console.error('Error restoring from trash:', error);
      throw error;
    }
  },

  emptyTrash: async (userId) => {
    try {
      set({ loading: true });
      await emptyTrash(userId);
      set({ trashFiles: [], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchFolderPath: async (folderId, userId) => {
    if (!folderId) {
      set({ currentPath: [] });
      return;
    }

    try {
      const path = await getFolderPath(folderId, userId);
      set({ currentPath: path });
    } catch (error) {
      console.error('Error fetching folder path:', error);
      set({ currentPath: [] });
    }
  },

  setFilters: (filters) => {
    set({ activeFilters: filters });
  },

  removeFileFromAllLists: (fileId) => {
    set((state) => ({
      files: state.files.filter(file => file.id !== fileId),
      starredFiles: state.starredFiles.filter(file => file.id !== fileId),
      searchResults: state.searchResults?.filter(file => file.id !== fileId) || null,
    }));
  },

  renameItem: async (itemId, newName, userId) => {
    try {
      set({ loading: true, error: null });
      const updatedItem = await renameItem(itemId, newName, userId);
      
      // Update the item name in all relevant lists
      set(state => ({
        files: state.files.map(file => 
          file.id === itemId ? { ...file, name: newName } : file
        ),
        starredFiles: state.starredFiles.map(file =>
          file.id === itemId ? { ...file, name: newName } : file
        ),
        searchResults: state.searchResults?.map(file =>
          file.id === itemId ? { ...file, name: newName } : file
        ) || null,
        loading: false
      }));

      return updatedItem;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  }
}));

export default useFileStore;
