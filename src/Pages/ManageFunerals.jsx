import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiEye, FiDollarSign } from "react-icons/fi";
import SideBar from "../Components/SideBar";
import axios from "axios";

const ManageFunerals = () => {
  const [funerals, setFunerals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFunerals = async () => {
      try {
        const token = localStorage.getItem("FuneralToken");
        const res = await axios.get(
          "https://funeral-donation-backend-production.up.railway.app/api/v1/funerals",
          {
            headers: {
              Authorization: `${token}`,
              Accept: "*/*",
            },
          }
        );
        setFunerals(res.data);
      } catch (error) {
        console.error("Failed to fetch funerals:", error.response?.data || error.message);
        if (error.response?.status === 401) {
          localStorage.removeItem("FuneralToken");
          window.location.href = "/";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFunerals();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <SideBar />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Manage Funerals</h2>

          {loading ? (
            <p className="text-gray-500">Loading funerals...</p>
          ) : funerals.length === 0 ? (
            <p className="text-gray-500">No funerals found.</p>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {funerals.map((funeral) => (
                      <tr key={funeral.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{funeral.deceased_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{funeral.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{funeral.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900" title="View">
                              <FiEye />
                            </button>
                            <button className="text-yellow-600 hover:text-yellow-900" title="Edit">
                              <FiEdit />
                            </button>
                            <button className="text-red-600 hover:text-red-900" title="Delete">
                              <FiTrash2 />
                            </button>
                            <button className="text-green-600 hover:text-green-900" title="Donate">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageFunerals;
