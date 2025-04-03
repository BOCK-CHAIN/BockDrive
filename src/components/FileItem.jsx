import { moveToTrash } from '../lib/fileService';
import useAuthStore from '../store/authStore';

function FileItem({ file, onFileAction }) {
  const { user } = useAuthStore();

  const handleDelete = async () => {
    try {
      await moveToTrash(file.id, user.uid);
      onFileAction('trash', file.id);
    } catch (error) {
      console.error('Error moving file to trash:', error);
    }
  };

  // Rest of your component code
  
  return (
    <div className="file-item">
      {/* Your file item UI */}
      
      {/* File actions menu */}
      <div className="file-actions">
        {/* Other actions like rename, download, etc. */}
        
        {/* Replace any permanent delete option with trash */}
        <button 
          onClick={handleDelete} 
          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Move to Trash
        </button>
      </div>
    </div>
  );
}

export default FileItem; 