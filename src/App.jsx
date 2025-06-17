import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/SignUp';
import Layout from './components/Layout/Layout';
import Categories from './components/Categories/Categories';
import Products from './components/Products/ProductList';
import WarehouseDetail from './components/Warehouse/WarehouseDetail';
import Suppliers from './components/Supplier/Supplier';
import Customers from './components/CustomerList/CustList';
import WarehouseStat from './components/Statistic/WarehouseStat';
import ImportList from './components/Import/ImportList';
import ExportList from './components/Export/ExportList';
import Dashboard from './components/Dashboard/Dashboard';
import ExportDetail from './components/Export/ExportDetail';
import ImportDetail from './components/Import/ImportDetail';
import WarehouseList from './components/Warehouse/WarehouseList';
import UserProfile from './components/User/UserProfile';
import UserManagement from './components/User/UserManagement';
import WarehouseMemberManage from './components/Warehouse/WarehouseMemberManage';

function App() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <Router>
      <Layout user={user} onAddWarehouse={() => setShowModal(true)}>
<Routes>
  <Route path='/export/:id' element={<ExportList user={user} />} />
  <Route path='/export/detail/:id' element={<ExportDetail user={user} />} />
  <Route path='/import/detail/:id' element={<ImportDetail user={user} />} />
  <Route path='/import/:id' element={<ImportList user={user} />} />
  <Route path='/statistic' element={<WarehouseStat user={user} />} />
  <Route path="/products" element={<Products user={user} />} />
  <Route path="/customers" element={<Customers user={user} />} />
  <Route path="/suppliers" element={<Suppliers user={user} />} />
  <Route path="/categories" element={<Categories user={user} />} />
  <Route path="/signup" element={<Register />} />
  <Route path="/login" element={<Login setUser={setUser} />} />
  <Route path="/dashboard" element={<Dashboard user={user} showModal={showModal} setShowModal={setShowModal} />} />
  <Route path="/" element={<Login setUser={setUser} />} />
  <Route path="/warehouses" element={<WarehouseList user={user} showModal={showModal} setShowModal={setShowModal} />} />
  <Route path="/warehouse/:id" element={<WarehouseDetail user={user} />} />
  <Route path="/profile" element={<UserProfile user={user} />} />
  <Route path="/users" element={<UserManagement user={user} />} />
  <Route path="/storage-member" element={<WarehouseMemberManage user={user} />} />
  
  {/* Catch-all route for 404 */}
  <Route path="*" element={<div>404 Not Found</div>} />
  
</Routes>
      </Layout>
    </Router>
  );
}
  
export default App;