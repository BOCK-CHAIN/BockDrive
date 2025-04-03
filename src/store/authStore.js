import { create } from 'zustand';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({
    user: user ? {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,  // Make sure to include photoURL
    } : null,
    loading: false,
  }),
  setLoading: (loading) => set({ loading }),
  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null });
      window.location.href = '/'; // Navigate to home/hero page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}));

export default useAuthStore;
