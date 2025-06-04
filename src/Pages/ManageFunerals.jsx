import React, { useEffect, useState } from "react";
import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiDollarSign,
  FiX,
  FiPlus,
} from "react-icons/fi";
import SideBar from "../Components/SideBar";
import axios from "axios";
import Modal from "../Components/Modal";
import { useNavigate } from "react-router-dom";

const ManageFunerals = () => {
  const navigate = useNavigate();
  const [funerals, setFunerals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFuneral, setSelectedFuneral] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for create/edit
  const [formData, setFormData] = useState({
    deceased_name: "",
    date: "",
    location: "",
    description: "",
    target_amount: "",
    status: "active",
  });

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

  const resetForm = () => {
    setFormData({
      deceased_name: "",
      date: "",
      location: "",
      description: "",
      target_amount: "",
      status: "active",
    });
  };

  const handleView = (a) => {
    navigate("/view-funeral/" + a);
  };

  const handleEdit = (a) => {
    navigate("/edit-funeral/" + a);
  };

  const handleCreate = () => {
    navigate("/create-funeral");
  };

  const handleDeleteClick = (funeral) => {
    setSelectedFuneral(funeral);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedFuneral) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("FuneralToken");
      await axios.delete(
        `https://funeral-donation-backend-production.up.railway.app/api/v1/funerals/${selectedFuneral.id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      await fetchFunerals();
      closeDeleteModal();
    } catch (error) {
      console.error(
        "Failed to delete funeral:",
        error.response?.data || error.message
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Close modal functions
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedFuneral(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedFuneral(null);
    resetForm();
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <SideBar />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold mb-6">Manage Funerals</h2>
            <button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow transition duration-200 flex items-center gap-2"
            >
              <FiPlus size={16} />
              Create Funeral
            </button>
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
                        Status
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              funeral.status === "active"
                                ? "bg-green-100 text-green-800"
                                : funeral.status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {funeral.status || "active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleView(funeral.id)}
                              className="text-blue-600 hover:text-blue-900 transition duration-200"
                              title="View"
                            >
                              <FiEye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(funeral.id)}
                              className="text-yellow-600 hover:text-yellow-900 transition duration-200"
                              title="Edit"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(funeral)}
                              className="text-red-600 hover:text-red-900 transition duration-200"
                              title="Delete"
                            >
                              <FiTrash2 size={18} />
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

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={closeDeleteModal}>
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Delete Funeral
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
              <button
                onClick={closeDeleteModal}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete the funeral for{" "}
                <span className="font-semibold text-gray-900">
                  {selectedFuneral?.deceased_name}
                </span>
                ?
              </p>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageFunerals;
