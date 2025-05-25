import React, { useState, useEffect } from "react";
import { FiUser, FiCalendar, FiMapPin } from "react-icons/fi";
import SideBar from "../Components/SideBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateFuneral = () => {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    deceased_name: "",
    date: "",
    location: "",
    funeral_admin_id: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("FuneralToken");
        const res = await axios.get(
          "https://funeral-donation-backend-production.up.railway.app/api/v1/funeral_admins",
          {
            headers: {
              Authorization: `${token}`,
              Accept: "*/*",
            },
          }
        );
        setAdmins(res.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("FuneralToken");
          navigate("/");
        } else {
          console.error("Failed to fetch admins", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("FuneralToken");

    try {
      const response = await axios.post(
        "https://funeral-donation-backend-production.up.railway.app/api/v1/funerals",
        {
          funeral: formData,
        },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Funeral created successfully", response.data);
      navigate("/dashboard"); // change route as needed
    } catch (error) {
      console.error("Error creating funeral:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <SideBar />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Create New Funeral</h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Family Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="deceased_name"
                    value={formData.deceased_name}
                    onChange={handleChange}
                    className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Funeral Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Funeral Administrator
                </label>
                <div className="relative">
                  <select
                    name="funeral_admin_id"
                    value={formData.funeral_admin_id}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Admin</option>
                    {loading ? (
                      <option value="" disabled>
                        Loading...
                      </option>
                    ) : admins.length === 0 ? (
                      <option value="" disabled>
                        No administrators found
                      </option>
                    ) : (
                      admins.map((admin) => (
                        <option key={admin.id} value={admin.id}>
                          {admin.email}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow"
            >
              Create Funeral
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFuneral;
