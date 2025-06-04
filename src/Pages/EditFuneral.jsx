import React, { useState, useEffect } from "react";
import { FiUser, FiCalendar, FiMapPin } from "react-icons/fi";
import SideBar from "../Components/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditFuneral = () => {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    deceased_name: "",
    date: "",
    location: "",
    funeral_admin_id: "",
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams(); // Get the funeral ID from the URL

  // Fetch funeral admins and funeral details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("FuneralToken");
        if (!token) {
          navigate("/");
          return;
        }

        // Fetch funeral admins
        const adminsRes = await axios.get(
          "https://funeral-donation-backend-production.up.railway.app/api/v1/funeral_admins",
          {
            headers: {
              Authorization: `${token}`,
              Accept: "*/*",
            },
          }
        );
        setAdmins(adminsRes.data);

        // Fetch funeral details
        const funeralRes = await axios.get(
          `https://funeral-donation-backend-production.up.railway.app/api/v1/funerals/${id}`,
          {
            headers: {
              Authorization: `${token}`,
              Accept: "*/*",
            },
          }
        );

        // Format date to YYYY-MM-DD for the date input
        const funeralData = funeralRes.data;
        const formattedDate = funeralData.date
          ? new Date(funeralData.date).toISOString().split("T")[0]
          : "";

        setFormData({
          deceased_name: funeralData.deceased_name || "",
          date: formattedDate,
          location: funeralData.location || "",
          funeral_admin_id: funeralData.funeral_admin_id || "",
        });
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("FuneralToken");
          navigate("/");
        } else {
          console.error("Error fetching data:", err);
          setError("Failed to load funeral or admins. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("FuneralToken");

    try {
      const response = await axios.patch(
        `https://funeral-donation-backend-production.up.railway.app/api/v1/funerals/${id}`,
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

      console.log("Funeral updated successfully", response.data);
      navigate("/manage-funerals");
    } catch (error) {
      console.error("Error updating funeral:", error.response?.data || error.message);
      setError("Failed to update funeral. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <SideBar />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Funeral</h2>
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
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
                      {admins.length === 0 ? (
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
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Funeral"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditFuneral;