import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/apis';

const ImportList = () => {
  const { id } = useParams();
  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // For create import invoice
  const [showImportModal, setShowImportModal] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [importForm, setImportForm] = useState({
    supplierId: '',
    storageId: id,
    list: [{ productId: '', quantity: '', unitPrice: '' }]
  });

  // Fetch import list
  useEffect(() => {
    const fetchImports = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/import/${id}`);
        if (res.data.statusCode === 200) {
          setImports(res.data.data || []);
          setMessage(res.data.message);
        } else {
          setImports([]);
          setError(res.data.message || 'Failed to fetch import list.');
        }
      } catch {
        setImports([]);
        setError('Failed to fetch import list.');
      } finally {
        setLoading(false);
      }
    };
    fetchImports();
  }, [id, message]);

  // Fetch suppliers and products for import form
  useEffect(() => {
    if (showImportModal) {
      api.get('/api/supplier/getsup').then(res => {
        if (res.data.statusCode === 200) setSuppliers(res.data.data || []);
      });
      api.get('/api/product/pd').then(res => {
        if (res.data.statusCode === 200) setProducts(res.data.data || []);
      });
    }
  }, [showImportModal]);

  // Handle import form changes
  const handleImportChange = (e) => {
    setImportForm({ ...importForm, [e.target.name]: e.target.value });
  };

  // Handle product list changes
  const handleProductChange = (idx, field, value) => {
    const newList = importForm.list.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setImportForm({ ...importForm, list: newList });
  };

  // Add new product row
  const handleAddProduct = () => {
    setImportForm({
      ...importForm,
      list: [...importForm.list, { productId: '', quantity: '', unitPrice: '' }]
    });
  };

  // Remove product row
  const handleRemoveProduct = (idx) => {
    setImportForm({
      ...importForm,
      list: importForm.list.filter((_, i) => i !== idx)
    });
  };

  // Submit import form
  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importForm.supplierId) {
      setMessage('Please select a supplier.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    if (
      importForm.list.some(
        item =>
          !item.productId ||
          !item.quantity ||
          item.quantity <= 0 ||
          !item.unitPrice ||
          item.unitPrice <= 0
      )
    ) {
      setMessage('Please select product and enter valid quantity and unit price.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const payload = {
        supplierId: Number(importForm.supplierId),
        storageId: Number(id),
        list: importForm.list.map(item => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice)
        }))
      };
      const response = await api.post('/api/import/create', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message);
      setShowImportModal(false);
      setImportForm({
        supplierId: '',
        storageId: id,
        list: [{ productId: '', quantity: '', unitPrice: '' }]
      });
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('Failed to create import invoice.');
      setShowImportModal(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-12">
      <div className="w-full max-w-3xl bg-black/70 p-8 rounded-2xl shadow-lg mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Import Invoices</h2>
          <button
            className="px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-800 transition"
            onClick={() => setShowImportModal(true)}
          >
            Create Import Invoice
          </button>
        </div>
        {error && <div className="mb-4 text-red-400">{error}</div>}
        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : imports.length > 0 ? (
          <table className="w-full text-left bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Created By</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Supplier Name</th>
                <th className="py-3 px-4">More</th>
              </tr>
            </thead>
            <tbody>
              {imports.map((imp, idx) => (
                <tr key={imp.id} className="border-t border-gray-700">
                  <td className="py-2 px-4">{idx + 1}</td>
                  <td className="py-2 px-4">{imp.createdBy}</td>
                  <td className="py-2 px-4">{new Date(imp.createdDate).toLocaleString()}</td>
                  <td className="py-2 px-4">{imp.total.toLocaleString('vi-VN')}₫</td>
                  <td className="py-2 px-4">{imp.supplier}</td>
                  <td className="py-2 px-4">
                    <Link
                      to={`/import/detail/${imp.id}`}
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
            No Import Invoices Found
          </div>
        )}
        {message && !error && (
          <div className="mt-4 text-green-400 text-center">{message}</div>
        )}
      </div>

      {/* Import Invoice Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60">
          <form
            onSubmit={handleImportSubmit}
            className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col items-center transition-all duration-200"
          >
            <h3 className="text-xl font-bold mb-6 text-white">Create Import Invoice</h3>
            <div className="mb-4 w-full">
              <label className="block text-gray-300 mb-2" htmlFor="supplierId">
                Supplier
              </label>
              <select
                id="supplierId"
                name="supplierId"
                value={importForm.supplierId}
                onChange={handleImportChange}
                required
                className="w-full px-4 py-3 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 w-full">
              <label className="block text-gray-300 mb-2">Products</label>
              {importForm.list.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <select
                    name="productId"
                    value={item.productId}
                    onChange={e => handleProductChange(idx, 'productId', e.target.value)}
                    required
                    className="flex-1 px-4 py-2 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Select Product</option>
                    {products.map(prod => (
                      <option key={prod.code} value={prod.id || prod.code}>
                        {prod.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    name="quantity"
                    value={item.quantity}
                    onChange={e => handleProductChange(idx, 'quantity', e.target.value)}
                    required
                    placeholder="Quantity"
                    className="w-24 px-4 py-2 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="number"
                    min="1"
                    name="unitPrice"
                    value={item.unitPrice}
                    onChange={e => handleProductChange(idx, 'unitPrice', e.target.value)}
                    required
                    placeholder="Unit Price"
                    className="w-32 px-4 py-2 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  {importForm.list.length > 1 && (
                    <button
                      type="button"
                      className="px-3 py-2 rounded-full bg-red-500 text-white font-bold hover:bg-red-700 transition"
                      onClick={() => handleRemoveProduct(idx)}
                    >
                      &minus;
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="mt-2 px-4 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-700 transition"
                onClick={handleAddProduct}
              >
                + Add Product
              </button>
            </div>
            <div className="flex w-full justify-between mt-6">
              <button
                type="button"
                className="px-6 py-2 rounded-full bg-gray-600 text-white font-semibold mr-2 hover:bg-gray-700 transition"
                onClick={() => setShowImportModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold hover:from-green-600 hover:to-green-800 transition"
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

export default ImportList;