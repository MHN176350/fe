import React, { useEffect, useState } from 'react';
import api from '../../api/apis';
import Sidebar from '../Layout/Sidebar';
import { FaUserCircle } from 'react-icons/fa';
import { MdOutlinePassword } from 'react-icons/md';
import { AiOutlineUpload } from 'react-icons/ai';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  // Change password modal state
  const [showChangePw, setShowChangePw] = useState(false);
  const [pwForm, setPwForm] = useState({
    oldPassword: '',
    newPassword: '',
    repeatNewPassword: ''
  });
  const [pwMsg, setPwMsg] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreview('');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  }, [selectedFile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadMsg('Please select an image file.');
      setSelectedFile(null);
      setPreview('');
      return;
    }
    setUploadMsg('');
    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadMsg('Please select an image file.');
      return;
    }
    setUploading(true);
    setUploadMsg('');
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.split(',')[1];
        const res = await api.post('/api/auth/changeProfilePicture', { pictureContent: base64String });
        if (res.data.statusCode === 200) {
          const updatedUser = { ...user, avatar: res.data.data };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
          setShowUpload(false);
          setSelectedFile(null);
          setPreview('');
          setUploadMsg('Profile picture updated!');
          setTimeout(() => setUploadMsg(''), 2000);
        } else {
          setUploadMsg(res.data.message || 'Failed to update avatar.');
        }
        setUploading(false);
      };
      reader.readAsDataURL(selectedFile);
    } catch {
      setUploadMsg('Failed to upload image.');
      setUploading(false);
    }
  };

  // Change password handlers
  const handlePwChange = (e) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwMsg('');
    if (!pwForm.oldPassword || !pwForm.newPassword || !pwForm.repeatNewPassword) {
      setPwMsg('Please fill all fields.');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg('New password must be at least 6 characters.');
      return;
    }
    if (pwForm.newPassword !== pwForm.repeatNewPassword) {
      setPwMsg('New passwords do not match.');
      return;
    }
    setPwLoading(true);
    try {
      const res = await api.post('/api/auth/changePassword', {
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword
      });
      if (res.data.statusCode === 200) {
        setPwMsg('Password changed successfully!');
        setTimeout(() => {
          setShowChangePw(false);
          setPwMsg('');
          setPwForm({ oldPassword: '', newPassword: '', repeatNewPassword: '' });
        }, 2000);
      } else {
        setPwMsg(res.data.message || 'Failed to change password.');
      }
    } catch {
      setPwMsg('Failed to change password.');
    }
    setPwLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0ea5e9]">
      {/* Sidebar from Layout */}
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 ml-20 md:ml-56 transition-all duration-700">
        <div className="w-full max-w-xl bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0ea5e9] rounded-2xl shadow-2xl p-10 flex flex-col items-center border border-blue-700">
          <div className="mb-6 relative">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-28 h-28 rounded-full object-cover border-4 border-cyan-400 shadow-lg bg-white"
              />
            ) : (
              <FaUserCircle className="w-28 h-28 text-cyan-400 rounded-full bg-gray-900 p-2" />
            )}
            <button
              className="absolute bottom-0 right-0 bg-cyan-500 text-white px-3 py-1 rounded-full shadow hover:bg-cyan-700 border border-cyan-700 transition flex items-center gap-1"
              onClick={() => setShowUpload(true)}
            >
              <AiOutlineUpload /> Change
            </button>
          </div>
          <h2 className="text-3xl font-extrabold text-cyan-100 mb-2 text-center drop-shadow">User Profile</h2>
          <div className="w-full mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <span className="block text-cyan-300 text-sm">Username</span>
                <span className="block text-cyan-100 text-lg font-semibold">{user?.userName || '-'}</span>
              </div>
              <div className="mb-4">
                <span className="block text-cyan-300 text-sm">First Name</span>
                <span className="block text-cyan-100 text-lg font-semibold">{user?.firstName || '-'}</span>
              </div>
              <div className="mb-4">
                <span className="block text-cyan-300 text-sm">Last Name</span>
                <span className="block text-cyan-100 text-lg font-semibold">{user?.lastName || '-'}</span>
              </div>
              <div className="mb-4">
                <span className="block text-cyan-300 text-sm">Email</span>
                <span className="block text-cyan-100 text-lg font-semibold">SWMS@gmail.com</span>
              </div>
            </div>
          </div>
          <button
            className="mt-4 px-6 py-2 rounded-full bg-cyan-500 text-white border border-cyan-700 font-semibold hover:bg-cyan-700 hover:text-white transition flex items-center gap-2"
            onClick={() => setShowChangePw(true)}
          >
            <MdOutlinePassword /> Change Password
          </button>
        </div>

        {/* Upload Avatar Modal */}
        {showUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fade-in">
            <form
              onSubmit={handleUpload}
              className="bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0ea5e9] text-white rounded-2xl shadow-2xl p-8 w-full max-w-xs flex flex-col items-center border border-cyan-700"
            >
              <h3 className="text-xl font-bold mb-4 text-cyan-100">Change Profile Picture</h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4 text-cyan-900 bg-cyan-100 rounded-full px-2 py-1"
              />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-cyan-400 bg-white"
                />
              )}
              {uploadMsg && (
                <div className="mb-2 text-center text-sm text-red-400">{uploadMsg}</div>
              )}
              <div className="flex w-full justify-between">
                <button
                  type="button"
                  className="px-4 py-2 rounded-full bg-cyan-700 text-white border border-cyan-700 font-semibold hover:bg-cyan-900 hover:text-white transition"
                  onClick={() => {
                    setShowUpload(false);
                    setSelectedFile(null);
                    setPreview('');
                    setUploadMsg('');
                  }}
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-cyan-500 text-white font-semibold hover:bg-cyan-700 transition ml-2"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Change Password Modal */}
        {showChangePw && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fade-in">
            <form
              onSubmit={handlePwSubmit}
              className="bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0ea5e9] text-white rounded-2xl shadow-2xl p-8 w-full max-w-xs flex flex-col items-center border border-cyan-700"
            >
              <h3 className="text-xl font-bold mb-4 text-cyan-100">Change Password</h3>
              <input
                type="password"
                name="oldPassword"
                value={pwForm.oldPassword}
                onChange={handlePwChange}
                placeholder="Old Password"
                className="mb-3 w-full px-4 py-2 rounded bg-cyan-100 text-cyan-900 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                required
              />
              <input
                type="password"
                name="newPassword"
                value={pwForm.newPassword}
                onChange={handlePwChange}
                placeholder="New Password"
                className="mb-3 w-full px-4 py-2 rounded bg-cyan-100 text-cyan-900 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                required
              />
              <input
                type="password"
                name="repeatNewPassword"
                value={pwForm.repeatNewPassword}
                onChange={handlePwChange}
                placeholder="Repeat New Password"
                className="mb-4 w-full px-4 py-2 rounded bg-cyan-100 text-cyan-900 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                required
              />
              {pwMsg && (
                <div className="mb-2 text-center text-sm text-red-400">{pwMsg}</div>
              )}
              <div className="flex w-full justify-between">
                <button
                  type="button"
                  className="px-4 py-2 rounded-full bg-cyan-700 text-white border border-cyan-700 font-semibold hover:bg-cyan-900 hover:text-white transition"
                  onClick={() => {
                    setShowChangePw(false);
                    setPwForm({ oldPassword: '', newPassword: '', repeatNewPassword: '' });
                    setPwMsg('');
                  }}
                  disabled={pwLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-cyan-500 text-white font-semibold hover:bg-cyan-700 transition ml-2"
                  disabled={pwLoading}
                >
                  {pwLoading ? 'Changing...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserProfile;