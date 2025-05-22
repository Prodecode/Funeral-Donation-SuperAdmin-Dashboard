import React, { useState } from 'react';
import { FiHome, FiPlusCircle, FiUsers, FiDollarSign, FiSettings, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router';

const SideBar = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Funeral Donations</h1>
          <p className="text-sm text-gray-400">Super Admin Portal</p>
        </div>
        <nav className="mt-4">
          <Link to={"/dashboard"}
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full p-3 ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <FiHome className="mr-2" /> Dashboard
          </Link>
          <Link to={"/create-funeral"}
            onClick={() => setActiveTab('create')}
            className={`flex items-center w-full p-3 ${activeTab === 'create' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <FiPlusCircle className="mr-2" /> Create Funeral
          </Link>
          <Link to={"/manage-funerals"}
            onClick={() => setActiveTab('manage')}
            className={`flex items-center w-full p-3 ${activeTab === 'manage' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <FiUsers className="mr-2" /> Manage Funerals
          </Link>
          <Link to={"/donations"}
            onClick={() => setActiveTab('donations')}
            className={`flex items-center w-full p-3 ${activeTab === 'donations' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            <FiDollarSign className="mr-2" /> Donations
          </Link>
          <button
            className="flex items-center w-full p-3 hover:bg-gray-700 mt-4"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </nav>
      </div>
    </div>
  )
}

export default SideBar