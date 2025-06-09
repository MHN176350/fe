import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/apis';
import { useAuth } from '../../hooks/useAuth';


const WarehouseList = ({ user, showModal, setShowModal }) => {
  useAuth('/');
  const [modalVisible, setModalVisible] = useState(false);
  const [warehouse, setWarehouse] = useState({ location: '', code: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [warehouses, setWarehouses] = useState([]);


  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await api.get('/api/warehouse/getall');
      if (response.data.statusCode === 200) {
        setWarehouses(response.data.data || []);
        setMessage('');
      } else {
        setWarehouses([]);
        setMessage(response.data.message || 'Failed to fetch warehouses.');
      }
    } catch (err) {
      setWarehouses([]);
      setMessage('Failed to fetch warehouses.');
    }
  };

  // Open modal with animation
  const openModal = () => {
    setModalVisible(true);
    setTimeout(() => setShowModal(true), 10);
  };

  // Close modal with fade-out animation
  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setModalVisible(false), 200);
  };

  const handleWarehouseChange = (e) => {
    setWarehouse({ ...warehouse, [e.target.name]: e.target.value });
  };

  const handleWarehouseSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        '/api/warehouse/create',
        warehouse,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      closeModal();
      setWarehouse({ location: '', code: '' });
      fetchWarehouses();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('Failed to add warehouse.');
      closeModal();
      setTimeout(() => setMessage(''), 4000);
    }
  };

  // Optionally, you can fetch warehouse items here or in the detail page

  return (
    <>
      <div className={`flex-1 flex flex-col items-center justify-center ${modalVisible ? 'filter blur-sm pointer-events-none' : ''}`}>
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-4xl mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Warehouses</h2>
            <button
              className="px-6 py-2 rounded-full bg-gradient-to-r from-white to-gray-300 text-black font-semibold shadow-md hover:from-white hover:to-gray-400 transition"
              onClick={openModal}
            >
              Add Warehouse
            </button>
          </div>
          {error && <div className="mb-4 text-red-400">{error}</div>}
          {message && (
            <div className="mb-4 text-white">{message}</div>
          )}
          <table className="w-full text-left bg-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Item Count</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-4">Detail</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.length > 0 ? (
                warehouses.map((wh, idx) => (
                  <tr key={wh.code || idx} className="border-t border-gray-600">
                    <td className="py-2 px-4">{idx + 1}</td>
                    <td className="py-2 px-4">{wh.code}</td>
                    <td className="py-2 px-4">{wh.location}</td>
                    <td className="py-2 px-4">{wh.itemCount}</td>
                    <td className="py-2 px-4">{wh.ownerName}</td>
                    <td className="py-2 px-4">{wh.createdDate}</td>
                    <td className="py-2 px-4">{wh.updatedDate}</td>
                    <td className="py-2 px-4">
                      <Link
                        to={`/warehouse/${wh.id}`}
                        className="text-blue-400 hover:underline"
                        onClick={async (e) => {
                         
                        }}
                      >
                        Show Detail
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-4xl text-white/30 font-extrabold">
                    No Warehouses Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast message at top right */}
      {message && (
        <div className="fixed top-6 right-8 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {message}
        </div>
      )}

      {/* Modal with fade animation */}
      {modalVisible && (
        <div
          className={`
            fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60
            transition-opacity duration-200
            ${showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
        >
          <form
            onSubmit={handleWarehouseSubmit}
            className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center transition-all duration-200"
          >
            <h3 className="text-xl font-bold mb-6 text-white">Add Warehouse</h3>
            <div className="mb-4 w-full">
              <label className="block text-gray-300 mb-2" htmlFor="location">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={warehouse.location}
                onChange={handleWarehouseChange}
                required
                className="w-full px-4 py-3 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div className="mb-6 w-full">
              <label className="block text-gray-300 mb-2" htmlFor="code">
                Code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                value={warehouse.code}
                onChange={handleWarehouseChange}
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
    </>
  );
};

export default WarehouseList;