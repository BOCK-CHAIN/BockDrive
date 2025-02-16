import { create } from 'zustand';

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
}));

export default useAuthStore;
