import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiUsers,
  FiDollarSign,
  FiSettings,
} from "react-icons/fi";
import StatCard from "../Components/StatCard";
import FuneralItem from "../Components/FuneralItem";
import SideBar from "../Components/SideBar";

const Dashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
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
        // console.log(res.data);
        setAdmins(res.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("FuneralToken"); // optional: clear token
          navigate("/"); // adjust path to your actual sign-in route
        } else {
          console.error("Failed to fetch admins", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <SideBar />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard title="Active Funerals" value="12" icon={<FiUsers />} />
            <StatCard title="Total Donations" value="₵8,450" icon={<FiDollarSign />} />
            <StatCard title="Recent Activity" value="5 New" icon={<FiSettings />} />
          </div>

          <div className="bg-white mb-8 p-4 rounded-lg shadow">
            <h3 className="font-bold mb-4">Recent Funerals</h3>
            <div className="space-y-4">
              <FuneralItem name="John Doe" date="May 15, 2023" donations="₵1,200" />
              <FuneralItem name="Jane Smith" date="May 10, 2023" donations="₵950" />
              <FuneralItem name="Robert Johnson" date="May 5, 2023" donations="₵1,500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-gray-800">Funeral Administrators</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="px-6 py-4 text-gray-500">Loading...</div>
                ) : admins.length === 0 ? (
                  <div className="px-6 py-4 text-gray-500">No administrators found.</div>
                ) : (
                  admins.map((admin) => (
                    <div key={admin.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
                          {admin.email?.charAt(0) || "?"}
                        </div>
                        <div className="ml-4">
                          <div className="text-lg font-medium text-gray-900">
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
