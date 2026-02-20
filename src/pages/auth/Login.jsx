import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔐 Login attempt:', { username: formData.username });

    try {
      const result = await login(formData.username, formData.password);
      
      console.log('✅ Login successful:', result);
      
      // Give user feedback
      alert(`Welcome ${result.fullName}!`);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Login error:', err);
      
      // Extract error message
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.response) {
        // Server responded with error
        console.error('Server error response:', err.response.data);
        errorMessage = err.response.data?.message || err.response.data || errorMessage;
      } else if (err.request) {
        // Request made but no response
        console.error('No response from server:', err.request);
        errorMessage = 'Cannot connect to server. Please check if backend is running.';
      } else {
        // Something else happened
        console.error('Error details:', err.message);
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
      
      // Keep error visible for at least 5 seconds
      setTimeout(() => {
        // Don't auto-clear error
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Inventory Management System
          </h1>
          <p className="text-gray-600">Please sign in to continue</p>
        </div>

        {/* ERROR MESSAGE - STAYS VISIBLE */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div className="flex-1">
                <p className="font-bold text-sm">Login Failed</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
              <button 
                onClick={() => setError('')}
                className="text-red-700 hover:text-red-900 ml-2"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* TEST CREDENTIALS */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">Test Credentials:</p>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Username: <span className="font-mono font-bold">admin</span></p>
            <p>Password: <span className="font-mono font-bold">Admin@123</span></p>
          </div>
        </div>

        {/* DEBUG INFO */}
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-xs font-semibold text-blue-900 mb-1">Connection Status:</p>
          <p className="text-xs text-blue-700">
            Backend: <span className="font-mono">{import.meta.env.VITE_API_URL || 'http://localhost:5150/api'}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
