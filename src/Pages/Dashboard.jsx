import React, { useState } from "react";
import {
  FiHome,
  FiPlusCircle,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import CreateFuneral from "./CreateFuneral";
import ManageFunerals from "./ManageFunerals";
import StatCard from "../Components/StatCard";
import FuneralItem from "../Components/FuneralItem";
import SideBar from "../Components/SideBar";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <SideBar />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <StatCard title="Active Funerals" value="12" icon={<FiUsers />} />
              <StatCard
                title="Total Donations"
                value="$8,450"
                icon={<FiDollarSign />}
              />
              <StatCard
                title="Recent Activity"
                value="5 New"
                icon={<FiSettings />}
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold mb-4">Recent Funerals</h3>
              <div className="space-y-4">
                <FuneralItem
                  name="John Doe"
                  date="May 15, 2023"
                  donations="$1,200"
                />
                <FuneralItem
                  name="Jane Smith"
                  date="May 10, 2023"
                  donations="$950"
                />
                <FuneralItem
                  name="Robert Johnson"
                  date="May 5, 2023"
                  donations="$1,500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardOverview = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Active Funerals" value="12" icon={<FiUsers />} />
        <StatCard
          title="Total Donations"
          value="$8,450"
          icon={<FiDollarSign />}
        />
        <StatCard title="Recent Activity" value="5 New" icon={<FiSettings />} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold mb-4">Recent Funerals</h3>
        <div className="space-y-4">
          <FuneralItem name="John Doe" date="May 15, 2023" donations="$1,200" />
          <FuneralItem name="Jane Smith" date="May 10, 2023" donations="$950" />
          <FuneralItem
            name="Robert Johnson"
            date="May 5, 2023"
            donations="$1,500"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
