import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, // Changed from uploadBytes
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';

export const createFolder = async (name, userId, parentId = null) => {
  try {
    if (!name || !userId) {
      throw new Error('Missing required parameters');
    }

    const folderData = {
      name,
      type: 'folder',
      parentId: parentId || null,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      inTrash: false,
      starred: false
    };

    const docRef = await addDoc(collection(db, 'files'), folderData);
    
    // Return the new folder data with the ID
    return {
      id: docRef.id,
      ...folderData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error creating folder:', error);
    throw new Error('Failed to create folder: ' + error.message);
  }
};

export const uploadFile = async (file, parentId, userId, onProgress) => {
  try {
    if (!file || !userId) {
      throw new Error('Missing required parameters');
    }

    // Create user-specific path with timestamp to avoid naming conflicts
    const timestamp = Date.now();
    const storageRef = ref(storage, `files/${userId}/${timestamp}_${file.name}`);
    
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          reject(new Error('Upload failed: ' + error.message));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            const fileData = {
              name: file.name,
              type: 'file',
              mimeType: file.type,
              size: file.size,
              parentId: parentId || null,
              userId,
              downloadURL,
              storageRef: uploadTask.snapshot.ref.fullPath,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              inTrash: false,
              starred: false
            };

            const docRef = await addDoc(collection(db, 'files'), fileData);
            resolve({
              id: docRef.id,
              ...fileData,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          } catch (error) {
            reject(new Error('Failed to save file metadata: ' + error.message));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Upload failed: ' + error.message);
  }
};

export const getFiles = async (userId, parentId = null) => {
  try {
    const q = query(
      collection(db, 'files'),
      where('userId', '==', userId),
      where('parentId', '==', parentId),
      where('inTrash', '==', false), // Add this condition
      orderBy('type'), // Folders first
      orderBy('name')
    );

    const querySnapshot = await getDocs(q);
    const files = [];
    querySnapshot.forEach((doc) => {
      files.push({ id: doc.id, ...doc.data() });
    });
    return files;
  } catch (error) {
    console.error('Error getting files:', error);
    throw error;
  }
};

export const deleteFile = async (fileId, userId) => {
  try {
    const docRef = doc(db, 'files', fileId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('File not found');
    }

    const fileData = docSnap.data();

    // Check if user owns the file
    if (fileData.userId !== userId) {
      throw new Error('Unauthorized');
    }

    // If it's a file (not a folder), delete from storage first
    if (fileData.type === 'file' && fileData.storageRef) {
      try {
        const storageRef = ref(storage, fileData.storageRef);
        await deleteObject(storageRef);
      } catch (storageError) {
        console.error('Error deleting file from storage:', storageError);
        // Continue with Firestore deletion even if storage deletion fails
      }
    } else if (fileData.type === 'folder') {
      // If it's a folder, recursively delete all contents
      await deleteFolder(fileId, userId);
    }

    // Delete metadata from Firestore
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Add new helper function for recursive folder deletion
const deleteFolder = async (folderId, userId) => {
  try {
    // Get all files in the folder
    const q = query(
      collection(db, 'files'),
      where('parentId', '==', folderId),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const deletePromises = [];

    // Delete each item in the folder
    querySnapshot.forEach((doc) => {
      const fileData = doc.data();
      if (fileData.type === 'folder') {
        // Recursively delete subfolders
        deletePromises.push(deleteFolder(doc.id, userId));
      } else if (fileData.type === 'file' && fileData.storageRef) {
        // Delete file from storage
        const storageRef = ref(storage, fileData.storageRef);
        deletePromises.push(deleteObject(storageRef));
      }
      // Delete the document from Firestore
      deletePromises.push(deleteDoc(doc.ref));
    });

    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting folder contents:', error);
    throw error;
  }
};

export const toggleStarred = async (fileId, userId) => {
  try {
    const docRef = doc(db, 'files', fileId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists() || docSnap.data().userId !== userId) {
      throw new Error('Unauthorized or file not found');
    }

    await updateDoc(docRef, {
      starred: !docSnap.data().starred,
      updatedAt: serverTimestamp()
    });

    return { id: docRef.id, ...docSnap.data(), starred: !docSnap.data().starred };
  } catch (error) {
    console.error('Error toggling star:', error);
    throw error;
  }
};

export const getStarredFiles = async (userId) => {
  try {
    const q = query(
      collection(db, 'files'),
      where('userId', '==', userId),
      where('starred', '==', true),
      orderBy('updatedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const files = [];
    querySnapshot.forEach((doc) => {
      files.push({ id: doc.id, ...doc.data() });
    });
    return files;
  } catch (error) {
    console.error('Error getting starred files:', error);
    throw error;
  }
};

export const searchFiles = async (userId, searchTerm) => {
  try {
    // Get all user files first
    const q = query(
      collection(db, 'files'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const files = [];
    querySnapshot.forEach((doc) => {
      files.push({ id: doc.id, ...doc.data() });
    });

    // Perform client-side search
    const searchTermLower = searchTerm.toLowerCase();
    return files.filter(file => 
      file.name.toLowerCase().includes(searchTermLower) ||
      file.type.toLowerCase().includes(searchTermLower)
    );
  } catch (error) {
    console.error('Error searching files:', error);
    throw error;
  }
};

export const moveToTrash = async (fileId, userId) => {
  try {
    const docRef = doc(db, 'files', fileId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists() || docSnap.data().userId !== userId) {
      throw new Error('Unauthorized or file not found');
    }

    await updateDoc(docRef, {
      inTrash: true,
      deletedAt: serverTimestamp()
    });

    return { id: docRef.id, ...docSnap.data(), inTrash: true };
  } catch (error) {
    console.error('Error moving to trash:', error);
    throw error;
  }
};

export const restoreFromTrash = async (fileId, userId) => {
  try {
    const docRef = doc(db, 'files', fileId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists() || docSnap.data().userId !== userId) {
      throw new Error('Unauthorized or file not found');
    }

    await updateDoc(docRef, {
      inTrash: false,
      deletedAt: null
    });

    return { id: docRef.id, ...docSnap.data(), inTrash: false };
  } catch (error) {
    console.error('Error restoring from trash:', error);
    throw error;
  }
};

export const getTrashFiles = async (userId) => {
  try {
    const q = query(
      collection(db, 'files'),
      where('userId', '==', userId),
      where('inTrash', '==', true),
      orderBy('deletedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const files = [];
    querySnapshot.forEach((doc) => {
      files.push({ id: doc.id, ...doc.data() });
    });
    return files;
  } catch (error) {
    console.error('Error getting trash files:', error);
    throw error;
  }
};

export const emptyTrash = async (userId) => {
  try {
    const q = query(
      collection(db, 'files'),
      where('userId', '==', userId),
      where('inTrash', '==', true)
    );

    const querySnapshot = await getDocs(q);
    const deletePromises = [];

    querySnapshot.forEach((document) => {
      const fileData = document.data();
      if (fileData.type === 'file' && fileData.storageRef) {
        // Delete from storage
        const storageRef = ref(storage, fileData.storageRef);
        deletePromises.push(deleteObject(storageRef));
      } else if (fileData.type === 'folder') {
        // Delete folder contents
        deletePromises.push(deleteFolder(document.id, userId));
      }
      // Delete from Firestore
      deletePromises.push(deleteDoc(document.ref));
    });

    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error emptying trash:', error);
    throw error;
  }
};

export const getFolderPath = async (folderId, userId) => {
  try {
    const path = [];
    let currentId = folderId;

    while (currentId) {
      const docRef = doc(db, 'files', currentId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists() || docSnap.data().userId !== userId) {
        break;
      }

      const folderData = docSnap.data();
      path.unshift({ id: docSnap.id, name: folderData.name });
      currentId = folderData.parentId;
    }

    return path;
  } catch (error) {
    console.error('Error getting folder path:', error);
    throw error;
  }
};

// Add this new function to edit folder name
export const editFolderName = async (folderId, newName, userId) => {
  try {
    const docRef = doc(db, 'files', folderId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists() || docSnap.data().userId !== userId) {
      throw new Error('Unauthorized or folder not found');
    }

    // Check if it's a folder
    if (docSnap.data().type !== 'folder') {
      throw new Error('This item is not a folder');
    }

    await updateDoc(docRef, {
      name: newName,
      updatedAt: serverTimestamp()
    });

    return {
      id: docRef.id,
      ...docSnap.data(),
      name: newName
    };
  } catch (error) {
    console.error('Error editing folder name:', error);
    throw error;
  }
};

export const renameItem = async (itemId, newName, userId) => {
  try {
    const docRef = doc(db, 'files', itemId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists() || docSnap.data().userId !== userId) {
      throw new Error('Unauthorized or item not found');
    }

    await updateDoc(docRef, {
      name: newName,
      updatedAt: serverTimestamp()
    });

    return {
      id: docRef.id,
      ...docSnap.data(),
      name: newName
    };
  } catch (error) {
    console.error('Error renaming item:', error);
    throw error;
  }
};
