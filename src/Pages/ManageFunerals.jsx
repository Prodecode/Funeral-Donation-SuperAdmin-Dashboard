import React from 'react';
import { FiEdit, FiTrash2, FiEye, FiDollarSign } from 'react-icons/fi';
import SideBar from '../Components/SideBar';

const ManageFunerals = () => {
  const funerals = [
    {
      id: 1,
      name: "John Doe",
      date: "2023-06-15",
      location: "St. Mary's Church",
      target: 5000,
      raised: 3200,
      status: "active"
    },
    {
      id: 2,
      name: "Jane Smith",
      date: "2023-06-20",
      location: "Community Chapel",
      target: 3000,
      raised: 1800,
      status: "active"
    },
    {
      id: 3,
      name: "Robert Johnson",
      date: "2023-05-30",
      location: "Memorial Gardens",
      target: 4000,
      raised: 4200,
      status: "completed"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <SideBar />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Funerals</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raised</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {funerals.map((funeral) => (
                <tr key={funeral.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{funeral.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{funeral.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{funeral.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${funeral.target}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${funeral.raised}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${funeral.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {funeral.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <FiEye />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900">
                        <FiEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <FiTrash2 />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <FiDollarSign />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default ManageFunerals;