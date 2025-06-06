import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ user, onAddWarehouse, children }) => {
  const location = useLocation();
  const hideSidebar = ['/', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-amber-100 text-white flex relative">
      {!hideSidebar && <Sidebar user={user} onAddWarehouse={onAddWarehouse} />}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Layout;