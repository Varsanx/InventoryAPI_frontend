import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/items', icon: '📦', label: 'Items' },
  { to: '/transactions', icon: '🔄', label: 'Transactions' },
  { to: '/reports', icon: '📈', label: 'Reports' },
  { to: '/alerts', icon: '🔔', label: 'Alerts' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* Backdrop overlay — only below navbar */}
      <div
        className={`fixed inset-x-0 bottom-0 top-16 bg-black z-30 transition-opacity duration-300 ${
          isOpen ? 'opacity-40 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar panel — slides in below navbar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-gray-800 text-white z-40 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 shrink-0">
          <span className="font-semibold text-lg tracking-wide">Menu</span>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`flex items-center px-6 py-3 text-sm font-medium hover:bg-gray-700 transition-colors ${
                isActive(to)
                  ? 'bg-gray-900 border-l-4 border-blue-500 text-white'
                  : 'text-gray-300 border-l-4 border-transparent'
              }`}
            >
              <span className="mr-3 text-base">{icon}</span>
              {label}
            </Link>
          ))}

          {/* Admin only */}
          {user?.role === 'Admin' && (
            <Link
              to="/admin/users"
              onClick={onClose}
              className={`flex items-center px-6 py-3 text-sm font-medium hover:bg-gray-700 transition-colors ${
                location.pathname === '/admin/users'
                  ? 'bg-gray-900 border-l-4 border-blue-500 text-white'
                  : 'text-gray-300 border-l-4 border-transparent'
              }`}
            >
              <span className="mr-3 text-base">👥</span>
              User Management
            </Link>
          )}
        </nav>

        {/* Sidebar Footer — logged in user info */}
        <div className="px-6 py-4 border-t border-gray-700 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white">
              {(user?.fullName || user?.username || 'U')[0].toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">
                {user?.fullName || user?.username}
              </span>
              <span className="text-xs text-gray-400">{user?.role}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
