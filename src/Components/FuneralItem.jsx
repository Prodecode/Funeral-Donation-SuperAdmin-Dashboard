import React from 'react'

const FuneralItem = ({ name, date, donations }) => {
  return (
    <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <div className="font-bold">{donations}</div>
    </div>
  );
};

export default FuneralItem
