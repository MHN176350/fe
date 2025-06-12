import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import reactLogo from '../../assets/react.svg';

// Heroicons
import {
  HomeIcon,
  FolderOpenIcon,
  CubeIcon,
  ShoppingCartIcon,
  UserIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <HomeIcon className="w-6 h-6" /> },
   { to: '/warehouses', label: 'Users', icon: <ArrowDownIcon className="w-6 h-6" /> },
  { to: '/categories', label: 'Categories', icon: <FolderOpenIcon className="w-6 h-6" /> },
  { to: '/products', label: 'Products', icon: <CubeIcon className="w-6 h-6" /> },
  { to: '/customers', label: 'Orders', icon: <ShoppingCartIcon className="w-6 h-6" /> },
  { to: '/suppliers', label: 'Settings', icon: <Cog6ToothIcon className="w-6 h-6" /> },
  { to: '/help', label: 'Help', icon: <QuestionMarkCircleIcon className="w-6 h-6" /> },
];

const Sidebar = ({ user }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  if (
    location.pathname === '/login' ||
    location.pathname === '/register'
  ) {
    return null;
  }

  const handleLogout = () => {
    // Clear all tokens and cache
    localStorage.clear();
    sessionStorage.clear();
    if ('caches' in window) {
      caches.keys().then(names => names.forEach(name => caches.delete(name)));
    }
    navigate('/login');
  };

  return (
    <aside
      className={`transition-all duration-700 z-50
        ${expanded ? 'w-48' : 'w-20'}
      bg-white flex flex-col items-center py-6 shadow-lg min-h-screen fixed left-0 top-0 h-full`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{ minWidth: expanded ? 192 : 80 }}
    >
      <img
        src={user && user.avatar === 'def' ? reactLogo : user?.avatar}
        alt="avatar"
        className="w-10 h-10 rounded-full border-2 border-gray-400 bg-white object-cover mb-6"
      />
      <nav className="flex flex-col gap-2 mt-4 w-full">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isActive ? 'bg-black text-white font-bold shadow' : 'text-black hover:bg-gray-700 hover:text-white'}
              ${expanded ? 'justify-start' : 'justify-center'}`
            }
            title={item.label}
          >
            {item.icon}
            {expanded && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className={`mt-auto mb-4 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold shadow hover:from-gray-500 hover:to-gray-700 transition w-4/5 ${expanded ? 'flex justify-center' : 'mx-auto'}`}
        title="Logout"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;