import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

function BreadcrumbNav({ path }) {
  if (!path || !path.length) {
    return (
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
        <HomeIcon className="w-4 h-4 mr-2" />
        <span>My Drive</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-sm">
      <Link 
        to="/" 
        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white 
          flex items-center transition-colors duration-200"
      >
        <HomeIcon className="w-4 h-4" />
      </Link>
      
      {path.map((item, index) => (
        <div key={item.id} className="flex items-center">
          <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400 dark:text-gray-500" />
          {index === path.length - 1 ? (
            <span className="text-gray-900 dark:text-white">
              {item.name}
            </span>
          ) : (
            <Link
              to={`/folder/${item.id}`}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 
                dark:hover:text-white transition-colors duration-200"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

export default BreadcrumbNav;
