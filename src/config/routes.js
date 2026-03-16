// ============================================================================
// ROUTES CONFIGURATION
// All application routes defined in one place with unique IDs
// ============================================================================

export const ROUTES = {
  // ──────────────────────────────────────────────────────────────────────────
  // PUBLIC ROUTES
  // ──────────────────────────────────────────────────────────────────────────
  LOGIN: '/login',
  REGISTER: '/register',

  // ──────────────────────────────────────────────────────────────────────────
  // MAIN NAVIGATION ROUTES
  // ──────────────────────────────────────────────────────────────────────────
  DASHBOARD: '/dashboard',
  ITEMS: '/items',
  TRANSACTIONS: '/transactions',
  REPORTS: '/reports',
  ALERTS: '/alerts',

  // ──────────────────────────────────────────────────────────────────────────
  // ITEMS MODULE ROUTES
  // ──────────────────────────────────────────────────────────────────────────
  ITEMS_CREATE: '/items/create',
  ITEMS_EDIT: (id) => `/items/edit/${id}`,
  ITEMS_VIEW: (id) => `/items/${id}`,
  ITEMS_STOCK: (id) => `/items/${id}/stock`,

  // ──────────────────────────────────────────────────────────────────────────
  // TRANSACTIONS MODULE ROUTES
  // ──────────────────────────────────────────────────────────────────────────
  TRANSACTIONS_CREATE: '/transactions/create',
  TRANSACTIONS_VIEW: (id) => `/transactions/${id}`,
  TRANSACTIONS_EDIT: (id) => `/transactions/edit/${id}`,

  // ──────────────────────────────────────────────────────────────────────────
  // ADMIN MODULE ROUTES
  // ──────────────────────────────────────────────────────────────────────────
  ADMIN_USERS: '/admin/users',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_UOM: '/admin/uom',
  ADMIN_SETTINGS: '/admin/settings',

  // ──────────────────────────────────────────────────────────────────────────
  // UTILITY ROUTES
  // ──────────────────────────────────────────────────────────────────────────
  ROOT: '/',
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized',
};

// ============================================================================
// ROUTE METADATA (for menu generation, breadcrumbs, permissions)
// ============================================================================

export const ROUTE_META = {
  [ROUTES.DASHBOARD]: {
    title: 'Dashboard',
    icon: '📊',
    showInMenu: true,
    requiresAuth: true,
  },
  [ROUTES.ITEMS]: {
    title: 'Items',
    icon: '📦',
    showInMenu: true,
    requiresAuth: true,
  },
  [ROUTES.TRANSACTIONS]: {
    title: 'Transactions',
    icon: '🔄',
    showInMenu: true,
    requiresAuth: true,
  },
  [ROUTES.REPORTS]: {
    title: 'Reports',
    icon: '📈',
    showInMenu: true,
    requiresAuth: true,
  },
  [ROUTES.ALERTS]: {
    title: 'Alerts',
    icon: '🔔',
    showInMenu: true,
    requiresAuth: true,
  },
  [ROUTES.ADMIN_USERS]: {
    title: 'User Management',
    icon: '👥',
    showInMenu: true,
    requiresAuth: true,
    requiresRole: 'Admin',
  },
};

export default ROUTES;
