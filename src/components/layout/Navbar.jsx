import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 h-16">
      <div className="flex justify-between items-center h-full px-3">

        {/* Left: Hamburger + Title — flush to left edge */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            Inventory Management System
          </h1>
        </div>

        {/* Right: Welcome + Logout */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">
            Welcome,{' '}
            <span className="font-medium">{user?.fullName || user?.username}</span>
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
