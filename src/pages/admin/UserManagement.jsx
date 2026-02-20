import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Create user form
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: 'Storekeeper'
  });

  // Reset password form
  const [resetPassword, setResetPassword] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/UserManagement/AllUsers');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    // Validation
    if (newUser.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      await api.post('/UserManagement/CreateUser', {
        ...newUser,
        createdBy: user.userId
      });

      alert(`✅ User ${newUser.username} created successfully!`);
      setShowCreateModal(false);
      setNewUser({ username: '', password: '', fullName: '', email: '', role: 'Storekeeper' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      alert(error.response?.data?.message || 'Error creating user');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (resetPassword.newPassword !== resetPassword.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (resetPassword.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      await api.post('/UserManagement/ResetPassword', {
        userId: selectedUser.userId,
        newPassword: resetPassword.newPassword,
        resetBy: user.userId
      });

      alert(`✅ Password reset successfully for ${selectedUser.username}`);
      setShowResetPasswordModal(false);
      setResetPassword({ newPassword: '', confirmPassword: '' });
      setSelectedUser(null);
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Error resetting password');
    }
  };

  const handleToggleActive = async (userId, username, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} ${username}?`)) return;

    try {
      await api.post('/UserManagement/UpdateUser', {
        userId: userId,
        isActive: !currentStatus,
        modifiedBy: user.userId
      });

      alert(`✅ User ${username} ${action}d successfully`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user status');
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-600 mt-1">Create and manage user accounts</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          ➕ Create New User
        </button>
      </div>

      {/* Users Table */}
      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{u.username}</td>
                    <td className="px-6 py-4 text-sm">{u.fullName}</td>
                    <td className="px-6 py-4 text-sm">{u.email || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        u.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        u.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setShowResetPasswordModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        🔑 Reset Password
                      </button>
                      {u.role !== 'Admin' && (
                        <button
                          onClick={() => handleToggleActive(u.userId, u.username, u.isActive)}
                          className={`font-medium ${
                            u.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                          }`}
                        >
                          {u.isActive ? '🚫 Deactivate' : '✅ Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create New User</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="input-field"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  className="input-field"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="Storekeeper">Storekeeper</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewUser({ username: '', password: '', fullName: '', email: '', role: 'Storekeeper' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Reset Password for {selectedUser.username}</h3>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="input-field"
                  value={resetPassword.newPassword}
                  onChange={(e) => setResetPassword({ ...resetPassword, newPassword: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="input-field"
                  value={resetPassword.confirmPassword}
                  onChange={(e) => setResetPassword({ ...resetPassword, confirmPassword: e.target.value })}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Reset Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetPasswordModal(false);
                    setResetPassword({ newPassword: '', confirmPassword: '' });
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserManagement;

