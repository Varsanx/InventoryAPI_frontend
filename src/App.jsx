import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

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

// Reports & Alerts
import Reports from './pages/reports/Reports';
import Alerts from './pages/alerts/Alerts';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Items */}
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

          {/* Protected Routes - Transactions */}
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

          {/* Protected Routes - Reports */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Alerts */}
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <Alerts />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;