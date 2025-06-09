import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/apis';

const ExportList = () => {
  const { id } = useParams(); // warehouse id
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // For create export invoice
  const [showExportModal, setShowExportModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [exportForm, setExportForm] = useState({
    storageId: id,
    custId: '',
    usePoint: false,
    items: [{ itemId: '', quantity: '', unitPrice: '' }]
  });

  // Fetch export list
  useEffect(() => {
    const fetchExports = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/export/${id}`);
        if (res.data.statusCode === 200) {
          setExports(res.data.data || []);
          setMessage(res.data.message);
        } else {
          setExports([]);
          setError(res.data.message || 'Failed to fetch export list.');
        }
      } catch {
        setExports([]);
        setError('Failed to fetch export list.');
      } finally {
        setLoading(false);
      }
    };
    fetchExports();
  }, [id, message]);

  // Fetch customers and warehouse items for export form
  useEffect(() => {
    if (showExportModal) {
      api.get('/api/cust/getall').then(res => {
        if (res.data.statusCode === 200) setCustomers(res.data.data || []);
      });
      api.get(`/api/item/storage/${id}`).then(res => {
        if (res.data.statusCode === 200) setItems(res.data.data || []);
      });
    }
  }, [showExportModal, id]);

  // Handle export form changes
  const handleExportChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExportForm({
      ...exportForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleExportItemChange = (idx, field, value) => {
    const newItems = exportForm.items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setExportForm({ ...exportForm, items: newItems });
  };

  const handleAddExportItem = () => {
    setExportForm({
      ...exportForm,
      items: [...exportForm.items, { itemId: '', quantity: '', unitPrice: '' }]
    });
  };

  const handleRemoveExportItem = (idx) => {
    setExportForm({
      ...exportForm,
      items: exportForm.items.filter((_, i) => i !== idx)
    });
  };

  // Submit export form
  const handleExportSubmit = async (e) => {
    e.preventDefault();
    if (!exportForm.custId) {
      setMessage('Please select a customer.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    if (
      exportForm.items.some(
        item =>
          !item.itemId ||
          !item.quantity ||
          item.quantity <= 0 ||
          !item.unitPrice ||
          item.unitPrice <= 0
      )
    ) {
      setMessage('Please select item and enter valid quantity and unit price.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const payload = {
        storageId: Number(id),
        custId: Number(exportForm.custId),
        usePoint: exportForm.usePoint,
        items: exportForm.items.map(item => ({
          itemId: Number(item.itemId),
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice)
        }))
      };
      const response = await api.post('/api/export/export', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message);
      setShowExportModal(false);
      setExportForm({
        storageId: id,
        custId: '',
        usePoint: false,
        items: [{ itemId: '', quantity: '', unitPrice: '' }]
      });
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('Failed to create export invoice.');
      setShowExportModal(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-12">
      <div className="w-full max-w-3xl bg-black/70 p-8 rounded-2xl shadow-lg mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold mb-6 text-white">Export Invoices</h2>
          <button
            className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition"
            onClick={() => setShowExportModal(true)}
          >
            Create Export Invoice
          </button>
        </div>
        {error && <div className="mb-4 text-red-400">{error}</div>}
        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : exports.length > 0 ? (
          <table className="w-full text-left bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Created By</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4">Detail</th>
              </tr>
            </thead>
            <tbody>
              {exports.map((exp, idx) => (
                <tr key={exp.id} className="border-t border-gray-700">
                  <td className="py-2 px-4">{idx + 1}</td>
                  <td className="py-2 px-4">{exp.customerName}</td>
                  <td className="py-2 px-4">{exp.discount?.toLocaleString('vi-VN')}₫</td>
                  <td className="py-2 px-4">{exp.total?.toLocaleString('vi-VN')}₫</td>
                  <td className="py-2 px-4">{exp.createdBy}</td>
                  <td className="py-2 px-4">{new Date(exp.createdDate).toLocaleString()}</td>
                  <td className="py-2 px-4">
                    <Link
                      to={`/export/detail/${exp.id}`}
                      className="text-blue-400 hover:underline"
                    >
                      Show Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-4xl text-white/30 font-extrabold text-center select-none pointer-events-none">
            No Export Invoices Found
          </div>
        )}
        {message && !error && (
          <div className="mt-4 text-green-400 text-center">{message}</div>
        )}
      </div>

      {/* Export Invoice Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60">
          <form
            onSubmit={handleExportSubmit}
            className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col items-center transition-all duration-200"
          >
            <h3 className="text-xl font-bold mb-6 text-white">Create Export Invoice</h3>
            <div className="mb-4 w-full">
              <label className="block text-gray-300 mb-2" htmlFor="custId">
                Customer
              </label>
              <select
                id="custId"
                name="custId"
                value={exportForm.custId}
                onChange={handleExportChange}
                required
                className="w-full px-4 py-3 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Select Customer</option>
                {customers.map((cust) => (
                  <option key={cust.id} value={cust.id}>
                    {cust.name} ({cust.phoneNumber})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 w-full flex items-center">
              <input
                id="usePoint"
                name="usePoint"
                type="checkbox"
                checked={exportForm.usePoint}
                onChange={handleExportChange}
                className="mr-2"
              />
              <label htmlFor="usePoint" className="text-gray-300">
                Use Points
              </label>
            </div>
            <div className="mb-4 w-full">
              <label className="block text-gray-300 mb-2">Items</label>
              {exportForm.items.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <select
                    name="itemId"
                    value={item.itemId}
                    onChange={e => handleExportItemChange(idx, 'itemId', e.target.value)}
                    required
                    className="flex-1 px-4 py-2 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Select Item</option>
                    {items.map((it, iidx) => (
                      <option key={iidx} value={it.id || iidx + 1}>
                        {it.productName}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    name="quantity"
                    value={item.quantity}
                    onChange={e => handleExportItemChange(idx, 'quantity', e.target.value)}
                    required
                    placeholder="Quantity"
                    className="w-24 px-4 py-2 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="number"
                    min="1"
                    name="unitPrice"
                    value={item.unitPrice}
                    onChange={e => handleExportItemChange(idx, 'unitPrice', e.target.value)}
                    required
                    placeholder="Unit Price"
                    className="w-32 px-4 py-2 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  {exportForm.items.length > 1 && (
                    <button
                      type="button"
                      className="px-3 py-2 rounded-full bg-red-500 text-white font-bold hover:bg-red-700 transition"
                      onClick={() => handleRemoveExportItem(idx)}
                    >
                      &minus;
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="mt-2 px-4 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-700 transition"
                onClick={handleAddExportItem}
              >
                + Add Item
              </button>
            </div>
            <div className="flex w-full justify-between mt-6">
              <button
                type="button"
                className="px-6 py-2 rounded-full bg-gray-600 text-white font-semibold mr-2 hover:bg-gray-700 transition"
                onClick={() => setShowExportModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold hover:from-blue-600 hover:to-blue-800 transition"
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

export default ExportList;