import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";
import SideBar from "../Components/SideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [editFormData, setEditFormData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("FuneralToken");
        if (!token) {
          navigate("/");
          return;
        }
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
      } catch (error) {
        console.error(
          "Failed to fetch admins:",
          error.response?.data || error.message
        );
        if (error.response?.status === 401) {
          localStorage.removeItem("FuneralToken");
          navigate("/");
        } else {
          setError("Failed to load admins. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [navigate]);

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setEditFormData({
      email: admin.email,
      password: "",
      password_confirmation: "",
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedAdmin(null);
    setEditFormData({
      email: "",
      password: "",
      password_confirmation: "",
    });
  };

  const handleEditInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (editFormData.password !== editFormData.password_confirmation) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("FuneralToken");

    try {
      await axios.patch(
        `https://funeral-donation-backend-production.up.railway.app/api/v1/funeral_admins/${selectedAdmin.id}`,
        {
          funeral_admin: {
            email: editFormData.email,
            password: editFormData.password || undefined,
            password_confirmation: editFormData.password_confirmation || undefined,
          },
        },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAdmins(
        admins.map((admin) =>
          admin.id === selectedAdmin.id
            ? { ...admin, email: editFormData.email }
            : admin
        )
      );
      closeEditModal();
    } catch (error) {
      console.error("Error updating admin:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to update admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedAdmin(null);
  };

  const handleDelete = async () => {
    setError(null);
    setLoading(true);

    const token = localStorage.getItem("FuneralToken");

    try {
      await axios.delete(
        `https://funeral-donation-backend-production.up.railway.app/api/v1/funeral_admins/${selectedAdmin.id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setAdmins(admins.filter((admin) => admin.id !== selectedAdmin.id));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting admin:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to delete admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <SideBar />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold mb-6">Manage Funeral Admins</h2>
            <button
              onClick={() => navigate("/create-funeral-admin")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow"
            >
              + Create Funeral Admin
            </button>
          </div>
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          {loading ? (
            <p className="text-gray-500">Loading admins...</p>
          ) : admins.length === 0 ? (
            <p className="text-gray-500">No admins found.</p>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {admins.map((admin) => (
                      <tr key={admin.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {admin.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(admin.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditModal(admin)}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Edit"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => openDeleteModal(admin)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FiTrash2 />
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

        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg overflow-hidden max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Edit Admin</h3>
                  <button
                    onClick={closeEditModal}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password (leave blank to keep unchanged)
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={editFormData.password}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="password_confirmation"
                      value={editFormData.password_confirmation}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {error && (
                    <div className="p-2 bg-red-100 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Admin"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg overflow-hidden max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Confirm Deletion
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete the admin{" "}
                  <span className="font-medium">{selectedAdmin.email}</span>? This action cannot be undone.
                </p>
                {error && (
                  <div className="p-2 bg-red-100 text-red-700 rounded mb-4">
                    {error}
                  </div>
                )}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeDeleteModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAdmins;