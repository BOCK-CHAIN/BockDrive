import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import UserProfileMenu from './UserProfileMenu';
import ThemeToggle from './ThemeToggle';

function Layout() {
  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b dark:border-gray-700 bg-white dark:bg-gray-800 px-4 flex items-center justify-end gap-4">
          <ThemeToggle />
          <UserProfileMenu />
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
