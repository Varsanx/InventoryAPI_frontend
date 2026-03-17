import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserManagement from './pages/admin/UserManagement';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';

// Items Pages
import ItemsList from './pages/items/ItemsList';
import ItemForm from './pages/items/ItemForm';
import ItemStock from './pages/items/ItemStock';

// Transactions Pages
import TransactionsList from './pages/transactions/TransactionsList';
import TransactionForm from './pages/transactions/TransactionForm';
import TransactionDetails from './pages/transactions/TransactionDetails';
import AdjustmentForm from './pages/transactions/AdjustmentForm';

// Reports & Alerts
import Reports from './pages/reports/Reports';
import Alerts from './pages/alerts/Alerts';

function App() {
  return (
    <AuthProvider>
        <Router>
          <Routes>

            {/* ================= PUBLIC ROUTES ================= */}

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ================= ADMIN ROUTES ================= */}

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            {/* ================= DASHBOARD ================= */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* ================= ITEMS ================= */}

            <Route
              path="/items"
              element={
                <ProtectedRoute>
                  <ItemsList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/items/create"
              element={
                <ProtectedRoute>
                  <ItemForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/items/edit/:id"
              element={
                <ProtectedRoute>
                  <ItemForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/items/:id/stock"
              element={
                <ProtectedRoute>
                  <ItemStock />
                </ProtectedRoute>
              }
            />

            {/* ================= TRANSACTIONS ================= */}

            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <TransactionsList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/transactions/create"
              element={
                <ProtectedRoute>
                  <TransactionForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/transactions/:id"
              element={
                <ProtectedRoute>
                  <TransactionDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/transactions/adjustment"
              element={
                <ProtectedRoute>
                  <AdjustmentForm />
                </ProtectedRoute>
              }
            />

            {/* ================= REPORTS ================= */}

            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* ================= ALERTS ================= */}

            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              }
            />

            {/* ================= DEFAULT ROUTES ================= */}

            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* ================= 404 ROUTE ================= */}

            <Route path="*" element={<Navigate to="/dashboard" replace />} />

          </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;
