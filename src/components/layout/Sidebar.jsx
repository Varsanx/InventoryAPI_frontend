import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/items', name: 'Items', icon: '📦' },
    { path: '/transactions', name: 'Transactions', icon: '🔄' },
    { path: '/reports', name: 'Reports', icon: '📈' },
    { path: '/alerts', name: 'Alerts', icon: '🔔' },
  ];

  return (
    <div className="w-64 bg-gray-800 min-h-screen text-white">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-8">Menu</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;