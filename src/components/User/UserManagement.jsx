import React, { useEffect, useState } from 'react';
import api from '../../api/apis';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState('userName');
  const [sortAsc, setSortAsc] = useState(true);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/auth/getalluser');
        if (res.data.statusCode === 200) {
          setUsers(res.data.data || []);
        } else {
          setError(res.data.message || 'Failed to fetch users.');
        }
      } catch {
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle isActive toggle
  const handleToggleActive = async (userId) => {
    try {
      await api.post(`/api/auth/lock/${userId}`);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isActive: !u.isActive } : u
        )
      );
      setMsg('User status updated.');
      setTimeout(() => setMsg(''), 2000);
    } catch {
      setError('Failed to update user status.');
      setTimeout(() => setError(''), 2000);
    }
  };

  // Sorting logic
  const sortedUsers = [...users]
    .filter((user) => !user.isAdmin)
    .sort((a, b) => {
      let aValue, bValue;
      if (sortField === 'userName') {
        aValue = a.userName?.toLowerCase() || '';
        bValue = b.userName?.toLowerCase() || '';
      } else if (sortField === 'createdDate') {
        aValue = a.createdDate || '';
        bValue = b.createdDate || '';
      } else if (sortField === 'lastLogin') {
        aValue = a.lastLogin || '';
        bValue = b.lastLogin || '';
      }
      if (!aValue && !bValue) return 0;
      if (!aValue) return sortAsc ? -1 : 1;
      if (!bValue) return sortAsc ? 1 : -1;
      if (sortField === 'createdDate' || sortField === 'lastLogin') {
        // Compare as dates
        return sortAsc
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      } else {
        // Compare as string
        return sortAsc
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });

  // Handle sort click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc((asc) => !asc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-white via-gray-100 to-gray-300 pt-12">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">System User</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {loading ? (
          <div className="text-center text-gray-700">Loading...</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow">
            <table className="w-full text-left bg-gray-50 text-gray-900 rounded-2xl border border-gray-300">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b border-gray-300 bg-gray-100 font-bold">#</th>
                  <th className="py-3 px-4 border-b border-gray-300 bg-gray-100 font-bold">Avatar</th>
                  <th
                    className="py-3 px-4 border-b border-gray-300 bg-gray-100 font-bold cursor-pointer select-none"
                    onClick={() => handleSort('userName')}
                  >
                    Username
                    <span className="ml-1">{sortField === 'userName' ? (sortAsc ? '▲' : '▼') : ''}</span>
                  </th>
                  <th className="py-3 px-4 border-b border-gray-300 bg-gray-100 font-bold">First Name</th>
                  <th className="py-3 px-4 border-b border-gray-300 bg-gray-100 font-bold">Last Name</th>
                  <th className="py-3 px-4 border-b border-gray-300 bg-gray-100 font-bold">Email</th>
                  <th className="py-3 px-4 border-b border-gray-300 bg-gray-100 font-bold">Active</th>
                  <th
                    className="py-3 px-4 border-b border-gray-300 bg-gray-100 font-bold cursor-pointer select-none"
                    onClick={() => handleSort('lastLogin')}
                  >
                    Last Login
                    <span className="ml-1">{sortField === 'lastLogin' ? (sortAsc ? '▲' : '▼') : ''}</span>
                  </th>
                  <th
                    className="py-3 px-4 border-b border-gray-300 bg-gray-100 font-bold cursor-pointer select-none"
                    onClick={() => handleSort('createdDate')}
                  >
                    Created
                    <span className="ml-1">{sortField === 'createdDate' ? (sortAsc ? '▲' : '▼') : ''}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-gray-200 transition">
                    <td className="py-2 px-4 border-b border-gray-200">{idx + 1}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <img
                        src={user.avatar}
                        alt={user.userName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 bg-white"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">{user.userName}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{user.firstName}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{user.lastName}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{user.email || <span className="italic text-gray-400">N/A</span>}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <button
                        onClick={() => handleToggleActive(user.id)}
                        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                          user.isActive ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                        aria-pressed={user.isActive}
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                        style={{ minWidth: 48 }}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
                            user.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                        
                      </button>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : <span className="italic text-gray-400">Never</span>}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {user.createdDate ? new Date(user.createdDate).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;