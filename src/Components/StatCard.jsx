import React from 'react'

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-center">
      <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
        {icon}
      </div>
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatCard
