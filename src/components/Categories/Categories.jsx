import React, { useEffect, useState } from 'react';
import api from '../../api/apis';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [notFoundMsg, setNotFoundMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [message, setMessage] = useState('');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/cate/getall');
        if (response.data.statusCode === 404) {
          setNotFound(true);
          setNotFoundMsg(response.data.message);
        } else {
          setCategories(response.data.data || []);
          setNotFound(false);
        }
      } catch (err) {
        setNotFound(true);
        setNotFoundMsg('Failed to fetch categories.');
      }
    };
    fetchCategories();
  }, []);

  const openModal = () => {
    setModalVisible(true);
    setTimeout(() => setShowModal(true), 10);
  };
  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setModalVisible(false), 200);
    setForm({ name: '', description: '' });
  };

  // Form change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit new category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        '/api/cate/create',
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      closeModal();
      // Refresh categories
      const res = await api.get('/api/cate/getall');
      if (res.data.statusCode !== 404) {
        setCategories(res.data.data || []);
        setNotFound(false);
      } else {
        setCategories([]);
        setNotFound(true);
        setNotFoundMsg(res.data.message);
      }
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('Failed to add category.');
      closeModal();
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-screen pt-12 relative">
      <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-2xl shadow-lg mt-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Categories</h2>
          <button
            className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:from-blue-600 hover:to-indigo-700 transition"
            onClick={openModal}
          >
            Add Category
          </button>
        </div>
        {notFound ? (
          <div>
            <div className="text-4xl text-white/30 font-extrabold text-center w-full select-none pointer-events-none">
              {notFoundMsg || 'Not Found'}
            </div>
          </div>
        ) : (
          <table className="w-full text-left bg-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, idx) => (
                <tr key={cat.id || idx} className="border-t border-gray-600">
                  <td className="py-2 px-4">{idx + 1}</td>
                  <td className="py-2 px-4">{cat.name}</td>
                  <td className="py-2 px-4">{cat.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Toast message */}
      {message && (
        <div className="fixed top-6 right-8 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {message}
        </div>
      )}

      {/* Modal */}
      {modalVisible && (
        <div
          className={`
            fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60
            transition-opacity duration-200
            ${showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center transition-all duration-200"
          >
            <h3 className="text-xl font-bold mb-6 text-white">Add Category</h3>
            <div className="mb-4 w-full">
              <label className="block text-gray-300 mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div className="mb-6 w-full">
              <label className="block text-gray-300 mb-2" htmlFor="description">
                Description
              </label>
              <input
                id="description"
                name="description"
                type="text"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div className="flex w-full justify-between">
              <button
                type="button"
                className="px-6 py-2 rounded-full bg-gray-600 text-white font-semibold mr-2 hover:bg-gray-700 transition"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Categories;