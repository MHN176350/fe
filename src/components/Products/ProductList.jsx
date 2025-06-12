import React, { useEffect, useState } from 'react';
import api from '../../api/apis';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    code: '',
    name: '',
    description: '',
    price: '',
    catId: ''
  });

  // Fetch products
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/product/pd');
      if (response.data.statusCode === 200) {
        setProducts(response.data.data || []);
        setMessage(response.data.message);
      } else {
        setError(response.data.message || 'Failed to fetch products.');
      }
    } catch (err) {
      setError('Failed to fetch products.');
    }
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/cate/getall');
      if (response.data.statusCode === 200) {
        setCategories(response.data.data || []);
      }
    } catch (err) {
        // ignore
    }
  };

  // Modal open/close logic
  const openModal = () => {
    setModalVisible(true);
    setTimeout(() => setShowModal(true), 10);
  };
  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setModalVisible(false), 200);
    setForm({
      code: '',
      name: '',
      description: '',
      price: '',
      catId: ''
    });
  };

  // Form change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...form,
        price: parseFloat(form.price),
        image: 'nun'
      };
      const response = await api.post(
        '/api/product/create',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      closeModal();
      fetchProducts();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('Failed to add product.');
      closeModal();
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-screen pt-12 bg-gradient-to-b from-gray-100 to-gray-300">
      <div className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-lg mt-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Product List</h2>
          <button
            className="px-6 py-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-200 text-gray-900 font-semibold shadow-md hover:from-gray-500 hover:to-gray-300 transition"
            onClick={openModal}
          >
            Add Product
          </button>
        </div>
        {error && (
          <div className="text-4xl text-gray-400 text-center w-full select-none pointer-events-none">{error}</div>
        )}
        {products.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl shadow-lg">
            <table className="w-full min-w-max table-auto text-left bg-gray-50 text-gray-900 rounded-2xl border border-gray-300">
              <thead>
                <tr>
                  <th className="border-b border-r border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">#</th>
                  <th className="border-b border-r border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">Code</th>
                  <th className="border-b border-r border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">Name</th>
                  <th className="border-b border-r border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">Image</th>
                  <th className="border-b border-r border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">Description</th>
                  <th className="border-b border-r border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">Category</th>
                  <th className="border-b border-r border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">Created</th>
                  <th className="border-b border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">Updated</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod, idx) => (
                  <tr key={prod.code || idx} className="hover:bg-gray-200 transition">
                    <td className="p-4 border-b border-r border-gray-200">{idx + 1}</td>
                    <td className="p-4 border-b border-r border-gray-200">{prod.code}</td>
                    <td className="p-4 border-b border-r border-gray-200">{prod.name}</td>
                    <td className="p-4 border-b border-r border-gray-200">
                      {prod.image && prod.image !== 'nun' ? (
                        <img src={prod.image} alt={prod.name} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <span className="text-gray-400 italic">No Image</span>
                      )}
                    </td>
                    <td className="p-4 border-b border-r border-gray-200">{prod.description}</td>
                    <td className="p-4 border-b border-r border-gray-200">{prod.categoryName}</td>
                    <td className="p-4 border-b border-r border-gray-200">{prod.createdDate}</td>
                    <td className="p-4 border-b border-gray-200">{prod.updatedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !error && (
            <div className="text-4xl text-gray-400 font-extrabold text-center w-full select-none pointer-events-none">
              No Products Found
            </div>
          )
        )}
        {message && !error && (
          <div className="mt-4 text-green-600 text-center">{message}</div>
        )}
      </div>

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
            <h3 className="text-xl font-bold mb-6 text-gray-900">Add Product</h3>
            <div className="mb-4 w-full">
              <label className="block text-gray-700 mb-2" htmlFor="code">
                Code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                value={form.code}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-full bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div className="mb-4 w-full">
              <label className="block text-gray-700 mb-2" htmlFor="name" >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-full bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div className="mb-4 w-full">
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
                className="w-full px-4 py-3 rounded-full bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div className="mb-6 w-full">
              <label className="block text-gray-700 mb-2" htmlFor="catId">
                Category
              </label>
              <select
                id="catId"
                name="catId"
                value={form.catId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-full bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
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

export default ProductList;