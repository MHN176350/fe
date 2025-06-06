import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/SignUp';
import Layout from './components/Layout/Layout';
import Categories from './components/Categories/Categories';
import Products from './components/Products/ProductList';
import Warehouse from './components/WarehouseDetail/WarehouseDetail';
import Suppliers from './components/Supplier/Supplier';
import Customers from './components/CustomerList/CustList';
import WarehouseStat from './components/Statistic/WarehouseStat';
import ImportList from './components/Import/ImportList';
import ExportList from './components/Export/ExportList';


function App() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // On app load, check localStorage for user
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
  <Route path='/import/:id' element={<ImportList user={user} />} />
 <Route path='/statistic' element={<WarehouseStat user={user} />} />
  <Route path="/warehouse/:id" element={<Warehouse user={user} />} />
  <Route path="/warehouse" element={<Dashboard user={user} showModal={showModal} setShowModal={setShowModal} />} />
  <Route path="/products" element={<Products user={user} />} />
  <Route path="/customers" element={<Customers user={user} />} />
  <Route path="/suppliers" element={<Suppliers user={user} />} />
  <Route path="/categories" element={<Categories user={user} />} />
  <Route path="/dashboard" element={<Dashboard user={user} showModal={showModal} setShowModal={setShowModal} />} />
  <Route path="/signup" element={<Register />} />
  <Route path="/login" element={<Login setUser={setUser} />} />
  <Route path="/" element={<Login setUser={setUser} />} />
  
</Routes>
      </Layout>
    </Router>
  );
}

export default App;