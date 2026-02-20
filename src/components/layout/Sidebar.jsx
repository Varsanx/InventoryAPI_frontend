import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth(); // ✅ FIX: Import user from useAuth

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <nav className="mt-5">
        <Link
          to="/dashboard"
          className={`flex items-center px-6 py-3 hover:bg-gray-700 ${
            location.pathname === '/dashboard' ? 'bg-gray-900 border-l-4 border-blue-500' : ''
          }`}
        >
          <span className="mr-3">📊</span>
          Dashboard
        </Link>

        <Link
          to="/items"
          className={`flex items-center px-6 py-3 hover:bg-gray-700 ${
            location.pathname.startsWith('/items') ? 'bg-gray-900 border-l-4 border-blue-500' : ''
          }`}
        >
          <span className="mr-3">📦</span>
          Items
        </Link>

        <Link
          to="/transactions"
          className={`flex items-center px-6 py-3 hover:bg-gray-700 ${
            location.pathname.startsWith('/transactions') ? 'bg-gray-900 border-l-4 border-blue-500' : ''
          }`}
        >
          <span className="mr-3">🔄</span>
          Transactions
        </Link>

        <Link
          to="/reports"
          className={`flex items-center px-6 py-3 hover:bg-gray-700 ${
            location.pathname === '/reports' ? 'bg-gray-900 border-l-4 border-blue-500' : ''
          }`}
        >
          <span className="mr-3">📈</span>
          Reports
        </Link>

        <Link
          to="/alerts"
          className={`flex items-center px-6 py-3 hover:bg-gray-700 ${
            location.pathname === '/alerts' ? 'bg-gray-900 border-l-4 border-blue-500' : ''
          }`}
        >
          <span className="mr-3">🔔</span>
          Alerts
        </Link>

        {/* ✅ ADMIN ONLY MENU - User Management */}
        {user?.role === 'Admin' && (
          <Link
            to="/admin/users"
            className={`flex items-center px-6 py-3 hover:bg-gray-700 ${
              location.pathname === '/admin/users' ? 'bg-gray-900 border-l-4 border-blue-500' : ''
            }`}
          >
            <span className="mr-3">👥</span>
            User Management
          </Link>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
