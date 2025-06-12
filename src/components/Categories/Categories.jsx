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
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg mt-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <button
            className="px-6 py-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-200 text-gray-900 font-semibold shadow-md hover:from-gray-500 hover:to-gray-300 transition"
            onClick={openModal}
          >
            Add Category
          </button>
        </div>
        {notFound ? (
          <div>
            <div className="text-4xl text-gray-400 font-extrabold text-center w-full select-none pointer-events-none">
              {notFoundMsg || 'Not Found'}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-lg">
            <table className="w-full min-w-max table-auto text-left bg-gray-50 text-gray-900 rounded-2xl border border-gray-300">
              <thead>
                <tr>
                  <th className="border-b border-r border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">#</th>
                  <th className="border-b border-r border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">Name</th>
                  <th className="border-b border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">Description</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((cat, idx) => (
                    <tr key={cat.id || idx} className="hover:bg-gray-200 transition">
                      <td className="p-4 border-b border-r border-gray-200">{idx + 1}</td>
                      <td className="p-4 border-b border-r border-gray-200">{cat.name}</td>
                      <td className="p-4 border-b border-gray-200">{cat.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-4xl text-gray-400 font-extrabold border-b border-gray-200">
                      No Categories Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Toast message */}
      {message && (
        <div className="fixed top-6 right-8 z-50 bg-gray-700 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {message}
        </div>
      )}

      {/* Modal */}
      {modalVisible && (
        <div
          className={`
            fixed inset-0 z-40 flex items-center justify-center bg-gray-900 bg-opacity-60
            transition-opacity duration-200
            ${showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center transition-all duration-200"
          >
            <h3 className="text-xl font-bold mb-6 text-gray-900">Add Category</h3>
            <div className="mb-4 w-full">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-full bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              />
            </div>
            <div className="mb-6 w-full">
              <label className="block text-gray-700 mb-2" htmlFor="description">
                Description
              </label>
              <input
                id="description"
                name="description"
                type="text"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-full bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              />
            </div>
            <div className="flex w-full justify-between">
              <button
                type="button"
                className="px-6 py-2 rounded-full bg-gray-300 text-gray-700 font-semibold mr-2 hover:bg-gray-400 transition"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-500 text-white font-semibold hover:from-gray-800 hover:to-gray-600 transition"
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