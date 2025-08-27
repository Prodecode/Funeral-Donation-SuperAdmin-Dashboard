import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiCalendar,
  FiMapPin,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";
import SideBar from "../Components/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditFuneral = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    deceased_name: "",
    date: "",
    location: "",
    funeral_admin_id: "",
    allow_recipient_sms: false,
  });

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
          allow_recipient_sms: funeralData.allow_recipient_sms || false,
        });
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("FuneralToken");
          navigate("/");
        } else {
          console.error("Error fetching data:", err);
          setErrors(["Failed to load funeral or admins. Please try again."]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (errors.length > 0) {
      setErrors([]);
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Toggle handler specifically for the checkbox
  const handleToggle = () => {
    setFormData({
      ...formData,
      allow_recipient_sms: !formData.allow_recipient_sms,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors([]);

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

      // console.log("Funeral updated successfully", response.data);
      navigate("/manage-funerals");
    } catch (error) {
      console.error(
        "Error updating funeral:",
        error.response?.data || error.message
      );

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors(["An unexpected error occurred. Please try again."]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const closeErrorAlert = () => {
    setErrors([]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <SideBar />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Funeral</h2>

          {errors.length > 0 && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md relative">
              <button
                onClick={closeErrorAlert}
                className="absolute top-3 right-3 text-red-600 hover:text-red-800"
              >
                <FiXCircle size={18} />
              </button>
              <div className="flex items-start">
                <FiAlertCircle
                  className="text-red-500 mt-1 mr-3 flex-shrink-0"
                  size={20}
                />
                <div>
                  <h3 className="text-red-800 font-medium mb-1">
                    Please fix the following errors:
                  </h3>
                  <ul className="text-red-700 list-disc pl-5">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
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
                      className={`pl-10 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                        errors.some((e) =>
                          e.toLowerCase().includes("deceased name")
                        )
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                      disabled={submitting}
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
                      className={`pl-10 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                        errors.some((e) => e.toLowerCase().includes("date"))
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                      disabled={submitting}
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
                      className={`pl-10 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                        errors.some((e) => e.toLowerCase().includes("location"))
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                      disabled={submitting}
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
                      className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                        errors.some(
                          (e) =>
                            e.toLowerCase().includes("admin") ||
                            e.toLowerCase().includes("funeral admin")
                        )
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                      disabled={submitting}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allow Recipient SMS
                  </label>
                  <div className="relative flex items-center">
                    <button
                      type="button"
                      onClick={handleToggle}
                      disabled={submitting}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out ${
                        formData.allow_recipient_sms
                          ? "bg-gray-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${
                          formData.allow_recipient_sms
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className="ml-3 text-sm text-gray-600">
                      {formData.allow_recipient_sms ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    When enabled, recipients will receive SMS notifications
                    about the funeral donations immediately detailing how much
                    has been donated in their name.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded shadow flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Funeral"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditFuneral;
