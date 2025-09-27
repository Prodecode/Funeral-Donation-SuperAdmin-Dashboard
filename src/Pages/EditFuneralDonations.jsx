import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import SideBar from "../Components/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ViewFuneralDetail = () => {
  const [loading, setLoading] = useState(true);
  const [funeral, setFuneral] = useState({
    deceased_name: "",
    date: "",
    location: "",
    total_donated: 0,
  });
  const [funId, setFunId] = useState("");
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [editForm, setEditForm] = useState({
    donor_name: "",
    amount: "",
    mode_of_payment: "",
    donating_in_name_of: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("FuneralToken");
        if (!token) {
          navigate("/");
          return;
        }

        const funeralRes = await axios.get(
          `https://funeral-donation-backend-production.up.railway.app/api/v1/funerals/${id}`,
          {
            headers: {
              Authorization: `${token}`,
              Accept: "*/*",
            },
          }
        );

        const funeralData = funeralRes.data;
        const funeralId = funeralData.funeral_id;
        setFunId(funeralId)
        const formattedDate = funeralData.date
          ? new Date(funeralData.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Not specified";

        const donationsRes = await axios.get(
          `https://funeral-donation-backend-production.up.railway.app/api/v1/funerals/${funeralId}/donations`,
          {
            headers: {
              Authorization: `${token}`,
              Accept: "*/*",
            },
          }
        );

        const donationsData = donationsRes.data || [];
        // Filter flagged and resolved donations
        const filteredDonations = donationsData.filter(
          (donation) => donation.flagged || donation.flag_reason != null
        );
        setDonations(filteredDonations);

        const total = filteredDonations.reduce((sum, donation) => {
          return sum + parseFloat(donation.amount || 0);
        }, 0);

        setFuneral({
          deceased_name: funeralData.deceased_name || "Not specified",
          date: formattedDate,
          location: funeralData.location || "Not specified",
          total_donated: total,
        });
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("FuneralToken");
          navigate("/");
        } else {
          console.error("Error fetching data:", err);
          setError(
            "Failed to load funeral details or donations. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const openEditModal = (donation) => {
    setSelectedDonation(donation);
    setEditForm({
      donor_name: donation.donor_name || "",
      amount: donation.amount || "",
      mode_of_payment: donation.mode_of_payment || "",
      donating_in_name_of: donation.donating_in_name_of || "",
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (donation) => {
    setSelectedDonation(donation);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedDonation(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("FuneralToken");
      await axios.patch(
        `https://funeral-donation-backend-production.up.railway.app/api/v1/funerals/${funId}/donations/${selectedDonation.id}`,
        editForm,
        {
          headers: {
            Authorization: `${token}`,
            Accept: "*/*",
          },
        }
      );
      setDonations(
        donations.map((d) =>
          d.id === selectedDonation.id ? { ...d, ...editForm } : d
        )
      );
      closeModal();
    } catch (err) {
      setError("Failed to update donation. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("FuneralToken");
      await axios.delete(
        `https://funeral-donation-backend-production.up.railway.app/api/v1/donations/${selectedDonation.id}`,
        {
          headers: {
            Authorization: `${token}`,
            Accept: "*/*",
          },
        }
      );
      setDonations(donations.filter((d) => d.id !== selectedDonation.id));
      closeModal();
    } catch (err) {
      setError("Failed to delete donation. Please try again.");
    }
  };

  return (
    <div className="flex max-h-screen bg-gray-50">
      <SideBar />
      <div className="flex-1 p-6 md:p-8">
        <div className="mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Funeral Details</h1>
            <p className="text-gray-600 mt-2">
              View flagged and resolved donations for this funeral
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Flagged and Resolved Donation Records
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {donations.length} donation
                    {donations.length !== 1 ? "s" : ""} recorded
                  </p>
                </div>

                {donations.length === 0 ? (
                  <div className="p-12 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No flagged or resolved donations
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No flagged or resolved donations have been recorded for this funeral.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Donor
                          </th>
                          <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            In Name Of
                          </th>
                          <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {donations.map((donation) => (
                          <tr key={donation.id} className="hover:bg-gray-50">
                            <td className="px-2 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {donation.donor_name || "Anonymous"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {donation.donor_phone_number || "No phone"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                GHC {parseFloat(donation.amount || "0").toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {donation.mode_of_payment || "Not specified"}
                              </div>
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {donation.created_at
                                  ? new Date(donation.created_at).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "Unknown"}
                              </div>
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                              {donation.donating_in_name_of || "Not specified"}
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  donation.flagged
                                    ? "bg-red-100 text-red-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {donation.flagged ? "Flagged" : "Resolved"}
                              </span>
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap text-right text-sm font-medium">
                              
                                  <button
                                    onClick={() => openEditModal(donation)}
                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                  >
                                    <FiEdit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => openDeleteModal(donation)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <FiTrash2 className="h-4 w-4" />
                                  </button>
                              
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Edit Modal */}
              {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Edit Donation</h2>
                    <form onSubmit={handleEditSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Donor Name</label>
                        <input
                          type="text"
                          value={editForm.donor_name}
                          onChange={(e) => setEditForm({ ...editForm, donor_name: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Amount (GHC)</label>
                        <input
                          type="number"
                          value={editForm.amount}
                          onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Mode of Payment</label>
                        <input
                          type="text"
                          value={editForm.mode_of_payment}
                          onChange={(e) => setEditForm({ ...editForm, mode_of_payment: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">In Name Of</label>
                        <input
                          type="text"
                          value={editForm.donating_in_name_of}
                          onChange={(e) => setEditForm({ ...editForm, donating_in_name_of: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Delete Donation</h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Are you sure you want to delete this donation from{" "}
                      {selectedDonation?.donor_name || "Anonymous"}? This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewFuneralDetail;