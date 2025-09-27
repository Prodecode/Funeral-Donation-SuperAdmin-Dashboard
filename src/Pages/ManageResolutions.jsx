import React, { useEffect, useState } from "react";
import {
  FiEdit,
} from "react-icons/fi";
import SideBar from "../Components/SideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageResolutions = () => {
  const navigate = useNavigate();
  const [funerals, setFunerals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFunerals();
  }, []);

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
      console.error(
        "Failed to fetch funerals:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        localStorage.removeItem("FuneralToken");
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleView = (a) => {
    navigate("/edit-donations/" + a);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <SideBar />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold mb-6">Manage Flagged</h2>
          </div>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {funerals.map((funeral) => (
                      <tr key={funeral.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {funeral.deceased_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(funeral.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {funeral.location}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleView(funeral.id)}
                              className="text-yellow-600 hover:text-yellow-900 transition duration-200"
                              title="Edit"
                            >
                              <FiEdit size={18} className="cursor-pointer" />
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

export default ManageResolutions;
