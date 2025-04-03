import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Starred from './pages/Starred';
import Trash from './pages/Trash';
import PrivateRoute from './components/PrivateRoute';
import SignUp from './pages/SignUp';
import Hero from './pages/Hero';

function App() {
  const { setUser, setLoading, user } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <Routes>
        {/* Public Routes - Hero page is available for all users */}
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={user ? <Navigate to="/drive" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/drive" /> : <SignUp />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/drive" element={<Dashboard />} />
          <Route path="/starred" element={<Starred />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/folder/:folderId" element={<Dashboard />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
