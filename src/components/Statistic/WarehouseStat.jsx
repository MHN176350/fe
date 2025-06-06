import React, { useEffect, useState } from 'react';
import api from '../../api/apis';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#8dd1e1',
  '#a4de6c',
  '#d0ed57',
  '#d8854f',
];

const WarehouseStat = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [warehouseDetail, setWarehouseDetail] = useState(null);
  const [categoryRevenue, setCategoryRevenue] = useState([]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await api.get('/api/warehouse/getall');
        if (res.data.statusCode === 200) {
          setWarehouses(res.data.data || []);
        } else {
          setError(res.data.message || 'Failed to fetch warehouses.');
        }
      } catch (err) {
        setError('Failed to fetch warehouses.');
      } finally {
        setLoading(false);
      }
    };
    fetchWarehouses();
  }, []);

  // Fetch warehouse detail (pie chart)
  useEffect(() => {
    const fetchWarehouseDetail = async () => {
      if (!selectedWarehouse) return;
      try {
        const res = await api.get(`/api/stat/pie/${selectedWarehouse.id}`);
        if (res.data.statusCode === 200) {
          setWarehouseDetail(res.data.data || []);  
        } else {
          setWarehouseDetail([]);
        }
      } catch {
        setWarehouseDetail([]);
      }
    };
    fetchWarehouseDetail();
  }, [selectedWarehouse]);
  useEffect(() => {
    const fetchCategoryRevenue = async () => {
      if (!selectedWarehouse) {
        setCategoryRevenue([]);
        return;
      }
      try {
        const res = await api.get(`/api/stat/category-revenue?warehouseId=${selectedWarehouse.id}`);
        if (res.data.statusCode === 200) {
          setCategoryRevenue(res.data.data || []);
        } else {
          setCategoryRevenue([]);
        }
      } catch {
        setCategoryRevenue([]);
      }
    };
    fetchCategoryRevenue();
  }, [selectedWarehouse]);
  const barData = warehouses.map((w) => ({
    name: w.code,
    itemCount: w.itemCount,
  }));

  const pieData =
    warehouseDetail && warehouseDetail.length
      ? warehouseDetail.map((item) => ({
          name: item.productName,
          value: item.quantity,
        }))
      : [];

  return (
    <div className="flex flex-col items-center min-h-screen pt-12">
      <div className="w-full max-w-5xl bg-black/70 p-8 rounded-2xl shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Warehouse Statistics</h2>
        {error && <div className="mb-4 text-red-400">{error}</div>}
        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : (
          <>
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-white mb-2">Total Items per Warehouse</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip />
                  <Bar dataKey="itemCount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-white mb-2">Select a Warehouse</h3>
              <select
                className="px-4 py-2 rounded bg-gray-800 text-white mb-4"
                value={selectedWarehouse?.id || ''}
                onChange={(e) => {
                  const wh = warehouses.find((w) => w.id === Number(e.target.value));
                  setSelectedWarehouse(wh);
                }}
              >
                <option value="">-- Select --</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.code} - {w.location}
                  </option>
                ))}
              </select>
              {selectedWarehouse && (
                <div className="bg-gray-900 rounded-xl p-6 mt-2 text-white">
                  <div className="mb-4">
                    <span className="font-bold">Code:</span> {selectedWarehouse.code}
                  </div>
                  <div className="mb-4">
                    <span className="font-bold">Location:</span> {selectedWarehouse.location}
                  </div>
                  <div className="mb-4">
                    <span className="font-bold">Owner:</span> {selectedWarehouse.ownerName}
                  </div>
                  <div className="mb-4">
                    <span className="font-bold">Item in Stock:</span> {selectedWarehouse.itemCount}
                  </div>
                  <div className="mb-4">
                    <span className="font-bold">Created:</span> {selectedWarehouse.createdDate}
                  </div>
                  <div className="mb-4">
                    <span className="font-bold">Updated:</span> {selectedWarehouse.updatedDate}
                  </div>
                  <h4 className="font-semibold mt-6 mb-2">Product Distribution & Revenue by Category</h4>
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Pie Chart */}
                    <div className="flex-1 min-w-[250px]">
                      {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={pieData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label
                            >
                              {pieData.map((entry, idx) => (
                                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                              ))}
                            </Pie>
                            <Legend />
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-gray-400">No product data for this warehouse.</div>
                      )}
                    </div>
                    {/* Revenue by Category Chart */}
                    <div className="flex-1 min-w-[250px]">
                      <h5 className="font-semibold mb-2 text-white">Revenue by Category</h5>
                      {categoryRevenue.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={categoryRevenue}>
                            <XAxis dataKey="category" stroke="#fff" />
                            <YAxis stroke="#fff" />
                            <Tooltip formatter={(v) => v.toLocaleString()} />
                            <Bar dataKey="revenue" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-gray-400">No revenue data available.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WarehouseStat;