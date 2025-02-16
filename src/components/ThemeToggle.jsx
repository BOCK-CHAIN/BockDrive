import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import useThemeStore from '../store/themeStore';

function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <SunIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
      ) : (
        <MoonIcon className="w-6 h-6 text-gray-500" />
      )}
    </button>
  );
}

export default ThemeToggle;
