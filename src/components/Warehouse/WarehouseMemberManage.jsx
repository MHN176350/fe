import React, { useEffect, useState } from 'react';
import api from '../../api/apis';

const ROLE_OPTIONS = [
  { label: 'Owner', value: 1 },
  { label: 'Manager', value: 2 }
];

const WarehouseMemberManage = () => {
  const [codes, setCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [members, setMembers] = useState([]);
  const [loadingCodes, setLoadingCodes] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ userName: '', roleId: 1 });
  const [adding, setAdding] = useState(false);

  // Fetch storage codes on mount
  useEffect(() => {
    const fetchCodes = async () => {
      setLoadingCodes(true);
      try {
        const res = await api.get('/api/warehouse/getcode');
        if (res.data.statusCode === 200) {
          setCodes(res.data.data || []);
        } else {
          setError(res.data.message || 'Failed to fetch storage codes.');
        }
      } catch {
        setError('Failed to fetch storage codes.');
      } finally {
        setLoadingCodes(false);
      }
    };
    fetchCodes();
  }, []);

  // Fetch members when code changes
  useEffect(() => {
    if (!selectedCode) {
      setMembers([]);
      setShowAdd(false);
      setSelectedId(null);
      return;
    }
    const fetchMembers = async () => {
      setLoadingMembers(true);
      setError('');
      try {
        const res = await api.get(`/api/warehouse/members?Code=${selectedCode}`);
        if (res.data.statusCode === 200) {
          setMembers(res.data.data || []);
        } else {
          setError(res.data.message || 'Failed to fetch members.');
        }
      } catch {
        setError('Failed to fetch members.');
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchMembers();
  }, [selectedCode]);

  // Handle privilege change
  const handleRoleChange = async (storageUserId, newRoleId) => {
    try {
      await api.post('/api/warehouse/crole', {
        Id: storageUserId,
        roleId: newRoleId
      });
      setMembers((prev) =>
        prev.map((m) =>
          m.id === storageUserId
            ? { ...m, privilage: newRoleId === 1 ? 'Owner' : 'Manager' }
            : m
        )
      );
      setMsg('Role updated.');
      setTimeout(() => setMsg(''), 2000);
    } catch {
      setError('Failed to update role.');
      setTimeout(() => setError(''), 2000);
    }
  };

  // Handle delete member (dummy, implement API if needed)
  const handleDelete = (storageUserId) => {
    setMembers((prev) => prev.filter((m) => m.id !== storageUserId));
    setMsg('Member deleted (local only).');
    setTimeout(() => setMsg(''), 2000);
  };

  // Handle add member form
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: name === 'roleId' ? Number(value) : value
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setAdding(true);
    try {
      const stId = selectedId;
      const req = {
        userName: addForm.userName,
        stId,
        roleId: addForm.roleId
      };
      const res = await api.post('/api/warehouse/addMember', req);
      if (res.data.statusCode === 200) {
        setMsg('Member added.');
        setShowAdd(false);
        // Refresh members
        const memRes = await api.get(`/api/warehouse/members/${selectedCode}`);
        setMembers(memRes.data.data || []);
        setAddForm({ userName: '', roleId: 1 });
      } else {
        setError(res.data.message || 'Failed to add member.');
      }
    } catch {
      setError('Failed to add member.');
    } finally {
      setAdding(false);
      setTimeout(() => setMsg(''), 2000);
    }
  };

  // Handle dropdown change
  const handleStorageChange = (e) => {
    const code = e.target.value;
    setSelectedCode(code);
    const found = codes.find(c => c.code === code);
    setSelectedId(found ? found.id : null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-white via-gray-100 to-gray-300 pt-12">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Warehouse Member Management</h2>
        {msg && <div className="mb-4 text-green-600">{msg}</div>}
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-semibold">Select Storage Code:</label>
          {loadingCodes ? (
            <span className="text-gray-500">Loading codes...</span>
          ) : (
            <select
              className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedCode}
              onChange={handleStorageChange}
            >
              <option value="">-- Select Storage Code --</option>
              {codes.map(codeObj => (
                <option key={codeObj.code} value={codeObj.code}>{codeObj.code}</option>
              ))}
            </select>
          )}
        </div>
        {selectedCode && (
          <button
            className="mb-4 px-6 py-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition"
            onClick={() => setShowAdd(true)}
          >
            + Add Member
          </button>
        )}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
            <form
              onSubmit={handleAddSubmit}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs flex flex-col items-center border border-blue-200"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800">Add Member</h3>
              <input
                type="text"
                name="userName"
                value={addForm.userName}
                onChange={handleAddChange}
                placeholder="Username"
                required
                className="mb-4 w-full px-4 py-2 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <select
                name="roleId"
                value={addForm.roleId}
                onChange={handleAddChange}
                className="mb-4 w-full px-4 py-2 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {ROLE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="flex w-full justify-between">
                <button
                  type="button"
                  className="px-4 py-2 rounded-full bg-gray-400 text-white font-semibold hover:bg-gray-600 transition"
                  onClick={() => setShowAdd(false)}
                  disabled={adding}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-700 transition ml-2"
                  disabled={adding}
                >
                  {adding ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        )}
        {loadingMembers ? (
          <div className="text-gray-600">Loading members...</div>
        ) : selectedCode && (
          <div className="overflow-x-auto rounded-2xl shadow">
            <table className="w-full text-left bg-gray-50 text-gray-900 rounded-2xl border border-gray-300">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b border-gray-300 bg-gray-100 font-bold">#</th>
                  <th className="py-3 px-4 border-b border-gray-300 bg-gray-100 font-bold">Avatar</th>
                  <th className="py-3 px-4 border-b border-gray-300 bg-gray-100 font-bold">Full Name</th>
                  <th className="py-3 px-4 border-b border-gray-300 bg-gray-100 font-bold">Username</th>
                  <th className="py-3 px-4 border-b border-gray-300 bg-gray-100 font-bold">Privilege</th>
                  <th className="py-3 px-4 border-b border-gray-300 bg-gray-100 font-bold">Last Login</th>
                  <th className="py-3 px-4 border-b border-gray-300 bg-gray-100 font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-gray-200 transition">
                    <td className="py-2 px-4 border-b border-gray-200">{idx + 1}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <img
                        src={m.avatar}
                        alt={m.userName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 bg-white"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">{m.fullName}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{m.userName}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <select
                        className="px-2 py-1 rounded border border-gray-300 bg-white"
                        value={m.privilage === 'Owner' ? 1 : 2}
                        onChange={e => handleRoleChange(m.id, Number(e.target.value))}
                      >
                        {ROLE_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {m.lastLogin ? new Date(m.lastLogin).toLocaleString() : <span className="italic text-gray-400">Never</span>}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="px-3 py-1 rounded bg-red-400 text-white hover:bg-red-600 transition"
                        title="Delete Member"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-400 font-bold">
                      No members found for this storage.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseMemberManage;