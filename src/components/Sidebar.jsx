import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  FolderIcon,
  StarIcon,
  TrashIcon,
  CloudIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import NewFileDialog from './NewFileDialog';
import useFileStore from '../store/fileStore';

function Sidebar() {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false);
  const { createNewFolder } = useFileStore();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
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

  const menuItems = [
    { icon: HomeIcon, text: 'Home', path: '/' },
    { icon: FolderIcon, text: 'My Drive', path: '/drive' },
    { icon: StarIcon, text: 'Starred', path: '/starred' },
    { icon: TrashIcon, text: 'Trash', path: '/trash' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-full flex flex-col border-r dark:border-gray-700">
      <div className="p-6">
        <div 
          className="flex items-center gap-3 mb-8 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
        >
          <img src="/bock_logo.png" alt="Bock Drive Logo" className="w-8 h-8" />
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Bock Drive</h1>
        </div>

        <button
          onClick={() => setIsNewFileDialogOpen(true)}
          className="flex items-center gap-3 w-full px-6 py-3 rounded-full 
            bg-white dark:bg-gray-700 border dark:border-gray-600 
            hover:bg-gray-50 dark:hover:bg-gray-600 
            transition-colors duration-200
            text-gray-700 dark:text-white font-medium shadow-sm"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New</span>
        </button>
      </div>

      <div className="h-px bg-gray-200 dark:bg-gray-700 mx-4 mb-2"></div>

      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.text}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors duration-200 
                ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 font-medium'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.text}</span>
            </Link>
          ))}
        </div>
      </nav>

      <NewFileDialog
        isOpen={isNewFileDialogOpen}
        onClose={() => setIsNewFileDialogOpen(false)}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
}

export default Sidebar;
