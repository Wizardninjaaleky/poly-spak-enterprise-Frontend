import React, { useState, useEffect } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { setLoading(false); }, []);

  const handleRoleChange = async (userId, newRole) => {
    // TODO: call API
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
  };

  const handleBlockUser = async (userId, isBlocked) => {
    // TODO: call API
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: !isBlocked } : u));
  };

  const filteredUsers = users.filter(user => (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Users</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="flex items-center space-x-4">
        <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md" />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10"><div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">U</div></div>
                    <div className="ml-4"><div className="text-sm font-medium text-gray-900">{user.name}</div><div className="text-sm text-gray-500">{user.email}</div></div>
                  </div>
                </td>
                <td><select value={user.role || 'user'} onChange={(e) => handleRoleChange(user._id, e.target.value)} className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}><option value="user">User</option><option value="admin">Admin</option></select></td>
                <td><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{user.isBlocked ? 'Blocked' : 'Active'}</span></td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex space-x-2">
                    <button onClick={() => handleRoleChange(user._id, user.role === 'admin' ? 'user' : 'admin')} className="text-green-600">{user.role === 'admin' ? 'Demote' : 'Promote'}</button>
                    <button onClick={() => handleBlockUser(user._id, user.isBlocked)} className={`hover:text-red-900 ${user.isBlocked ? 'text-green-600' : 'text-red-600'}`}>{user.isBlocked ? 'Unblock' : 'Block'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && !loading && <div className="text-center py-12"><p className="text-gray-500">No users found.</p></div>}
    </div>
  );
};

export default Users;
