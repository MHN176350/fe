import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ user, onAddWarehouse, children }) => {
  const location = useLocation();
  const hideSidebar = ['/', '/signup'].includes(location.pathname);

  return (
    <div
      className="min-h-screen text-white flex relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1638132035918-90a22beaab3b?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {!hideSidebar && <Sidebar user={user} onAddWarehouse={onAddWarehouse} />}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Layout;