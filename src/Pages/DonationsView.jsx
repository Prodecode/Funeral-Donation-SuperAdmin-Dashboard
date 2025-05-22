import React from 'react';
import { FiDollarSign, FiUser, FiCalendar } from 'react-icons/fi';
import SideBar from '../Components/SideBar';

const DonationsView = () => {
  const donations = [
    {
      id: 1,
      funeral: "John Doe",
      donor: "Michael Brown",
      amount: 200,
      date: "2023-06-10",
      method: "Credit Card"
    },
    {
      id: 2,
      funeral: "Jane Smith",
      donor: "Sarah Johnson",
      amount: 100,
      date: "2023-06-08",
      method: "PayPal"
    },
    {
      id: 3,
      funeral: "John Doe",
      donor: "David Wilson",
      amount: 50,
      date: "2023-06-05",
      method: "Bank Transfer"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <SideBar />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Donations</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funeral</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations.map((donation) => (
                <tr key={donation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{donation.funeral}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.donor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${donation.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.method}</td>
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

export default DonationsView;