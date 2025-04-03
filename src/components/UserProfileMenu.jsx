import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import useAuthStore from '../store/authStore';

function UserProfileMenu() {
  const { user, signOut } = useAuthStore();

  return (
    <Menu as="div" className="relative">
      <Menu.Button 
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
          transition-colors duration-200"
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.email}
            className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-600"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
            {user?.email?.[0].toUpperCase()}
          </div>
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700">
          <div className="p-4">
            <div className="flex items-center gap-4">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.email}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-medium">
                  {user?.email?.[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.displayName || 'User'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-50 dark:bg-gray-700' : ''
                  } group flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-200`}
                  onClick={signOut}
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default UserProfileMenu;