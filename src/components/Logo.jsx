import { Link } from 'react-router-dom';

function Logo({ className = '' }) {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <span className="text-xl font-bold text-blue-600 dark:text-blue-500">Bock Drive</span>
    </Link>
  );
}

export default Logo; 