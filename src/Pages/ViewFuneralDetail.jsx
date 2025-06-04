import React, { useState, useEffect } from "react";
import { FiUser, FiCalendar, FiMapPin, FiDollarSign, FiFlag } from "react-icons/fi";
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
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null);
  const [selectedFlagReason, setSelectedFlagReason] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

        const formattedDate = funeralData.date
          ? new Date(funeralData.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Not specified";

        // Fetch donations for this funeral to calculate total
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
        setDonations(donationsData);
        
        const total = donationsData.reduce((sum, donation) => {
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
          setError("Failed to load funeral details or donations. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const openModal = (flagReason) => {
    setSelectedFlagReason(flagReason);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFlagReason(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      
      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Funeral Details</h1>
            <p className="text-gray-600 mt-2">View all details and donations for this funeral</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                      <FiUser className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Deceased Name</p>
                      <p className="text-lg font-semibold text-gray-900">{funeral.deceased_name}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-50 text-green-600">
                      <FiCalendar className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Funeral Date</p>
                      <p className="text-lg font-semibold text-gray-900">{funeral.date}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                      <FiMapPin className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-lg font-semibold text-gray-900">{funeral.location}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
                      <FiDollarSign className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Donated</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${funeral.total_donated.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Donation Records</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {donations.length} donation{donations.length !== 1 ? 's' : ''} recorded
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
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No donations</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No donations have been made to this funeral yet.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Donor
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            In Name Of
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {donations.map((donation) => (
                          <tr key={donation.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <FiUser className="h-5 w-5 text-gray-500" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {donation.donor_name || "Anonymous"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {donation.donor_phone_number || "No phone"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                ${parseFloat(donation.amount || "0").toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {donation.mode_of_payment || "Not specified"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {donation.donating_in_name_of || "Not specified"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${donation.flagged ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {donation.flagged ? 'Flagged' : 'Valid'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {donation.flagged && donation.flag_reason ? (
                                <button
                                  onClick={() => openModal(donation.flag_reason)}
                                  className="text-blue-600 hover:text-blue-900 flex items-center"
                                >
                                  <FiFlag className="h-4 w-4 mr-1" />
                                  View Flag
                                </button>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/30"
      onClick={closeModal} // Optional: Close modal when clicking the background
    ></div>

    {/* Modal content */}
    <div className="relative bg-white rounded-lg shadow-xl sm:max-w-lg w-full z-60">
      <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <FiFlag className="h-6 w-6 text-red-600" />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Flagged Donation</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                <span className="font-medium">Reason:</span> {selectedFlagReason || "No reason provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          onClick={closeModal}
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default ViewFuneralDetail;