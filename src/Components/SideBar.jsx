import React from 'react';
import {
  FiHome,
  FiPlusCircle,
  FiUsers,
  FiDollarSign,
  FiLogOut
} from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

const SideBar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Funeral Donations</h1>
          <p className="text-sm text-gray-400">Super Admin Portal</p>
        </div>
        <nav className="mt-4">
          <Link
            to="/dashboard"
            className={`flex items-center w-full p-3 ${
              isActive('/dashboard') ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <FiHome className="mr-2" /> Dashboard
          </Link>
          <Link
            to="/create-funeral"
            className={`flex items-center w-full p-3 ${
              isActive('/create-funeral') ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <FiPlusCircle className="mr-2" /> Create Funeral
          </Link>
          <Link
            to="/manage-funerals"
            className={`flex items-center w-full p-3 ${
              isActive('/manage-funerals') ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <FiUsers className="mr-2" /> Manage Funerals
          </Link>
          <Link
            to="/donations"
            className={`flex items-center w-full p-3 ${
              isActive('/donations') ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <FiDollarSign className="mr-2" /> Donations
          </Link>
          <button
            className="flex items-center w-full p-3 hover:bg-gray-700 mt-4"
            onClick={() => {
              localStorage.removeItem('FuneralToken');
              window.location.href = '/';
            }}
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
