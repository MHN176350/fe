import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/apis';

const WarehouseDetail = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Import form state
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [importForm, setImportForm] = useState({
    supplierId: '',
    storageId: id,
    list: [{ productId: '', quantity: '' }]
  });

  // Export form state
  const [customers, setCustomers] = useState([]);
  const [exportForm, setExportForm] = useState({
    storageId: id,
    custId: '',
    usePoint: false,
    items: [{ itemId: '', quantity: '', unitPrice: '' }]
  });

  const [sortAsc, setSortAsc] = useState(true);

  // Fetch warehouse items
  const fetchItems = async () => {
    try {
      const response = await api.get(`/api/item/storage/${id}`);
      if (response.data.statusCode === 200) {
        setItems(response.data.data || []);
        setMessage(response.data.message);
      } else {
        setError(response.data.message || 'Failed to fetch items.');
      }
    } catch (err) {
      setError('Failed to fetch items.');
    }
  };

  useEffect(() => {
    fetchItems();
  }, [id]);

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

  // Fetch customers for export form
  useEffect(() => {
    if (showExportModal) {
      api.get('/api/cust/getall').then(res => {
        if (res.data.statusCode === 200) setCustomers(res.data.data || []);
      });
    }
  }, [showExportModal]);

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
      list: [...importForm.list, { productId: '', quantity: '' }]
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
      fetchItems();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('Failed to create import invoice.');
      setShowImportModal(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  // Export form handlers
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

  // Sort by product name
  const handleSortByProductName = () => {
    setSortAsc(!sortAsc);
    setItems(prev =>
      [...prev].sort((a, b) =>
        sortAsc
          ? a.productName.localeCompare(b.productName)
          : b.productName.localeCompare(a.productName)
      )
    );
  };

  // Submit export form (updated to include storageId)
  const handleExportSubmit = async (e) => {
    e.preventDefault();
    if (!exportForm.custId) {
      setMessage('Please select a customer.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    if (exportForm.items.some(item => !item.itemId || !item.quantity || item.quantity <= 0 || !item.unitPrice || item.unitPrice <= 0)) {
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
      const response = await api.post('/api/export/create', payload, {
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
      fetchItems();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('Failed to create export invoice.');
      setShowExportModal(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-screen pt-12">
      <div className="w-full max-w-5xl bg-gray-800 p-8 rounded-2xl shadow-lg mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Warehouse Detail</h2>
          <div className="flex gap-4">
            <button
              className="px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-800 transition"
              onClick={() => setShowImportModal(true)}
            >
              Create Import Invoice
            </button>
            <button
              className="px-6 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-800 transition"
              onClick={() => setShowExportModal(true)}
            >
              Create Export Invoice
            </button>
          </div>
        </div>
        {error && (
          <div className="mb-4 text-red-400 text-center">{error}</div>
        )}
        {items.length > 0 ? (
          <table className="w-full text-left bg-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="py-3 px-4">#</th>
                <th
                  className="py-3 px-4 cursor-pointer select-none"
                  onClick={handleSortByProductName}
                >
                  Product Name
                  <span className="ml-1">{sortAsc ? '▲' : '▼'}</span>
                </th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Updated</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.productName + idx} className="border-t border-gray-600">
                  <td className="py-2 px-4">{idx + 1}</td>
                  <td className="py-2 px-4">{item.productName}</td>
                  <td className="py-2 px-4">
                    {item.productImage && item.productImage !== 'nun' ? (
                      <img src={item.productImage} alt={item.productName} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400 italic">No Image</span>
                    )}
                  </td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">{item.price?.toLocaleString('vi-VN')}₫</td>
                  <td className="py-2 px-4">{item.totalAmount}</td>
                  <td className="py-2 px-4">{item.createdAt}</td>
                  <td className="py-2 px-4">{item.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !error && (
            <div className="text-4xl text-white/30 font-extrabold text-right w-full select-none pointer-events-none">
              No Items Found
            </div>
          )
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
                className="px-6 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold hover:from-red-600 hover:to-red-800 transition"
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

export default WarehouseDetail;